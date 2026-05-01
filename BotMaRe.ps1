# ============================================================
#  BotMaRe - GRAVITY DASHBOARD PRO
#  Script de Control PowerShell v2.0
#  Uso: .\BotMaRe.ps1
# ============================================================
#Requires -Version 5.1

Set-StrictMode -Off
$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "BotMaRe - Gravity Dashboard Pro"

# ── Colores y utilidades ─────────────────────────────────────
function Write-Header {
    Clear-Host
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║                                                      ║" -ForegroundColor Cyan
    Write-Host "  ║        BOTMARE - GRAVITY DASHBOARD PRO               ║" -ForegroundColor Cyan
    Write-Host "  ║             PowerShell Edition v2.0                  ║" -ForegroundColor Cyan
    Write-Host "  ║                                                      ║" -ForegroundColor Cyan
    Write-Host "  ╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-OK    { param($msg) Write-Host "  [✓] $msg" -ForegroundColor Green }
function Write-Info  { param($msg) Write-Host "  [i] $msg" -ForegroundColor Cyan }
function Write-Warn  { param($msg) Write-Host "  [!] $msg" -ForegroundColor Yellow }
function Write-Err   { param($msg) Write-Host "  [✗] $msg" -ForegroundColor Red }
function Write-Step  { param($msg) Write-Host "  --> $msg" -ForegroundColor White }
function Write-Sep   { Write-Host "  ──────────────────────────────────────────────────────" -ForegroundColor DarkGray }

function Pause-Menu {
    Write-Host ""
    Write-Host "  Presiona cualquier tecla para volver al menu..." -ForegroundColor DarkGray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# ── Estado del proyecto ──────────────────────────────────────
function Get-ProjectStatus {
    $missing = @()
    @("node_modules", "backend\node_modules", "frontend\node_modules") | ForEach-Object {
        if (-not (Test-Path $_)) { $missing += $_ }
    }
    $envOk = (Test-Path "backend\.env") -and (Test-Path "frontend\.env")
    return @{ MissingDeps = $missing; EnvReady = $envOk }
}

# ════════════════════════════════════════════════════════════
#  MENU PRINCIPAL
# ════════════════════════════════════════════════════════════
function Show-Menu {
    while ($true) {
        Write-Header
        $status = Get-ProjectStatus

        Write-Host "  MENU PRINCIPAL" -ForegroundColor White
        Write-Sep
        Write-Host "   [1]  FASE 1 - Instalar dependencias" -ForegroundColor Yellow
        Write-Host "   [2]  FASE 2 - Configurar variables .env" -ForegroundColor Yellow
        Write-Host "   [3]  FASE 3 - Iniciar sistema (dev)" -ForegroundColor Green
        Write-Host "   [4]  FASE 4 - Actualizar desde GitHub" -ForegroundColor Magenta
        Write-Host "   [5]  Ver estado del proyecto" -ForegroundColor Cyan
        Write-Host "   [6]  Salir" -ForegroundColor DarkGray
        Write-Sep

        # Estado rapido
        if ($status.MissingDeps.Count -gt 0) {
            Write-Host "  ESTADO: " -NoNewline -ForegroundColor White
            Write-Host "INCOMPLETO" -ForegroundColor Red -NoNewline
            Write-Host " - Ejecuta la opcion [1]" -ForegroundColor DarkGray
        } elseif (-not $status.EnvReady) {
            Write-Host "  ESTADO: " -NoNewline -ForegroundColor White
            Write-Host "FALTA CONFIGURAR" -ForegroundColor Yellow -NoNewline
            Write-Host " - Ejecuta la opcion [2]" -ForegroundColor DarkGray
        } else {
            Write-Host "  ESTADO: " -NoNewline -ForegroundColor White
            Write-Host "LISTO ✓" -ForegroundColor Green
        }

        Write-Host ""
        $opt = Read-Host "  Selecciona una opcion (1-6)"

        switch ($opt) {
            "1" { Invoke-Fase1 }
            "2" { Invoke-Fase2 }
            "3" { Invoke-Fase3 }
            "4" { Invoke-Fase4 }
            "5" { Show-Status }
            "6" { Write-Host "  Hasta luego!" -ForegroundColor Cyan; exit 0 }
            default { Write-Warn "Opcion no valida. Intenta de nuevo." ; Start-Sleep 1 }
        }
    }
}

# ════════════════════════════════════════════════════════════
#  FASE 1 - INSTALACION
# ════════════════════════════════════════════════════════════
function Invoke-Fase1 {
    Write-Header
    Write-Host "  FASE 1 - Instalacion de Dependencias" -ForegroundColor Yellow
    Write-Sep

    # Verificar Node.js
    Write-Step "Verificando Node.js..."
    try {
        $nodeVer = node -v 2>&1
        Write-OK "Node.js detectado: $nodeVer"
    } catch {
        Write-Err "Node.js no encontrado. Descargalo en https://nodejs.org"
        Pause-Menu; return
    }

    # Verificar Git
    Write-Step "Verificando Git..."
    try {
        $gitVer = git --version 2>&1
        Write-OK "Git detectado: $gitVer"
    } catch {
        Write-Warn "Git no encontrado. Algunas funciones pueden fallar."
    }

    # Crear directorios necesarios
    Write-Step "Creando directorios de persistencia..."
    @("backend\data\uploads", "backend\data") | ForEach-Object {
        if (-not (Test-Path $_)) {
            New-Item -ItemType Directory -Path $_ -Force | Out-Null
            Write-OK "Creado: $_"
        }
    }

    # Instalar dependencias
    $modules = @(
        @{ Label = "Raiz";     Path = "." },
        @{ Label = "Backend";  Path = "backend" },
        @{ Label = "Frontend"; Path = "frontend" }
    )

    foreach ($mod in $modules) {
        Write-Step "Instalando dependencias [$($mod.Label)]..."
        try {
            Push-Location $mod.Path
            $result = npm install --quiet 2>&1
            if ($LASTEXITCODE -ne 0) { throw "npm install fallo en $($mod.Label)" }
            Write-OK "$($mod.Label) listo"
        } catch {
            Write-Err "Error en $($mod.Label): $_"
            Pop-Location
            Pause-Menu; return
        } finally {
            Pop-Location
        }
    }

    Write-Host ""
    Write-OK "FASE 1 completada exitosamente."
    Pause-Menu
}

# ════════════════════════════════════════════════════════════
#  FASE 2 - CONFIGURACION .env
# ════════════════════════════════════════════════════════════
function Invoke-Fase2 {
    Write-Header
    Write-Host "  FASE 2 - Configuracion de Variables de Entorno" -ForegroundColor Yellow
    Write-Sep

    $envBackend  = "backend\.env"
    $envFrontend = "frontend\.env"

    # Detectar .env existente
    if (Test-Path $envBackend) {
        Write-Warn "Ya existe: $envBackend"
        $ow = Read-Host "  ¿Sobreescribir? Perderas tus keys actuales (s/n)"
        if ($ow -ne "s") {
            Write-OK "Archivos .env conservados sin cambios."
            Pause-Menu; return
        }
    }

    Write-Host ""
    Write-Info "Deja en blanco las API keys que no uses (Enter para omitir)."
    Write-Info "Puedes poner varias keys separadas por comas: key1,key2"
    Write-Host ""

    # Recolectar API keys
    Write-Host "  ── Proveedores de IA ──────────────────────────────────" -ForegroundColor DarkGray
    $groq      = Read-Host "  [Groq]       API Key (gratis: console.groq.com)"
    $gemini    = Read-Host "  [Gemini]     API Key (gratis: aistudio.google.com)"
    $openai    = Read-Host "  [OpenAI]     API Key (platform.openai.com)"
    $nvidia    = Read-Host "  [NVIDIA/DS]  API Key (integrate.api.nvidia.com)"
    $openrouter= Read-Host "  [OpenRouter] API Key (openrouter.ai)"

    Write-Host ""
    Write-Host "  ── Telegram Bot ───────────────────────────────────────" -ForegroundColor DarkGray
    $useTg = Read-Host "  ¿Usar Telegram Bot? (s/n)"
    $tgToken = ""
    $tgIds   = ""
    if ($useTg -eq "s") {
        $tgToken = Read-Host "  Token de BotFather"
        $tgIds   = Read-Host "  Tu ID numerico (de @userinfobot, separados por comas)"
    }

    Write-Host ""
    Write-Host "  ── Dashboard ──────────────────────────────────────────" -ForegroundColor DarkGray
    $dashUser = Read-Host "  Usuario del Dashboard [default: admin]"
    $dashPass = Read-Host "  Password del Dashboard [default: admin123]"
    if (-not $dashUser) { $dashUser = "admin" }
    if (-not $dashPass) { $dashPass = "admin123" }

    # Escribir backend\.env
    $backendEnv = @"
PORT=3001

# IA Providers
GROQ_API_KEY=$groq
GEMINI_API_KEY=$gemini
OPENAI_API_KEY=$openai
NVIDIA_API_KEY=$nvidia
OPENROUTER_API_KEY=$openrouter

# Dashboard
DASHBOARD_URL=http://localhost:3000
NODE_ENV=development
LOGGER_LEVEL=error
"@

    if ($useTg -eq "s") {
        $backendEnv += @"

# Telegram
TELEGRAM_BOT_TOKEN=$tgToken
TELEGRAM_ALLOWED_USER_IDS=$tgIds
"@
    }

    Set-Content -Path $envBackend  -Value $backendEnv  -Encoding UTF8
    Set-Content -Path $envFrontend -Value "DASHBOARD_USER=`"$dashUser`"`nDASHBOARD_PASS=`"$dashPass`"" -Encoding UTF8

    Write-Host ""
    Write-OK "backend\.env  generado correctamente"
    Write-OK "frontend\.env generado correctamente"
    Pause-Menu
}

# ════════════════════════════════════════════════════════════
#  FASE 3 - INICIAR SISTEMA
# ════════════════════════════════════════════════════════════
function Invoke-Fase3 {
    Write-Header
    Write-Host "  FASE 3 - Iniciar Sistema" -ForegroundColor Green
    Write-Sep

    # Verificar dependencias
    $status = Get-ProjectStatus
    if ($status.MissingDeps.Count -gt 0) {
        Write-Warn "Faltan dependencias: $($status.MissingDeps -join ', ')"
        $ins = Read-Host "  ¿Ejecutar FASE 1 primero? (s/n)"
        if ($ins -eq "s") { Invoke-Fase1 }
    }

    if (-not $status.EnvReady) {
        Write-Warn "No se detectaron archivos .env."
        $cfg = Read-Host "  ¿Ejecutar FASE 2 primero? (s/n)"
        if ($cfg -eq "s") { Invoke-Fase2 }
    }

    Write-Host ""

    $mode = Read-Host "  Modo de inicio: [1] Dev (recomendado)  [2] Ventanas separadas"

    if ($mode -eq "2") {
        # Modo ventanas separadas
        Write-Step "Lanzando Backend en nueva ventana (Puerto 3001)..."
        Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location '$PWD\backend'; npm run dev`"" -WindowStyle Normal

        Write-Step "Lanzando Frontend en nueva ventana (Puerto 3000)..."
        Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location '$PWD\frontend'; npm run dev`"" -WindowStyle Normal

        Write-Host ""
        Write-OK "Procesos lanzados en ventanas independientes."
        Write-Info "Dashboard: http://localhost:3000"
    } else {
        # Modo dev unificado (concurrently)
        Write-Step "Iniciando con concurrently (Backend + Frontend)..."
        Write-Info "Presiona Ctrl+C para detener."
        Write-Host ""
        try {
            npm run dev
        } catch {
            Write-Err "El proceso fue interrumpido."
        }
    }

    Pause-Menu
}

# ════════════════════════════════════════════════════════════
#  FASE 4 - ACTUALIZAR DESDE GITHUB
# ════════════════════════════════════════════════════════════
function Invoke-Fase4 {
    Write-Header
    Write-Host "  FASE 4 - Actualizar desde GitHub" -ForegroundColor Magenta
    Write-Sep

    Write-Step "Verificando Git..."
    try {
        git --version | Out-Null
    } catch {
        Write-Err "Git no esta instalado o no esta en el PATH."
        Pause-Menu; return
    }

    Write-Step "Ejecutando git pull origin main..."
    try {
        $output = git pull origin main 2>&1
        Write-Host $output -ForegroundColor DarkGray

        if ($LASTEXITCODE -ne 0) { throw "git pull fallo" }
        Write-OK "Repositorio actualizado."
    } catch {
        Write-Err "Error al hacer git pull: $_"
        Write-Warn "Posibles causas: sin conexion, conflictos locales, o sin permiso."
        Pause-Menu; return
    }

    Write-Host ""
    $reinstall = Read-Host "  ¿Reinstalar dependencias para asegurar compatibilidad? (s/n)"
    if ($reinstall -eq "s") {
        Invoke-Fase1
    } else {
        Write-OK "Actualizacion completada."
        Pause-Menu
    }
}

# ════════════════════════════════════════════════════════════
#  VER ESTADO DEL PROYECTO
# ════════════════════════════════════════════════════════════
function Show-Status {
    Write-Header
    Write-Host "  ESTADO DEL PROYECTO" -ForegroundColor Cyan
    Write-Sep

    # Node.js
    try   { $nv = node -v 2>&1; Write-OK "Node.js: $nv" }
    catch { Write-Err "Node.js: NO ENCONTRADO" }

    # Git
    try   { $gv = git --version 2>&1; Write-OK "Git: $gv" }
    catch { Write-Warn "Git: NO ENCONTRADO" }

    Write-Host ""
    Write-Host "  Dependencias:" -ForegroundColor White
    @("node_modules", "backend\node_modules", "frontend\node_modules") | ForEach-Object {
        if (Test-Path $_) { Write-OK $_ }
        else              { Write-Err "$_ (FALTANTE)" }
    }

    Write-Host ""
    Write-Host "  Archivos de configuracion:" -ForegroundColor White
    @("backend\.env", "frontend\.env", "backend\.env.example", "frontend\.env.example") | ForEach-Object {
        if (Test-Path $_) { Write-OK $_ }
        else              { Write-Warn "$_ (no existe)" }
    }

    Write-Host ""
    Write-Host "  Puertos (servicios activos):" -ForegroundColor White
    @(3000, 3001) | ForEach-Object {
        $conn = Get-NetTCPConnection -LocalPort $_ -State Listen -ErrorAction SilentlyContinue
        if ($conn) { Write-OK "Puerto $_ en uso (servicio activo)" }
        else        { Write-Warn "Puerto $_ libre (servicio no iniciado)" }
    }

    Write-Host ""
    # Ultimo commit
    try {
        $commit = git log --oneline -1 2>&1
        Write-Info "Ultimo commit: $commit"
    } catch {}

    Pause-Menu
}

# ════════════════════════════════════════════════════════════
#  PUNTO DE ENTRADA
# ════════════════════════════════════════════════════════════
# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] Ejecuta este script desde la raiz del proyecto BotMaRe." -ForegroundColor Red
    exit 1
}

Show-Menu
