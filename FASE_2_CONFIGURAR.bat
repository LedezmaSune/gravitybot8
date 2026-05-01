@echo off
setlocal enabledelayedexpansion
title BOTMARE - FASE 2: CONFIGURACION

:fase2
cls
echo ============================================================
echo   BOTMARE - Configuracion de Variables de Entorno
echo ============================================================
echo.

set "ENV_FILE=backend\.env"
set "ENV_FRONT=frontend\.env"

rem ── Detectar si los .env ya existen ──────────────────────────
if exist "%ENV_FILE%" (
    echo [!] Se detecto que ya existe: %ENV_FILE%
    set /p OVERWRITE="    ¿Sobreescribir? Perderas tus keys actuales (s/n): "
    if /i "!OVERWRITE!" neq "s" (
        echo [OK] Se conservaron los archivos .env existentes.
        echo.
        pause
        exit /b
    )
)

echo.
echo Deja en blanco las API keys que no uses (presiona Enter).
echo Puedes poner varias keys separadas por comas: key1,key2
echo.

rem ── Datos basicos ────────────────────────────────────────────
set /p GROQ_KEY="   [Groq]        API Key (gratis en console.groq.com): "
set /p GEMINI_KEY="   [Gemini]      API Key (gratis en aistudio.google.com): "
set /p OPENAI_KEY="   [OpenAI]      API Key (platform.openai.com): "
set /p NVIDIA_KEY="   [NVIDIA/DS]   API Key (integrate.api.nvidia.com): "
set /p ORKEY="   [OpenRouter]  API Key (openrouter.ai): "
echo.
set /p USE_TG="   ¿Usar Telegram Bot? (s/n): "

rem ── Escribir backend\.env ────────────────────────────────────
(
    echo PORT=3001
    echo.
    echo # IA Providers
    echo GROQ_API_KEY=!GROQ_KEY!
    echo GEMINI_API_KEY=!GEMINI_KEY!
    echo OPENAI_API_KEY=!OPENAI_KEY!
    echo NVIDIA_API_KEY=!NVIDIA_KEY!
    echo OPENROUTER_API_KEY=!ORKEY!
    echo.
    echo # Dashboard
    echo DASHBOARD_URL=http://localhost:3000
    echo NODE_ENV=development
    echo LOGGER_LEVEL=error
) > "%ENV_FILE%"

rem ── Telegram (opcional) ───────────────────────────────────────
if /i "!USE_TG!"=="s" (
    set /p TG_TOKEN="   Token de BotFather: "
    set /p TG_ID="   Tu ID numerico (de @userinfobot): "
    (
        echo.
        echo # Telegram
        echo TELEGRAM_BOT_TOKEN=!TG_TOKEN!
        echo TELEGRAM_ALLOWED_USER_IDS=!TG_ID!
    ) >> "%ENV_FILE%"
)

rem ── Escribir frontend\.env ────────────────────────────────────
echo.
set /p DASH_USER="   Usuario del Dashboard (default: admin): "
set /p DASH_PASS="   Password del Dashboard: "
if "!DASH_USER!"=="" set "DASH_USER=admin"
if "!DASH_PASS!"=="" set "DASH_PASS=admin123"

(
    echo DASHBOARD_USER="!DASH_USER!"
    echo DASHBOARD_PASS="!DASH_PASS!"
) > "%ENV_FRONT%"

echo.
echo [OK] Archivos .env generados exitosamente.
echo      backend\.env  ^<-- API keys de IA y Telegram
echo      frontend\.env ^<-- Credenciales del Dashboard
echo.
echo Ahora puedes iniciar el sistema con la FASE 3.
echo.
pause
exit /b
