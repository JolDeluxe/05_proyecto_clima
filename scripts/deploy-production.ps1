<#
.SYNOPSIS
    Script de despliegue automatizado y seguro para GPTW-MBC en Windows Server 2025.
.DESCRIPTION
    Realiza validaciones de entorno, instalación limpia con npm ci, compilación Next.js,
    migraciones no destructivas de Prisma y gestión de procesos con PM2.
    Protege archivos .env, bases de datos SQLite y datos persistentes.
#>

[CmdletBinding()]
param (
    [switch]$SkipBuild = $false,
    [switch]$NoReload = $false,
    [switch]$Seed = $false
)

$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  GPTW-MBC: Despliegue de Producción (Windows Server 2025)  " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# ----------------------------------------------------------------------
# 1. Ubicar la raíz del proyecto
# ----------------------------------------------------------------------
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path
Set-Location $ProjectRoot

Write-Host "`n[1/7] Verificando ubicación del proyecto..." -ForegroundColor Yellow
Write-Host "  Directorio de trabajo: $ProjectRoot"

if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: No se encontró package.json en el directorio actual." -ForegroundColor Red
    exit 1
}

$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
if ($pkg.name -ne "05_proyecto_clima") {
    Write-Host "❌ ERROR: package.json no corresponde al proyecto '05_proyecto_clima' (detectado: $($pkg.name))." -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Raíz del proyecto verificada correctamente ($($pkg.name) v$($pkg.version))." -ForegroundColor Green

# ----------------------------------------------------------------------
# 2. Validar versión de Node.js y ejecutables
# ----------------------------------------------------------------------
Write-Host "`n[2/7] Verificando versión de Node.js y herramientas..." -ForegroundColor Yellow

try {
    $nodeVersionRaw = (& node -v) 2>&1
} catch {
    Write-Host "❌ ERROR: Node.js no está instalado o no se encuentra en el PATH del sistema." -ForegroundColor Red
    exit 1
}

$nodeVersion = $nodeVersionRaw.ToString().Trim()
Write-Host "  Versión detectada de Node.js: $nodeVersion"

if ($nodeVersion -match "^v(\d+)\.") {
    $nodeMajor = [int]$matches[1]
} else {
    Write-Host "❌ ERROR: No se pudo determinar la versión mayor de Node.js: $nodeVersion" -ForegroundColor Red
    exit 1
}

# better-sqlite3@12.6.2 dispone de binarios precompilados para Node 20, 22, 24.
# Node 26 carece de binarios y exige python/node-gyp/C++ compiler.
if ($nodeMajor -ge 26) {
    Write-Host "❌ ERROR CRÍTICO DE COMPATIBILIDAD:" -ForegroundColor Red
    Write-Host "  Node.js $nodeVersion es incompatible con better-sqlite3@12.6.2 sin herramientas de compilación C++." -ForegroundColor Red
    Write-Host "  Node.js 26 no tiene binarios precompilados disponibles, lo que activa node-gyp y falla por falta de Python." -ForegroundColor Red
    Write-Host "  ACCIÓN REQUERIDA:" -ForegroundColor Yellow
    Write-Host "    Instale Node.js LTS v22.x (versión recomendada: v22.18.0) en Windows Server." -ForegroundColor Yellow
    Write-Host "    Descargue el instalador oficial de https://nodejs.org (LTS v22)." -ForegroundColor Yellow
    exit 1
} elseif ($nodeMajor -lt 20) {
    Write-Host "❌ ERROR: Este proyecto requiere Node.js LTS >= 20.x (recomendado Node.js 22 LTS). Versión actual: $nodeVersion" -ForegroundColor Red
    exit 1
} elseif ($nodeMajor -ne 22) {
    Write-Host "  ⚠️ ADVERTENCIA: Se recomienda Node.js 22 LTS (actual: $nodeVersion). Procediendo con precaución..." -ForegroundColor Yellow
} else {
    Write-Host "  ✅ Node.js $nodeVersion es totalmente compatible (dispone de binarios precompilados para win32-x64)." -ForegroundColor Green
}

# En Windows, usar .cmd para evitar bugs de MyInvocation en npm.ps1
$npmCmdObj = Get-Command "npm.cmd" -ErrorAction SilentlyContinue
if ($npmCmdObj) { $npmCmd = $npmCmdObj.Source } else { $npmCmd = "npm" }

$npxCmdObj = Get-Command "npx.cmd" -ErrorAction SilentlyContinue
if ($npxCmdObj) { $npxCmd = $npxCmdObj.Source } else { $npxCmd = "npx" }

$pm2Cmd = $null
$pm2CmdObj = Get-Command "pm2.cmd" -ErrorAction SilentlyContinue
if ($pm2CmdObj) {
    $pm2Cmd = $pm2CmdObj.Source
} else {
    $pm2Fallback = Get-Command "pm2" -ErrorAction SilentlyContinue
    if ($pm2Fallback) { $pm2Cmd = $pm2Fallback.Source }
}

# ----------------------------------------------------------------------
# 3. Verificar archivos requeridos y persistencia (.env y base de datos)
# ----------------------------------------------------------------------
Write-Host "`n[3/7] Verificando archivos de configuración y persistencia..." -ForegroundColor Yellow

# Verificar .env (NUNCA SOBRESCRIBIR)
if (-not (Test-Path ".env")) {
    Write-Host "⚠️ ADVERTENCIA: No se encontró el archivo .env en producción." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Write-Host "  Se ha creado una plantilla inicial copiando .env.example -> .env..." -ForegroundColor Cyan
        Copy-Item ".env.example" ".env"
        Write-Host "  ❗ IMPORTANTE: Revise y configure las variables en .env (DATABASE_URL, JWT_SECRET, IMAGES_BASE_PATH)." -ForegroundColor Yellow
    } else {
        Write-Host "❌ ERROR: Se requiere el archivo .env para continuar." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  ✅ Archivo .env existente preservado (no modificado)." -ForegroundColor Green
}

# Asegurar carpeta de logs para PM2
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" -Force | Out-Null
    Write-Host "  ✅ Directorio logs/ creado para registro de PM2." -ForegroundColor Green
}

