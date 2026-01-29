import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUserFromToken } from "@/app/lib/auth";

export async function GET() {
  const user = await getUserFromToken();
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
  // FILTROS BASE
  // ===============================
  let areaWhere: any = {};
  let deptoWhere: any = {};
  let subDeptoWhere: any = {};

  // ===============================
  // NIVEL 1 → TODO
  // ===============================
  if (dbUser.role === "NIVEL 1") {
    // sin filtros
  }

  // ===============================
  // NIVEL 2 → TODO MENOS DIRECCION
  // ===============================
  else if (dbUser.role === "NIVEL 2") {
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
  // QUERY FINAL
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

  return NextResponse.json(menu);
}
