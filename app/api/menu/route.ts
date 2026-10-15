import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUserFromToken } from "@/app/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  // Intentar obtener usuario desde la cookie
  let user = await getUserFromToken();

  // Fallback: si la cookie no llegó por tema de dominio de Cloudflare, obtener por query param
  if (!user) {
    const { searchParams } = new URL(request.url);
    const usernameParam = searchParams.get("username");
    if (usernameParam) {
      const foundUser = await prisma.user.findUnique({
        where: { username: usernameParam },
      });
      if (foundUser) {
        user = {
          id: foundUser.id,
          username: foundUser.username,
          nombre: foundUser.nombre,
          role: foundUser.role,
        };
      }
    }
  }

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      permisos: {
        include: {
          subDepartamento: {
            include: {
              departamento: {
                include: {
                  area: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "Usuario no existe" }, { status: 404 });
  }

  // ===============================
  // NIVEL 1 → VE ABSOLUTAMENTE TODO
  // ===============================
  if (dbUser.role === "NIVEL 1") {
    const menuCompleto = await prisma.area.findMany({
      orderBy: { orden: "asc" },
      include: {
        departamentos: {
          orderBy: { orden: "asc" },
          include: {
            subdepartamentos: {
              orderBy: { orden: "asc" },
              select: {
                id: true,
                nombre: true,
                imageName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(menuCompleto, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  // ===============================
  // FILTROS BASE PARA OTROS NIVELES
  // ===============================
  let areaWhere: any = {};
  let deptoWhere: any = {};
  let subDeptoWhere: any = {};

  // ===============================
  // NIVEL 2 → TODO MENOS DIRECCION
  // ===============================
  if (dbUser.role === "NIVEL 2") {
    areaWhere = {
      nombre: { not: "DIRECCION" },
    };
  }

  // ===============================
  // NIVEL 3 → TODA SU ÁREA
  // ===============================
  else if (dbUser.role === "NIVEL 3") {
    const areaIds = [
      ...new Set(
        dbUser.permisos.map(
          p => p.subDepartamento.departamento.area.id
        )
      ),
    ];

    areaWhere = {
      id: { in: areaIds },
    };
  }

  // ===============================
  // NIVEL 4 → TODO SU DEPARTAMENTO
  // ===============================
  else if (dbUser.role === "NIVEL 4") {
    const deptoIds = [
      ...new Set(
        dbUser.permisos.map(
          p => p.subDepartamento.departamento.id
        )
      ),
    ];

    deptoWhere = {
      id: { in: deptoIds },
    };
  }

  // ===============================
  // NIVEL 5 → SOLO SU SUBDEPTO
  // ===============================
  else {
    subDeptoWhere = {
      id: { in: dbUser.permisos.map(p => p.subDepartamentoId) },
    };
  }

  // ===============================
  // QUERY FINAL PARA OTROS NIVELES
  // ===============================
  const menu = await prisma.area.findMany({
    where: {
      ...areaWhere,
      departamentos: {
        some: {
          ...deptoWhere,
          subdepartamentos: {
            some: subDeptoWhere,
          },
        },
      },
    },
    orderBy: { orden: "asc" },
    include: {
      departamentos: {
        where: {
          ...deptoWhere,
          subdepartamentos: {
            some: subDeptoWhere,
          },
        },
        orderBy: { orden: "asc" },
        include: {
          subdepartamentos: {
            where: subDeptoWhere,
            orderBy: { orden: "asc" },
            select: {
              id: true,
              nombre: true,
              imageName: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(menu, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
