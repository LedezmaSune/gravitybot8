@echo off
setlocal enabledelayedexpansion

echo 🦊 Iniciando instalacion automatica de BotMaRe...
echo --------------------------------------------------

:: 1. Verificar Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado. 
    echo Por favor, instalalo desde https://nodejs.org/ antes de continuar.
    pause
    exit /b
)

:: 2. Instalar dependencias raiz
echo [1/5] Instalando dependencias de la raiz...
call npm install

:: 3. Instalar dependencias Backend
echo [2/5] Instalando dependencias del Backend...
cd backend
call npm install
cd ..

:: 4. Instalar dependencias Frontend
echo [3/5] Instalando dependencias del Frontend...
cd frontend
call npm install
cd ..

:: 5. Configurar archivos .env
echo [4/5] Configurando archivos de entorno (.env)...

if not exist "backend\.env" (
    echo Creando backend/.env desde el ejemplo...
    copy "backend\.env.example" "backend\.env"
) else (
    echo El archivo backend/.env ya existe, saltando...
)

if not exist "frontend\.env" (
    echo Creando frontend/.env desde el ejemplo...
    copy "frontend\.env.example" "frontend/.env"
) else (
    echo El archivo frontend/.env ya existe, saltando...
)

echo [5/5] Finalizando...
echo.
echo --------------------------------------------------
echo ✅ INSTALACION COMPLETADA CON EXITO
echo.
echo 📝 PROXIMOS PASOS:
echo 1. Abre backend/.env y pon tus API Keys (Groq, Gemini, etc.)
echo 2. Ejecuta 'npm_run_dev.bat' para iniciar el bot.
echo --------------------------------------------------
pause
