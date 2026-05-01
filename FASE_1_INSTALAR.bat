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

:: 3. Instalar dependencias paso a paso
echo [3/3] Instalando dependencias por modulos...
echo.

:: --- RAÍZ ---
echo [PASO 1/3] Instalando herramientas del sistema (Raiz)...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Fallo la instalacion en la Raiz.
    pause
    exit /b
)
echo [OK] Raiz lista.
echo.

:: --- BACKEND ---
echo [PASO 2/3] Instalando dependencias del Servidor (Backend)...
cd backend
call npm install
cd ..
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Fallo la instalacion en el Backend.
    pause
    exit /b
)
echo [OK] Backend listo.
echo.

:: --- FRONTEND ---
echo [PASO 3/3] Instalando dependencias del Dashboard (Frontend)...
cd frontend
call npm install
cd ..
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Fallo la instalacion en el Frontend.
    pause
    exit /b
)
echo [OK] Frontend listo.

echo.
echo  ######################################################
echo  #                                                    #
echo  #  [OK] FASE 1 COMPLETADA CON EXITO                  #
echo  #  Todos los modulos se instalaron correctamente.    #
echo  #                                                    #
echo  ######################################################
echo.
echo  Procede a la FASE 2 para configurar tus llaves API.
echo.
pause
exit /b
