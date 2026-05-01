@echo off
setlocal enabledelayedexpansion

:menu
cls
echo.
echo  ######################################################
echo  #                                                    #
echo  #         BOTMARE - GRAVITY DASHBOARD PRO            #
echo  #             (TODO-EN-UNO / ALL-IN-ONE)             #
echo  #                                                    #
echo  ######################################################
echo.
echo  [1] FASE 1: INSTALAR (Entorno, Carpetas y Deps)
echo  [2] FASE 2: CONFIGURAR (API Keys e IA)
echo  [3] FASE 3: INICIAR EL BOT (Encender Dashboard)
echo  [4] FASE 4: ACTUALIZAR (Descargar de GitHub)
echo  [5] SALIR
echo.

:: --- CHEQUEO DE ESTADO ---
set "MISSING_DEPS=0"
if not exist "node_modules" set "MISSING_DEPS=1"
if not exist "backend\node_modules" set "MISSING_DEPS=1"
if not exist "frontend\node_modules" set "MISSING_DEPS=1"

if "%MISSING_DEPS%"=="1" (
    echo  [ESTADO] IMPORTANTE: Faltan dependencias. Ejecuta la opcion [1].
) else (
    echo  [ESTADO] Listo para iniciar.
)
echo.

set /p opt="Selecciona una opcion (1-5): "

if "%opt%"=="1" goto fase1
if "%opt%"=="2" goto fase2
if "%opt%"=="3" goto fase3
if "%opt%"=="4" goto fase4
if "%opt%"=="5" exit
goto menu

:: ==========================================================
:: FASE 1: INSTALACION
:: ==========================================================
:fase1
cls
echo [FASE 1] Iniciando Instalacion...
node -v >nul 2>&1
if %errorlevel% neq 0 goto error_node

echo.
:: --- DETECCION DE CODEX ---
codex --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Asistente de IA (Codex) ya esta instalado.
) else (
    echo [INFO] Asistente de IA no detectado.
    set /p inst_ai="¿Deseas instalarlo ahora? (s/n): "
    if /i "!inst_ai!"=="s" (
        echo [INFO] Instalando @openai/codex...
        call npm install -g @openai/codex
    )
)
echo.

echo [1/2] Preparando directorios...
if not exist "backend\data" mkdir "backend\data"
if not exist "backend\data\uploads" mkdir "backend\data\uploads"

echo [2/2] Instalando dependencias por modulos...
echo [RAIZ]...
call npm install
if %errorlevel% neq 0 goto error_raiz

echo [BACKEND]...
cd backend
call npm install
cd ..
if %errorlevel% neq 0 goto error_backend

echo [FRONTEND]...
cd frontend
call npm install
cd ..
if %errorlevel% neq 0 goto error_frontend

echo.
echo [OK] FASE 1 COMPLETADA.
pause
goto menu

:: ==========================================================
:: FASE 2: CONFIGURACION
:: ==========================================================
:fase2
cls
echo [FASE 2] Configurando API Keys...
set /p API_KEY="--> Pega tu API Key (IA): "
echo [TELEGRAM] ¿Deseas usar Telegram?
set /p USE_TG="Presiona 's' para SI: "
if /i "%USE_TG%"=="s" (
    set /p TG_TOKEN="--> Token: "
    set /p TG_ID="--> ID: "
)

(
echo PORT=3001
echo OPENAI_API_KEY=%API_KEY%
if /i "%USE_TG%"=="s" (
    echo TELEGRAM_BOT_TOKEN=%TG_TOKEN%
    echo TELEGRAM_ALLOWED_USER_IDS=%TG_ID%
)
) > "backend\.env"

echo [OK] Configuracion guardada en backend\.env
pause
goto menu

:: ==========================================================
:: FASE 3: INICIO
:: ==========================================================
:fase3
cls
echo [FASE 3] Iniciando Sistema...
if "%MISSING_DEPS%"=="1" (
    echo [!] Faltan dependencias. ¿Instalarlas ahora? (s/n)
    set /p ins="Opcion: "
    if /i "!ins!"=="s" goto fase1
)

echo Dashboard: http://localhost:3000
echo Presiona Ctrl+C para detener.
npm run dev
if %errorlevel% neq 0 goto preguntar_ia
pause
goto menu

:: ==========================================================
:: FASE 4: ACTUALIZACION
:: ==========================================================
:fase4
cls
echo [FASE 4] Actualizando desde GitHub...
git pull origin main
if %errorlevel% neq 0 goto error_git
goto fase1

:: ==========================================================
:: MANEJO DE ERRORES E IA
:: ==========================================================
:error_node
echo [ERROR] Node.js no instalado. Baja la version LTS en nodejs.org
pause
goto menu

:error_raiz
echo [ERROR] Fallo en la Raiz.
goto preguntar_ia

:error_backend
echo [ERROR] Fallo en el Backend.
goto preguntar_ia

:error_frontend
echo [ERROR] Fallo en el Frontend.
goto preguntar_ia

:error_git
echo [ERROR] Fallo al descargar de GitHub.
goto preguntar_ia

:preguntar_ia
echo.
echo [?] ¿Quieres que el Asistente de IA te ayude con este error?
set /p help="Presiona 's' para consultar: "
if /i "%help%"=="s" (
    echo [IA] Consultando...
    codex "Ayudame con este error en Windows: %ERRORLEVEL%"
)
pause
goto menu
