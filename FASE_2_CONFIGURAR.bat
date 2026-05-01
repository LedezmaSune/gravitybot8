@echo off
setlocal enabledelayedexpansion
title BOTMARE - FASE 2: CONFIGURACION

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
    set /p TG_TOKEN="   Token de BotFather: "
    set /p TG_ID="   Tu ID numerico: "
    (
        echo TELEGRAM_BOT_TOKEN=!TG_TOKEN!
        echo TELEGRAM_ALLOWED_USER_IDS=!TG_ID!
    ) >> "%ENV_FILE%"
)

echo.
echo [OK] Archivo .env generado exitosamente.
echo Ahora puedes iniciar el sistema con la FASE 3.
echo.
pause
exit /b
