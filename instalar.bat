@echo off
setlocal enabledelayedexpansion

:: Colores y Estetica
echo.
echo  ######################################################
echo  #                                                    #
echo  #          INSTALADOR AUTOMATICO BOTMARE             #
echo  #                                                    #
echo  ######################################################
echo.

:: 1. Verificar Node.js
echo [1/4] Verificando entorno...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js no esta instalado. 
    echo Por favor, descarga e instala Node.js (LTS) desde: https://nodejs.org/
    echo.
    pause
    exit /b
)
echo [OK] Node.js detectado correctamente.

:: 2. Crear carpetas de persistencia
echo [2/4] Preparando directorios de datos...
if not exist "backend\data" (
    mkdir "backend\data"
    echo [OK] Carpeta backend\data creada.
)
if not exist "backend\data\uploads" (
    mkdir "backend\data\uploads"
    echo [OK] Carpeta backend\data\uploads creada.
)

:: 3. Instalar dependencias
echo [3/4] Instalando dependencias (Backend, Frontend y Root)...
echo Esto puede tardar un par de minutos dependiendo de tu conexion...
echo.
call npm run install-all

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Algo salio mal durante la instalacion de dependencias.
    echo Verifica tu conexion a internet y vuelve a intentarlo.
    echo.
    pause
    exit /b
)
echo.
echo [OK] Todas las dependencias han sido instaladas.

:: 4. Configuracion de entorno
echo [4/4] Verificando archivos de configuracion...
if not exist "backend\.env" (
    echo [WARN] No se detecto el archivo backend\.env
    echo [INFO] Creando un archivo .env de ejemplo...
    (
    echo PORT=3001
    echo OPENAI_API_KEY=tu_api_key_aqui
    echo # Si usas DeepSeek/NVIDIA pon la URL aqui:
    echo # OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
    ) > "backend\.env"
    echo [OK] Archivo backend\.env creado. 
    echo [!] RECUERDA: Debes editar backend\.env y poner tu API KEY real.
)

echo.
echo  ######################################################
echo  #            INSTALACION FINALIZADA                  #
echo  ######################################################
echo.
echo  Pasos siguientes:
echo  1. Edita el archivo backend\.env con tu API Key.
echo  2. Ejecuta el archivo 'iniciar.bat' o usa 'npm run dev'.
echo.
pause
