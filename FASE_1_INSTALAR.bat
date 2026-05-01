@echo off
setlocal enabledelayedexpansion

echo.
echo  ######################################################
echo  #                                                    #
echo  #          FASE 1: INSTALADOR AUTOMATICO             #
echo  #                                                    #
echo  ######################################################
echo.

:: 1. Verificar Node.js
echo [1/3] Verificando entorno...
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
echo [2/3] Preparando directorios de datos...
if not exist "backend\data" mkdir "backend\data"
if not exist "backend\data\uploads" mkdir "backend\data\uploads"
echo [OK] Directorios listos.

:: 3. Instalar dependencias
echo [3/3] Instalando dependencias (esto puede tardar)...
echo.
call npm run install-all

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Algo salio mal durante la instalacion.
    pause
    exit /b
)

echo.
echo  [OK] FASE 1 COMPLETADA CON EXITO.
echo  Ahora procede a la FASE 2 para configurar tus llaves API.
echo.
pause
