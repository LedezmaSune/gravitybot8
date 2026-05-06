@echo off
setlocal enabledelayedexpansion
title BotMaRe - Instalador Maestro
color 0b

echo ========================================================
echo   🦊 INICIANDO INSTALACION AUTOMATICA DE BOTMARE 🦊
echo ========================================================
echo.

:: 1. Verificar Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ [ERROR] Node.js no esta instalado.
    echo.
    echo BotMaRe necesita Node.js para funcionar. 
    echo Voy a abrir la pagina de descarga por ti...
    start https://nodejs.org/
    echo.
    echo Una vez instalado, reinicia este script.
    pause
    exit /b
)

:: 2. Instalar dependencias
echo [1/3] Instalando dependencias del sistema...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ [ERROR] Hubo un problema al instalar las dependencias.
    echo Intente ejecutar 'npm install' manualmente.
    pause
    exit /b
)

:: 3. Configurar archivo .env
echo [2/3] Configurando archivo de entorno (.env)...

if not exist ".env" (
    echo Creando archivo .env desde el ejemplo...
    copy ".env.example" ".env"
    echo.
    echo [!] IMPORTANTE: Se ha creado un archivo .env
    echo     Por favor, abrelo y pon tus API Keys.
) else (
    echo El archivo .env ya existe, saltando...
)

:: 4. Finalización
echo [3/3] Finalizando instalacion...
echo.
echo ========================================================
echo ✅ INSTALACION COMPLETADA CON EXITO
echo ========================================================
echo.
echo 📝 PROXIMOS PASOS:
echo 1. Abre el archivo .env y pon tus llaves de IA (DeepSeek, etc.)
echo 2. Ejecuta 'npm start' o usa el 'manager.bat' para iniciar.
echo ========================================================
echo.
pause
