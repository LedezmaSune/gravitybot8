@echo off
setlocal enabledelayedexpansion
title BotMaRe - Setup Rapido
cls
echo.
echo  ======================================================
echo           BOTMARE - SETUP RAPIDO
echo  ======================================================
echo.

:: Verificar Node.js
echo  [1/4] Verificando Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo  [X] Node.js no encontrado.
    echo      Descargalo en: https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do echo  [OK] Node.js %%i detectado

:: Crear directorios
echo  [2/4] Preparando estructura...
if not exist "backend\data\uploads" mkdir "backend\data\uploads"

:: Instalar dependencias
echo  [3/4] Instalando dependencias (esto puede tardar)...
echo        Raiz...
call npm install --quiet >nul 2>&1 || goto error
echo        Backend...
pushd backend && call npm install --quiet >nul 2>&1 && popd || goto error
echo        Frontend...
pushd frontend && call npm install --quiet >nul 2>&1 && popd || goto error
echo  [OK] Todas las dependencias instaladas.

:: Configurar .env
echo  [4/4] Configurando variables de entorno...
echo.

set "ENV_FILE=backend\.env"
set "ENV_FRONT=frontend\.env"

if exist "%ENV_FILE%" (
    echo  [!] Ya existe backend\.env - conservando configuracion actual.
) else (
    echo  Necesitas al menos 1 API Key de IA para que el bot funcione.
    echo  Recomendado: Groq es gratis en https://console.groq.com/keys
    echo.
    set /p GROQ_KEY="  [Groq] API Key (Enter para omitir): "
    set /p GEMINI_KEY="  [Gemini] API Key (Enter para omitir): "
    set /p OPENAI_KEY="  [OpenAI] API Key (Enter para omitir): "
    echo.
    set /p USE_TG="  Usar Telegram Bot? (s/n): "
    set "TG_TOKEN="
    set "TG_ID="
    if /i "!USE_TG!"=="s" (
        set /p TG_TOKEN="  Token de BotFather: "
        set /p TG_ID="  Tu ID numerico: "
    )

    (
        echo PORT=3001
        echo.
        echo # IA Providers
        echo GROQ_API_KEY=!GROQ_KEY!
        echo GEMINI_API_KEY=!GEMINI_KEY!
        echo OPENAI_API_KEY=!OPENAI_KEY!
        echo NVIDIA_API_KEY=
        echo OPENROUTER_API_KEY=
        echo.
        echo # Dashboard
        echo DASHBOARD_URL=http://localhost:3000
        echo NODE_ENV=development
        echo LOGGER_LEVEL=error
    ) > "%ENV_FILE%"

    if /i "!USE_TG!"=="s" (
        (
            echo.
            echo # Telegram
            echo TELEGRAM_BOT_TOKEN=!TG_TOKEN!
            echo TELEGRAM_ALLOWED_USER_IDS=!TG_ID!
        ) >> "%ENV_FILE%"
    )
    echo  [OK] backend\.env creado.
)

if not exist "%ENV_FRONT%" (
    (
        echo DASHBOARD_USER="admin"
        echo DASHBOARD_PASS="admin123"
    ) > "%ENV_FRONT%"
    echo  [OK] frontend\.env creado (usuario: admin / pass: admin123^)
) else (
    echo  [!] Ya existe frontend\.env - conservando configuracion actual.
)

echo.
echo  ======================================================
echo   INSTALACION COMPLETADA
echo  ======================================================
echo.
echo  Para iniciar el sistema ejecuta:
echo     npm run dev
echo.
echo  Dashboard: http://localhost:3000
echo  Backend:   http://localhost:3001
echo.
pause
exit /b 0

:error
echo.
echo  [X] Ocurrio un error durante la instalacion.
echo  Verifica tu conexion a internet e intenta de nuevo.
pause
exit /b 1
