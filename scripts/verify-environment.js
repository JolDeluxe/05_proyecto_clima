/**
 * Script de verificación técnica de entorno para GPTW-MBC
 * Valida Node.js, dependencias nativas (better-sqlite3), base de datos SQLite y variables de entorno.
 */

const fs = require("fs");
const path = require("path");

const REQUIRED_NODE_MAJOR = 22;

console.log("==================================================");
console.log(" AUDITORÍA DE ENTORNO: GPTW-MBC");
console.log("==================================================");

let hasErrors = false;

// 1. Verificación de versión de Node.js
const nodeVersion = process.version;
const nodeMajor = parseInt(process.versions.node.split(".")[0], 10);
const nodeAbi = process.versions.modules;
console.log(`[1] Node.js detectado: ${nodeVersion} (ABI / NODE_MODULE_VERSION: ${nodeAbi})`);

if (nodeMajor !== REQUIRED_NODE_MAJOR) {
  if (nodeMajor >= 26) {
    console.error(`❌ ERROR CRÍTICO: Se detectó Node.js ${nodeVersion}.`);
    console.error(`   better-sqlite3@12.6.2 NO dispone de binarios precompilados para Node.js ${nodeMajor}+.`);
    console.error(`   Esto obliga a compilar con node-gyp (requiere Python y Visual C++ Build Tools).`);
    console.error(`   SOLUCIÓN: Instale Node.js LTS v22.x (recomendado v22.18.0) para usar binarios nativos oficiales.`);
    hasErrors = true;
  } else {
    console.warn(`⚠️ ADVERTENCIA: La versión recomendada y testeada es Node.js LTS v22.x (detectado: ${nodeVersion}).`);
  }
} else {
  console.log(`✅ Versión de Node.js compatible con binarios precompilados (Node.js 22 LTS).`);
}

// 2. Verificación de carga de better-sqlite3
console.log(`\n[2] Verificando módulo nativo better-sqlite3...`);
try {
  const Database = require("better-sqlite3");
  const memDb = new Database(":memory:");
  memDb.exec("CREATE TABLE _test (id INTEGER PRIMARY KEY, valor TEXT);");
  memDb.prepare("INSERT INTO _test (valor) VALUES (?)").run("prueba_ok");
  const row = memDb.prepare("SELECT valor FROM _test WHERE id = 1").get();
  memDb.close();

  if (row && row.valor === "prueba_ok") {
    console.log(`✅ better-sqlite3 cargó y ejecutó operaciones SQLite (lectura/escritura) en memoria exitosamente.`);
  } else {
    throw new Error("Respuesta inesperada al validar SQLite en memoria.");
  }
} catch (err) {
  console.error(`❌ ERROR al inicializar better-sqlite3:`, err.message);
  hasErrors = true;
}

// 3. Verificación de archivo de base de datos
console.log(`\n[3] Verificando base de datos del proyecto...`);
const dbPath = path.resolve(process.cwd(), "dev.db");
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log(`✅ Archivo dev.db encontrado (${(stats.size / 1024).toFixed(2)} KB).`);

  try {
    const Database = require("better-sqlite3");
    const db = new Database(dbPath, { readonly: true });
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = tables.map(t => t.name);
    db.close();

    console.log(`   Tablas encontradas: ${tableNames.join(", ")}`);
    const expectedTables = ["User", "Area", "Departamento", "SubDepartamento", "UserPermission"];
    const missingTables = expectedTables.filter(t => !tableNames.includes(t));

    if (missingTables.length === 0) {
      console.log(`✅ Todas las tablas requeridas por Prisma están presentes.`);
    } else {
      console.warn(`⚠️ Faltan tablas en dev.db: ${missingTables.join(", ")}. Ejecute 'npx prisma migrate deploy'.`);
    }
  } catch (err) {
    console.error(`❌ ERROR al leer dev.db:`, err.message);
    hasErrors = true;
  }
} else {
  console.warn(`⚠️ Archivo dev.db NO existe en ${dbPath}.`);
  console.warn(`   En una instalación limpia, ejecute 'npx prisma migrate deploy' para crear la estructura.`);
}

// 4. Verificación de variables de entorno (.env)
console.log(`\n[4] Verificando variables de entorno...`);
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  console.log(`✅ Archivo .env encontrado.`);
  require("dotenv").config();

  if (!process.env.JWT_SECRET) {
    console.warn(`⚠️ JWT_SECRET no está definido en .env.`);
  } else {
    console.log(`✅ JWT_SECRET está configurado.`);
  }

  const imagesPath = process.env.IMAGES_BASE_PATH || String.raw`H:\AUDITOR INTERNO\PRIVADO\5 Isaac\Clima`;
  console.log(`   Ruta de imágenes configurada: ${imagesPath}`);
  if (fs.existsSync(imagesPath)) {
    console.log(`✅ Ruta de imágenes accesible.`);
  } else {
    console.warn(`⚠️ Ruta de imágenes no existe o no es accesible actualmente en este entorno.`);
    console.warn(`   Configure IMAGES_BASE_PATH en .env con la ruta válida en este servidor.`);
  }
} else {
  console.warn(`⚠️ Archivo .env no existe. Copie .env.example a .env antes de arrancar.`);
}

console.log("\n==================================================");
if (hasErrors) {
  console.error("❌ LA AUDITORÍA ENCONTRÓ ERRORES CRÍTICOS.");
  process.exit(1);
} else {
  console.log("✅ AUDITORÍA COMPLETADA SATISFACTORIAMENTE.");
  process.exit(0);
}
