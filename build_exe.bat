@echo off
setlocal enabledelayedexpansion

echo 🦊 Preparando la compilacion de BotMaRe Portable (.exe)...

:: 1. Instalar dependencias globales necesarias
echo 📦 Verificando herramientas...
call npm install -g pkg

:: 2. Construir Frontend
echo 🎨 Compilando Frontend (Next.js)...
cd frontend
call npm run build
cd ..

:: 3. Construir Backend
echo ⚙️ Compilando Backend (TypeScript)...
cd backend
call npm install
call npm run build
cd ..

:: 4. Preparar carpeta de distribucion
echo 📦 Organizando archivos...
if exist dist ( rd /s /q dist )
mkdir dist
mkdir dist\frontend

:: Copiar frontend compilado
echo 🖼️ Copiando Dashboard...
xcopy /e /i /y frontend\out dist\frontend

:: Copiar librerias CRITICAS (node_modules)
echo 📚 Copiando librerias del sistema...
:: Copiamos las que dan problemas o son binarias
mkdir dist\node_modules
xcopy /e /i /y backend\node_modules\better-sqlite3 dist\node_modules\better-sqlite3
xcopy /e /i /y backend\node_modules\cloudflared dist\node_modules\cloudflared
xcopy /e /i /y backend\node_modules\@whiskeysockets dist\node_modules\@whiskeysockets
xcopy /e /i /y backend\node_modules\lru-cache dist\node_modules\lru-cache

:: 5. Empaquetar con PKG
echo 🚀 Generando ejecutable...
cd backend
:: Usamos pkg directamente sobre el archivo compilado por tsc
call pkg dist\index.js --targets node18-win-x64 --output ../dist/BotMaRe.exe
cd ..

echo.
echo ✅ ¡PROCESO COMPLETADO!
echo El ejecutable se encuentra en: dist\BotMaRe.exe
echo.
echo NOTA: Para que funcione, las carpetas 'frontend' y 'node_modules' 
echo deben estar junto al archivo 'BotMaRe.exe'.
echo.
pause
