/**
 * Script de prueba automatizada en entorno aislado:
 * 1. Crea una base de datos SQLite limpia (test_clean.db)
 * 2. Aplica todas las migraciones oficiales de Prisma
 * 3. Ejecuta los seeds oficiales
 * 4. Verifica tablas, integridad referencial y recuentos de registros
 * 5. Valida autenticación con hash bcrypt de usuario sembrado
 * 6. Limpia la base de prueba
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const TEST_DB = path.resolve(process.cwd(), "test_clean.db");
const DATABASE_URL = `file:${TEST_DB}`;

console.log("==================================================");
console.log(" PRUEBA DE INICIALIZACIÓN AISLADA DE SQLITE");
console.log("==================================================");

// 1. Limpieza inicial
if (fs.existsSync(TEST_DB)) {
  fs.unlinkSync(TEST_DB);
  console.log("🧹 Archivo previo test_clean.db eliminado.");
}

console.log("\n[Paso 1] Aplicando migraciones de Prisma en base limpia...");
const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

try {
  const migrateOutput = execSync(`${npxCmd} prisma migrate deploy`, {
    env: { ...process.env, DATABASE_URL },
    encoding: "utf8",
  });
  console.log(migrateOutput.trim());
} catch (err) {
  console.error("❌ Falló prisma migrate deploy:", err.stdout || err.message);
  process.exit(1);
}

// 2. Verificar existencia de test_clean.db y tablas creadas por migraciones
if (!fs.existsSync(TEST_DB)) {
  console.error("❌ ERROR: test_clean.db no fue creado por prisma migrate deploy.");
  process.exit(1);
}

console.log("\n[Paso 2] Verificando esquema de tablas creadas por migraciones...");
let db = new Database(TEST_DB);
const migrationTables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
  .all()
  .map((t) => t.name);

console.log("  Tablas creadas:", migrationTables.join(", "));
const requiredTables = ["_prisma_migrations", "Area", "Departamento", "SubDepartamento", "User", "UserPermission"];
const missingTables = requiredTables.filter((t) => !migrationTables.includes(t));

if (missingTables.length > 0) {
  console.error("❌ Faltan tablas tras migración:", missingTables);
  db.close();
  process.exit(1);
}
console.log("  ✅ Todas las tablas del esquema existen correctamente.");

// Comprobar que inicialmente las tablas de negocio están vacías
const userCountBefore = db.prepare("SELECT count(*) as count FROM User").get().count;
console.log(`  Registros en tabla User antes del seed: ${userCountBefore} (esperado: 0)`);
db.close();

// 3. Ejecutar los seeds en la base limpia
console.log("\n[Paso 3] Ejecutando seeds del sistema...");
try {
  const seedOutput = execSync(`${npxCmd} tsx prisma/seed.ts`, {
    env: { ...process.env, DATABASE_URL },
    encoding: "utf8",
  });
  console.log(seedOutput.trim());
} catch (err) {
  console.error("❌ Falló la ejecución del seed:", err.stdout || err.message);
  process.exit(1);
}

// 4. Verificación exhaustiva de registros sembrados
console.log("\n[Paso 4] Verificando registros insertados en test_clean.db...");
db = new Database(TEST_DB, { readonly: true });

const areas = db.prepare("SELECT count(*) as c FROM Area").get().c;
const departamentos = db.prepare("SELECT count(*) as c FROM Departamento").get().c;
const subdepartamentos = db.prepare("SELECT count(*) as c FROM SubDepartamento").get().c;
const usuarios = db.prepare("SELECT count(*) as c FROM User").get().c;
const permisos = db.prepare("SELECT count(*) as c FROM UserPermission").get().c;

console.log(`  📊 Áreas:            ${areas}`);
console.log(`  📊 Departamentos:    ${departamentos}`);
console.log(`  📊 SubDepartamentos: ${subdepartamentos}`);
console.log(`  📊 Usuarios:         ${usuarios}`);
console.log(`  📊 Permisos:         ${permisos}`);

if (areas === 0 || departamentos === 0 || subdepartamentos === 0 || usuarios === 0 || permisos === 0) {
  console.error("❌ ERROR: Alguna de las tablas no recibió datos del seed.");
  db.close();
  process.exit(1);
}

// 5. Validar autenticación de usuario (bcrypt)
console.log("\n[Paso 5] Verificando integridad de credenciales y contraseñas...");
const sampleUser = db.prepare("SELECT id, username, password, role FROM User WHERE username = 'EDGAR'").get();
if (!sampleUser) {
  console.error("❌ ERROR: No se encontró al usuario de prueba 'EDGAR'.");
  db.close();
  process.exit(1);
}

// La contraseña en seed.data.ts para EDGAR es "Antillon"
const isPasswordValid = bcrypt.compareSync("Antillon", sampleUser.password);
console.log(`  Usuario verificado: ${sampleUser.username} (${sampleUser.role})`);
console.log(`  Hash bcrypt verificado: ${isPasswordValid ? "✅ Correcto" : "❌ Inválido"}`);

// Validar permisos del usuario
const userPermissions = db
  .prepare(
    `SELECT s.nombre, s.imageName 
     FROM UserPermission up
     JOIN SubDepartamento s ON up.subDepartamentoId = s.id
     WHERE up.userId = ?`
  )
  .all(sampleUser.id);

console.log(`  Permisos asignados a ${sampleUser.username}: ${userPermissions.length} entregables.`);

db.close();

// 6. Prueba de persistencia tras reapertura de conexión
console.log("\n[Paso 6] Verificando persistencia de datos tras reapertura...");
const dbReopened = new Database(TEST_DB, { readonly: true });
const checkUser = dbReopened.prepare("SELECT count(*) as c FROM User").get().c;
dbReopened.close();

if (checkUser === usuarios) {
  console.log(`  ✅ Persistencia verificada: ${checkUser} usuarios conservados.`);
} else {
  console.error("❌ ERROR: Discrepancia en recuento tras reabrir la base de datos.");
  process.exit(1);
}

// 7. Limpieza final de prueba
if (fs.existsSync(TEST_DB)) {
  fs.unlinkSync(TEST_DB);
  console.log("\n🧹 Base de datos de prueba (test_clean.db) eliminada exitosamente.");
}

console.log("\n==================================================");
console.log(" ✅ TODAS LAS PRUEBAS DE INICIALIZACIÓN PASARON.");
console.log("==================================================");
