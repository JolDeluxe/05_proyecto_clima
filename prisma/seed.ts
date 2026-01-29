import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { runSeed } from "./seed.engine";

// ======================================================
// CONFIGURACIÓN DE PRISMA
// ======================================================
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: "file:./dev.db",
  }),
});

// ======================================================
// FUNCIÓN PRINCIPAL
// ======================================================
async function main() {
  console.log("🧹 Limpiando base de datos...");

  // ⚠️ ORDEN IMPORTANTE (por relaciones)
  await prisma.userPermission.deleteMany();
  await prisma.subDepartamento.deleteMany();
  await prisma.departamento.deleteMany();
  await prisma.area.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Sembrando datos del sistema...");

  await runSeed();

  console.log("✅ Seed ejecutado correctamente.");
}

// ======================================================
// EJECUCIÓN
// ======================================================
main()
  .catch((error) => {
    console.error("❌ Error ejecutando seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
