@echo off
setlocal enabledelayedexpansion
title BotMaRe - Compilador Portable
color 0b

set BUILD_DIR=En_Desarrollo_Portable
set APP_NAME=BotMaRe_AI

echo ========================================================
echo   🦊 PREPARANDO COMPILACION PORTABLE (%APP_NAME%)
echo ========================================================
echo.

:: 1. Limpiar carpeta de destino
if exist %BUILD_DIR% (
    echo 🧹 Limpiando compilaciones anteriores...
    rd /s /q %BUILD_DIR%
)
mkdir %BUILD_DIR%
mkdir %BUILD_DIR%\data
mkdir %BUILD_DIR%\data\uploads

:: 2. Construir Proyecto Unificado
echo [1/4] Compilando Frontend y Servidor...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error en la compilacion. Abortando.
    pause
    exit /b
)

:: 3. Copiar Frontend Estatico
if exist out (
    echo [2/4] Empaquetando interfaz estatica...
    xcopy /e /i /y out %BUILD_DIR%\out
)

:: 4. Empaquetar Servidor como EXE
echo [3/4] Generando archivo ejecutable (.exe)...
:: pkg usara el main del package.json
call npx pkg . --targets node20-win-x64 --output %BUILD_DIR%\%APP_NAME%.exe --compress GZip

:: 5. Archivos de soporte
echo [4/4] Copiando archivos de configuracion...
if exist .env (
    copy .env %BUILD_DIR%\.env.personal.txt
)
if exist .env.example (
    copy .env.example %BUILD_DIR%\.env
)
copy README.md %BUILD_DIR%\Instrucciones.md

echo.
echo ========================================================
echo ✅ COMPILACION COMPLETADA CON EXITO
echo 📂 Carpeta: %BUILD_DIR%
echo 🚀 Ejecutable: %APP_NAME%.exe
echo ========================================================
echo.
pause
