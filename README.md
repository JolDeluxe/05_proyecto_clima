# GPTW-MBC - Plataforma de Clima Laboral

Sistema web para consulta y presentación de resultados de Clima Laboral (Great Place to Work) de Manufacturera de Botas Cuadra (MBC).

## 🚀 Pila Tecnológica

- **Framework:** Next.js 16 (App Router, Webpack)
- **UI:** React 19, Tailwind CSS 4
- **ORM / Base de Datos:** Prisma 7 + SQLite (`better-sqlite3` driver adapter)
- **Autenticación:** JWT + Cookies HttpOnly + bcryptjs
- **PWA:** `next-pwa`
- **Gestor de Procesos en Producción:** PM2
- **Runtime:** Node.js 22 LTS

---

## 🛠️ Entorno de Desarrollo

### Requisitos
- Node.js `^22.12.0` (recomendado: `v22.18.0`)
- npm `^10.9.0`

### Puesta en marcha
1. Instalar dependencias:
   ```bash
   npm ci
   ```
2. Configurar `.env` (basado en `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Ejecutar servidor de desarrollo en puerto 3001:
   ```bash
   npm run dev
   ```

---

## 🖥️ Despliegue en Producción (Windows Server 2025)

Para el procedimiento completo, requisitos y comandos detallados para producción con PM2 en Windows Server 2025, consulte la guía:

👉 **[DEPLOY_WINDOWS_SERVER.md](./DEPLOY_WINDOWS_SERVER.md)**

### Despliegue Automatizado
En el servidor Windows Server 2025, una vez descargado el código vía Git:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-production.ps1
```

### Diagnóstico de Entorno
```powershell
node scripts/verify-environment.js
```
