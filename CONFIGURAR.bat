@echo off
setlocal enabledelayedexpansion

echo.
echo  ######################################################
echo  #                                                    #
echo  #       ASISTENTE DE CONFIGURACION BOTMARE           #
echo  #                                                    #
echo  ######################################################
echo.
echo  Este asistente te guiara paso a paso para dejar el bot
echo  listo para usar en este equipo.
echo.

:: 1. Verificacion de requisitos
echo [PASO 1] Verificando requisitos...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no instalado. Visita https://nodejs.org/
    pause
    exit /b
)
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] Git no detectado. Si ya descargaste el codigo no hay problema.
)
echo [OK] Entorno verificado.
echo.

:: 2. Instalacion de dependencias
echo [PASO 2] ¿Deseas instalar o actualizar las dependencias ahora?
set /p INSTALL="Presiona 's' para instalar o cualquier otra tecla para saltar: "
if /i "%INSTALL%"=="s" (
    echo Instalando... esto puede tardar...
    call npm run install-all
)
echo.

:: 3. Configuracion de la IA
echo [PASO 3] Configuracion de Inteligencia Artificial
echo.
echo Necesitas una API Key de OpenAI o DeepSeek (NVIDIA).
set /p API_KEY="--> Pega tu API Key aqui: "
echo.

:: 4. Configuracion de Telegram (Opcional)
echo [PASO 4] Configuracion de Telegram (Opcional)
echo ¿Deseas usar Telegram para controlar el bot desde tu celular?
set /p USE_TG="Presiona 's' para SI o cualquier otra tecla para NO: "
if /i "%USE_TG%"=="s" (
    set /p TG_TOKEN="--> Introduce el Token de BotFather: "
    set /p TG_ID="--> Introduce tu ID numerico de Telegram: "
)
echo.

:: 5. Generar archivo .env
echo [PASO 5] Guardando configuracion...
(
echo PORT=3001
echo OPENAI_API_KEY=%API_KEY%
if /i "%USE_TG%"=="s" (
    echo TELEGRAM_BOT_TOKEN=%TG_TOKEN%
    echo TELEGRAM_ALLOWED_USER_IDS=%TG_ID%
)
echo # Configuracion automatica generada por el Asistente
) > "backend\.env"

:: 6. Crear carpetas finales
if not exist "backend\data\uploads" mkdir "backend\data\uploads"

echo.
echo  ######################################################
echo  #           CONFIGURACION COMPLETADA                 #
echo  ######################################################
echo.
echo  Tu bot esta configurado y listo para la accion.
echo.
echo  Proximos pasos:
echo  1. Ejecuta 'iniciar.bat' para abrir el Dashboard.
echo  2. Escanea el codigo QR con tu WhatsApp.
echo.
set /p START="¿Deseas iniciar el bot ahora mismo? (s/n): "
if /i "%START%"=="s" (
    call iniciar.bat
)
pause