# Base de datos SQLite (NUNCA BORRAR)
if (Test-Path "dev.db") {
    $dbSize = (Get-Item "dev.db").Length
    Write-Host "  ✅ Base de datos SQLite preservada (dev.db, tamaño: $([math]::Round($dbSize / 1KB, 2)) KB)." -ForegroundColor Green
} else {
    Write-Host "  ℹ️ Archivo dev.db no existe aún. Será inicializado por Prisma migrate." -ForegroundColor Cyan
}

# ----------------------------------------------------------------------
# 4. Instalación limpia de dependencias (npm ci)
# ----------------------------------------------------------------------
Write-Host "`n[4/7] Instalando dependencias con 'npm ci'..." -ForegroundColor Yellow
Write-Host "  Ejecutando npm ci de manera limpia según package-lock.json..."

& $npmCmd ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: La instalación con 'npm ci' falló (código de salida $LASTEXITCODE)." -ForegroundColor Red
    Write-Host "  Verifique que la versión de Node.js sea compatible y que haya conexión a internet." -ForegroundColor Yellow
    exit $LASTEXITCODE
}
Write-Host "  ✅ Dependencias instaladas satisfactoriamente." -ForegroundColor Green

# ----------------------------------------------------------------------
# 5. Generación de Prisma y migraciones no destructivas
# ----------------------------------------------------------------------
Write-Host "`n[5/7] Configurando base de datos con Prisma..." -ForegroundColor Yellow

Write-Host "  Generando cliente de Prisma..."
& $npxCmd prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: 'prisma generate' falló (código de salida $LASTEXITCODE)." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "  Aplicando migraciones pendientes (modo deploy, NO destructivo)..."
& $npxCmd prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: 'prisma migrate deploy' falló (código de salida $LASTEXITCODE)." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "  ✅ Base de datos sincronizada con migraciones de producción." -ForegroundColor Green

if ($Seed) {
    Write-Host "  🌱 Sembrando datos iniciales (-Seed especificado)..." -ForegroundColor Yellow
    & $npxCmd tsx prisma/seed.ts
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: 'prisma/seed.ts' falló (código de salida $LASTEXITCODE)." -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "  ✅ Base de datos poblada exitosamente con datos del sistema." -ForegroundColor Green
}

# ----------------------------------------------------------------------
# 6. Compilación de Next.js
# ----------------------------------------------------------------------
if (-not $SkipBuild) {
    Write-Host "`n[6/7] Compilando aplicación Next.js para producción..." -ForegroundColor Yellow
    & $npmCmd run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: La compilación de Next.js falló (código de salida $LASTEXITCODE)." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    if (-not (Test-Path ".next")) {
        Write-Host "❌ ERROR: El directorio de compilación '.next' no fue generado." -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✅ Compilación finalizada exitosamente." -ForegroundColor Green
} else {
    Write-Host "`n[6/7] Omitiendo compilación (-SkipBuild especificado)." -ForegroundColor Cyan
}

# ----------------------------------------------------------------------
# 7. Gestión de servicio con PM2
# ----------------------------------------------------------------------
Write-Host "`n[7/7] Gestionando proceso en PM2..." -ForegroundColor Yellow

if (-not $pm2Cmd) {
    Write-Host "⚠️ PM2 no está disponible globalmente en este sistema." -ForegroundColor Yellow
    Write-Host "  Para instalar PM2 globalmente ejecute:" -ForegroundColor Cyan
    Write-Host "    npm install -g pm2" -ForegroundColor Cyan
    Write-Host "  O inicie la aplicación manualmente con:" -ForegroundColor Cyan
    Write-Host "    npm run start" -ForegroundColor Cyan
} else {
    if (-not (Test-Path "ecosystem.config.js")) {
        Write-Host "❌ ERROR: No se encontró ecosystem.config.js." -ForegroundColor Red
        exit 1
    }

    # Comprobar si el proceso ya existe en PM2 sin disparar NativeCommandError
    $isProcessRunning = $false
    $savedEAP = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    try {
        $pm2ListOutput = (& $pm2Cmd list) | Out-String
        if ($pm2ListOutput -match "gptw-mbc") {
            $isProcessRunning = $true
        }
    } catch {
        $isProcessRunning = $false
    }
    $ErrorActionPreference = $savedEAP

    if ($isProcessRunning -and -not $NoReload) {
        Write-Host "  Proceso 'gptw-mbc' detectado en PM2. Reiniciando de forma segura..." -ForegroundColor Cyan
        & $pm2Cmd reload ecosystem.config.js --only gptw-mbc
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  Reload falló. Intentando reinicio directo..." -ForegroundColor Yellow
            & $pm2Cmd restart gptw-mbc
        }
    } else {
        Write-Host "  Iniciando proceso 'gptw-mbc' en PM2..." -ForegroundColor Cyan
        & $pm2Cmd start ecosystem.config.js --only gptw-mbc
    }

    Write-Host "  Guardando configuración de procesos PM2..." -ForegroundColor Cyan
    & $pm2Cmd save

    Write-Host "`nEstado actual de PM2:" -ForegroundColor Cyan
    & $pm2Cmd status
}

Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "  ✅ DESPLIEGUE FINALIZADO EXITOSAMENTE                      " -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Aplicación disponible en: http://localhost:3001" -ForegroundColor Cyan
