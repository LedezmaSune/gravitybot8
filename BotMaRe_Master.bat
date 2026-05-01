@echo off
setlocal enabledelayedexpansion

:: [Inferencia] Se asume que el proyecto usa un bundler (Vite/Next) en puerto 3000 y API en 3001.
title BOTMARE - GRAVITY DASHBOARD PRO

:menu
cls
echo.
echo  ######################################################
echo  #                                                    #
echo  #         BOTMARE - GRAVITY DASHBOARD PRO            #
echo  #          (OPTIMIZADO PARA WINDOWS v2.0)            #
echo  #                                                    #
echo  ######################################################
echo.
echo  [1] FASE 1: INSTALAR (Entorno y Dependencias)
echo  [2] FASE 2: CONFIGURAR (Variables .env)
echo  [3] FASE 3: INICIAR (Backend + Frontend)
echo  [4] FASE 4: ACTUALIZAR (Git Pull)
echo  [5] SALIR
echo.

:: --- CHEQUEO DE ESTADO ---
set "MISSING_DEPS=0"
for %%d in (node_modules backend\node_modules frontend\node_modules) do (
    if not exist "%%d" set "MISSING_DEPS=1"
)

if "%MISSING_DEPS%"=="1" (
    echo  [ESTADO] status: INCOMPLETO - Ejecuta la opcion [1].
) else (
    echo  [ESTADO] status: LISTO.
)
echo.

set /p opt="Selecciona una opcion (1-5): "

if "%opt%"=="1" goto fase1
if "%opt%"=="2" goto fase2
if "%opt%"=="3" goto fase3
if "%opt%"=="4" goto fase4
if "%opt%"=="5" exit
goto menu

:fase1
cls
echo [FASE 1] Verificando entorno...
node -v >nul 2>&1 || goto error_ia

echo [1/3] Creando directorios de persistencia...
if not exist "backend\data\uploads" mkdir "backend\data\uploads"

echo [2/3] Instalando dependencias (esto puede tardar)...
:: Uso de pushd/popd para evitar perderse en el árbol de directorios
echo [RAIZ]...
call npm install --quiet || goto error_ia
echo [BACKEND]...
pushd backend && call npm install --quiet && popd || goto error_ia
echo [FRONTEND]...
pushd frontend && call npm install --quiet && popd || goto error_ia

echo [3/3] Verificando IA (Codex)...
call codex --version >nul 2>&1 || (
    set /p inst_ai="Codex no detectado. ¿Instalar globalmente? (s/n): "
    if /i "!inst_ai!"=="s" npm install -g @openai/codex
)

echo.
echo [OK] Instalacion finalizada.
pause
goto menu

:fase2
cls
echo [FASE 2] Configuracion de variables de entorno
set /p API_KEY="--> API Key de IA: "
set /p USE_TG="--> ¿Usar Telegram? (s/n): "

set "ENV_FILE=backend\.env"
(
    echo PORT=3001
    echo OPENAI_API_KEY=%API_KEY%
) > "%ENV_FILE%"

if /i "%USE_TG%"=="s" (
    set /p TG_TOKEN="   Token: "
    set /p TG_ID="   ID: "
    (
        echo TELEGRAM_BOT_TOKEN=!TG_TOKEN!
        echo TELEGRAM_ALLOWED_USER_IDS=!TG_ID!
    ) >> "%ENV_FILE%"
)
echo [OK] Archivo .env generado en /backend.
pause
goto menu

:fase3
cls
echo [FASE 3] Iniciando servicios...
if "%MISSING_DEPS%"=="1" echo [!] Advertencia: Faltan dependencias.
echo.
echo [INFO] Se abriran ventanas independientes para Backend y Frontend.
echo.

:: [Especulación] Se asume que existen scripts "dev" en los package.json internos.
:: 'start' permite ejecutar procesos en paralelo sin bloquear el script principal.
echo Lanzando Backend (Puerto 3001)...
start "BOTMARE_BACKEND" /D backend cmd /c "npm run dev"

echo Lanzando Frontend (Puerto 3000)...
start "BOTMARE_FRONTEND" /D frontend cmd /c "npm run dev"

echo.
echo [LISTO] Dashboard en: http://localhost:3000
echo Puedes cerrar esta ventana; los procesos seguiran abiertos.
pause
goto menu

:fase4
cls
echo [FASE 4] Sincronizando con Repositorio...
git pull origin main || goto error_ia
echo [OK] Actualizado. Reinstalando dependencias por seguridad...
goto fase1

:error_ia
echo.
echo [!] Ocurrio un problema. ¿Quieres consultar al Asistente de IA?
set /p help="Presiona 's' para consultar: "
if /i "%help%"=="s" (
    echo [IA] Analizando...
    codex "Ayudame con este error en Windows: %ERRORLEVEL%"
)
pause
goto menu