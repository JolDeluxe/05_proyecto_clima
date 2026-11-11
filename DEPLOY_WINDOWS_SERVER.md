# Guía de Operación y Despliegue en Windows Server 2025: GPTW-MBC

Este documento establece el procedimiento oficial para inicializar y mantener la aplicación **GPTW-MBC (Clima Laboral)** en el servidor virtual con **Windows Server 2025 Standard Edition** en:
`C:\Servidor\Aplicaciones\GPTW-MBC\05_proyecto_clima`

---

## 1. Arquitectura de Datos y Ciclo de SQLite

### 1.1 Esquema de Tablas
La base de datos SQLite (`dev.db`) maneja las siguientes entidades relacionales:
- `_prisma_migrations`: Control cronológico de migraciones de Prisma.
- `Area`: Áreas macro de la empresa (7 registros: MBC, DIRECCION, etc.).
- `Departamento`: Departamentos agrupadores dentro de cada área (19 registros).
- `SubDepartamento`: Entregable visual real asociado a los archivos de reporte (`imageName`, 71 registros).
- `User`: Usuarios, credenciales (hash bcrypt) y roles (40 registros).
- `UserPermission`: Tabla pivote de permisos efectivos de visualización por usuario (142 registros).

### 1.2 Comandos Fundamentales de SQLite en Prisma
| Acción | Comando | Comportamiento |
| :--- | :--- | :--- |
| **Crear base y aplicar migraciones** | `npx prisma migrate deploy` | **Crea el archivo `.db` si no existe** y aplica las 4 migraciones de `prisma/migrations`. Es **100% no destructivo** (no borra tablas ni datos). |
| **Consultar estado de migraciones** | `npx prisma migrate status` | Comprueba si la base está al día respecto a los archivos SQL. |
| **Poblar datos iniciales (Seed)** | `npx tsx prisma/seed.ts` *(o `npx prisma db seed`)* | **Limpia** mediante `deleteMany()` e inserta las 7 áreas, 19 departamentos, 71 subdepartamentos, 40 usuarios y 142 permisos. **Solo debe ejecutarse en la primera instalación.** |

> [!CAUTION]
> **NUNCA ejecutes en producción:**
> - `npx prisma migrate dev` (solicita resetear la base).
> - `npx prisma migrate reset` (borra la base de datos).
> - `npx prisma db push --force-reset` (destruye esquemas existentes).

---

## 2. PROCEDIMIENTO A: PRIMERA INSTALACIÓN

Este procedimiento se ejecuta **una sola vez** en el servidor virtual nuevo.

### Paso 1: Verificar el Runtime de Node.js
El servidor debe tener instalado **Node.js LTS v22.18.0 (x64)**.
```powershell
node -v   # Debe responder v22.x.x
npm -v    # Debe responder v10.x.x
```
*(Si tiene Node.js 26+, desinstálelo e instale Node.js 22 LTS para contar con los binarios precompilados de `better-sqlite3` sin requerir Python).*

### Paso 2: Instalar PM2 globalmente
```powershell
npm install -g pm2
```

### Paso 3: Configurar variables de entorno (`.env`)
En `C:\Servidor\Aplicaciones\GPTW-MBC\05_proyecto_clima`:
```powershell
Copy-Item .env.example .env
notepad .env
```
Asegúrese de definir:
- `PORT=3001`
- `DATABASE_URL="file:./dev.db"`
- `JWT_SECRET="super_secreto_clave_mbc_2026_cuadra"`
- `IMAGES_BASE_PATH="C:\Servidor\Datos\Clima"` *(o ruta UNC `\\servidor\compartido\Clima`)*

### Paso 4: Inicialización completa automatizada (Un solo comando)
Ejecute el script de despliegue con la bandera `-Seed`:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-production.ps1 -Seed
```

*O si prefiere ejecutarlo paso a paso manualmente:*
```powershell
# A. Instalar dependencias estrictas
npm ci

# B. Generar cliente Prisma
npx prisma generate

# C. Crear la base SQLite dev.db y aplicar las migraciones
npx prisma migrate deploy

# D. Poblar las tablas con los datos maestros del sistema
npx tsx prisma/seed.ts

# E. Compilar la aplicación Next.js
npm run build

# F. Iniciar el servicio en segundo plano con PM2
pm2 start ecosystem.config.js --only gptw-mbc

# G. Guardar el estado de PM2
pm2 save
```

### Paso 5: Abrir el puerto en el Firewall de Windows
```powershell
New-NetFirewallRule -DisplayName "GPTW-MBC Clima (Puerto 3001)" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

---

## 3. PROCEDIMIENTO B: ACTUALIZACIONES POSTERIORES

Para desplegar nuevas versiones de código sin riesgo alguno de tocar la base de datos:

```powershell
cd C:\Servidor\Aplicaciones\GPTW-MBC\05_proyecto_clima

# 1. Traer cambios de Git
git pull origin main

# 2. Desplegar actualización de forma segura
powershell -ExecutionPolicy Bypass -File scripts\deploy-production.ps1
```

Este procedimiento de actualización:
- **NO ejecuta seeds** (preserva intactos los usuarios, permisos y datos modificados).
- **NO toca ni sobrescribe `.env`**.
- **Aplica únicamente migraciones pendientes si las hubiera** (`prisma migrate deploy`).
- **Compila la nueva versión** (`npm run build`).
- **Recarga la aplicación en PM2** (`pm2 reload ecosystem.config.js --only gptw-mbc`) con cero caída de servicio.

---

## 4. Diagnóstico y Comandos de Soporte

```powershell
# Diagnóstico de salud del entorno, base de datos y variables:
node scripts/verify-environment.js

# Prueba aislada de migraciones y seed en base temporal:
node scripts/test-isolated-db.js

# Ver estado de los procesos PM2:
pm2 status

# Ver logs en tiempo real:
pm2 logs gptw-mbc

# Reiniciar manualmente el servicio:
pm2 restart gptw-mbc
```
