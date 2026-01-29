import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as bcrypt from "bcryptjs";
import { AREAS, DEPARTAMENTOS, USUARIOS } from "./seed.data";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: "file:./dev.db" }),
});

export async function runSeed() {
  const areaMap = new Map<string, number>();
  const subDeptoMap = new Map<string, number>();

  // =====================
  // ÁREAS
  // =====================
  for (const area of AREAS) {
    const created = await prisma.area.create({
      data: { nombre: area.nombre, orden: area.orden },
    });
    areaMap.set(area.key, created.id);
  }

  // =====================
  // DEPARTAMENTOS + SUBDEPTOS
  // =====================
  for (const dep of DEPARTAMENTOS) {
    const departamento = await prisma.departamento.create({
      data: {
        nombre: dep.nombre,
        orden: dep.orden,
        areaId: areaMap.get(dep.area)!,
      },
    });

    for (const sub of dep.subDeptos) {
      const s = await prisma.subDepartamento.create({
        data: {
          nombre: sub.nombre,
          imageName: sub.image,
          orden: sub.orden,
          departamentoId: departamento.id,
        },
      });
      subDeptoMap.set(sub.image, s.id);
    }
  }

  // =====================
  // USUARIOS
  // =====================
  for (const user of USUARIOS) {
    const hash = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        username: user.username,
        password: hash,
        nombre: user.nombre,
        role: user.role,
        permisos: {
          create: user.permisos.map(img => ({
            subDepartamentoId: subDeptoMap.get(img)!,
          })),
        },
      },
    });
  }
}
