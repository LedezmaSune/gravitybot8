@echo off
setlocal enabledelayedexpansion

echo.
echo  ######################################################
echo  #                                                    #
echo  #          FASE 2: ASISTENTE DE CONFIGURACION        #
echo  #                                                    #
echo  ######################################################
echo.

:: 1. Configuracion de la IA
echo [IA] Configuracion de Inteligencia Artificial
set /p API_KEY="--> Pega tu API Key (OpenAI/DeepSeek): "
echo.

:: 2. Configuracion de Telegram (Opcional)
echo [TELEGRAM] ¿Deseas usar Telegram?
set /p USE_TG="Presiona 's' para SI o cualquier otra tecla para NO: "
if /i "%USE_TG%"=="s" (
    set /p TG_TOKEN="--> Token de BotFather: "
    set /p TG_ID="--> Tu ID numerico de Telegram: "
)
echo.

:: 3. Generar archivo .env
echo [INFO] Guardando configuracion en backend\.env...
(
echo PORT=3001
echo OPENAI_API_KEY=%API_KEY%
if /i "%USE_TG%"=="s" (
    echo TELEGRAM_BOT_TOKEN=%TG_TOKEN%
    echo TELEGRAM_ALLOWED_USER_IDS=%TG_ID%
)
) > "backend\.env"

echo.
echo  [OK] FASE 2 COMPLETADA.
echo  Configuracion guardada. Ahora puedes iniciar el bot con la FASE 3.
echo.
pause
