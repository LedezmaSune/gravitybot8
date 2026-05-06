@echo off
setlocal enabledelayedexpansion

set BUILD_DIR=En_Desarrollo_Portable
set APP_NAME=BotMaRe_AI

echo 🦊 Preparando la compilacion de %APP_NAME% (MODO UNIFICADO)...

:: 1. Limpiar o crear carpeta de destino
if exist %BUILD_DIR% (
    echo 🧹 Limpiando compilaciones anteriores...
    rd /s /q %BUILD_DIR%
)
mkdir %BUILD_DIR%
mkdir %BUILD_DIR%\data
mkdir %BUILD_DIR%\data\uploads

:: 2. Construir Proyecto Unificado
echo 🎨 Compilando Proyecto (Next.js + Server)...
call npm run build

:: 3. Copiar Frontend Estatico (Si existe output export)
if exist out (
    echo 📦 Moviendo interfaz estatica al paquete...
    xcopy /e /i /y out %BUILD_DIR%\frontend
)

:: 4. Empaquetar Servidor como EXE
echo 📦 Generando archivo ejecutable...
:: Nota: pkg tomara el main definido en package.json (dist/server.js)
call npx pkg . --targets node20-win-x64 --output %BUILD_DIR%\%APP_NAME%.exe --compress GZip

:: 5. Copiar archivos necesarios adicionales
echo 📄 Copiando archivos de configuracion...
if exist .env (
    copy .env %BUILD_DIR%\.env
) else (
    if exist .env.example copy .env.example %BUILD_DIR%\.env
)
copy README.md %BUILD_DIR%\Instrucciones.md

echo.
echo ======================================================
echo ✅ COMPILACION COMPLETADA (VERSION UNIFICADA)
echo 📂 Carpeta: %BUILD_DIR%
echo 🚀 Ejecutable: %APP_NAME%.exe
echo ======================================================
pause
