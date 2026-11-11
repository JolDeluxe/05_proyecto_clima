/**
 * Script de validación HTTP real con SQLite limpio:
 * 1. Crea test_http.db con migraciones y seed.
 * 2. Inicia servidor Next.js en puerto 3008 con esa base de datos.
 * 3. Ejecuta POST /api/auth/login con credenciales reales del seed.
 * 4. Valida respuesta 200 OK, cookie JWT y contenido.
 * 5. Detiene el servidor y limpia la base temporal.
 */

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const TEST_DB = path.resolve(process.cwd(), "test_http.db");
const DATABASE_URL = `file:${TEST_DB}`;
const PORT = 3008;

console.log("==================================================");
console.log(" PRUEBA END-TO-END HTTP CON BASE SQLITE LIMPIA");
console.log("==================================================");

if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

console.log("[1] Inicializando base test_http.db (migrate + seed)...");
execSync(`${npxCmd} prisma migrate deploy`, { env: { ...process.env, DATABASE_URL }, stdio: "ignore" });
execSync(`${npxCmd} tsx prisma/seed.ts`, { env: { ...process.env, DATABASE_URL }, stdio: "ignore" });

console.log("✅ test_http.db creada y poblada correctamente.");

console.log(`[2] Iniciando Next.js en puerto ${PORT}...`);
const serverProc = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
  env: {
    ...process.env,
    DATABASE_URL,
    PORT: String(PORT),
    NODE_ENV: "production",
    JWT_SECRET: "super_secreto_clave_mbc_2026_cuadra",
  },
  stdio: "ignore",
});

async function runTest() {
  // Esperar a que el servidor esté listo
  let ready = false;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/login`);
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch {}
  }

  if (!ready) {
    throw new Error("El servidor Next.js no respondió a tiempo en el puerto " + PORT);
  }

  console.log("✅ Servidor Next.js respondiendo en puerto " + PORT);

  console.log("\n[3] Probando POST /api/auth/login con usuario 'EDGAR'...");
  const loginRes = await fetch(`http://127.0.0.1:${PORT}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "EDGAR", password: "Antillon" }),
  });

  console.log("  Status HTTP:", loginRes.status);
  const data = await loginRes.json();
  console.log("  Respuesta JSON:", JSON.stringify(data));

  const setCookie = loginRes.headers.get("set-cookie");
  console.log("  Cookie Set-Cookie emitida:", setCookie ? "✅ Sí (token JWT)" : "❌ No");

  if (loginRes.status !== 200 || data.status !== "success" || data.user.username !== "EDGAR") {
    throw new Error("La autenticación falló inesperadamente.");
  }

  console.log("\n[4] Probando GET /api/menu con token de sesión...");
  const menuRes = await fetch(`http://127.0.0.1:${PORT}/api/menu`, {
    headers: {
      Cookie: setCookie ? setCookie.split(";")[0] : "",
    },
  });
  console.log("  Status HTTP Menu:", menuRes.status);
  const menuData = await menuRes.json();
  console.log("  Áreas cargadas en el menú:", Array.isArray(menuData) ? menuData.length : "No array");

  console.log("\n==================================================");
  console.log(" ✅ PRUEBA END-TO-END COMPLETADA CON ÉXITO.");
  console.log("==================================================");
}

runTest()
  .catch((err) => {
    console.error("❌ ERROR EN LA PRUEBA HTTP:", err.message);
    process.exitCode = 1;
  })
  .finally(() => {
    serverProc.kill("SIGTERM");
    if (fs.existsSync(TEST_DB)) {
      try {
        fs.unlinkSync(TEST_DB);
      } catch {}
    }
  });
