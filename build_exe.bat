@echo off
setlocal enabledelayedexpansion

set BUILD_DIR=En_Desarrollo_Portable
set APP_NAME=BotMaRe_AI

echo 🦊 Preparando la compilacion de %APP_NAME%...

:: 1. Limpiar o crear carpeta de destino
if exist %BUILD_DIR% (
    echo 🧹 Limpiando compilaciones anteriores...
    rd /s /q %BUILD_DIR%
)
mkdir %BUILD_DIR%
mkdir %BUILD_DIR%\data
mkdir %BUILD_DIR%\data\uploads

:: 2. Construir Frontend
echo 🎨 Compilando Interfaz (Next.js)...
cd frontend
call npm install
call npm run build
cd ..

:: 3. Copiar Frontend al destino
echo 📦 Moviendo interfaz al paquete...
xcopy /e /i /y frontend\out %BUILD_DIR%\frontend

:: 4. Construir Backend
echo ⚙️ Compilando Motor (Backend)...
cd backend
call npm install
call npm run build

:: 5. Empaquetar Backend como EXE
echo 📦 Generando archivo ejecutable...
:: Usamos pkg para convertir el JS en EXE. 
:: Nota: Debe estar instalado pkg globalmente o usarlo vía npx
call npx pkg . --targets node18-win-x64 --output ..\%BUILD_DIR%\%APP_NAME%.exe --compress GZip
cd ..

:: 6. Copiar archivos necesarios adicionales
echo 📄 Copiando archivos de configuracion...
copy backend\.env.example %BUILD_DIR%\.env
copy README.md %BUILD_DIR%\Instrucciones.md

echo.
echo ======================================================
echo ✅ COMPILACION COMPLETADA
echo 📂 Carpeta: %BUILD_DIR%
echo 🚀 Ejecutable: %APP_NAME%.exe
echo ======================================================
pause
