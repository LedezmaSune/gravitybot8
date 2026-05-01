@echo off
setlocal enabledelayedexpansion
echo.
echo  ######################################################
echo  #                                                    #
echo  #          FASE 3: INICIO DEL SISTEMA                #
echo  #                                                    #
echo  ######################################################
echo.
:: --- CHEQUEO DE DEPENDENCIAS ---
set "MISSING_DEPS=0"
if not exist "node_modules" set "MISSING_DEPS=1"
if not exist "backend\node_modules" set "MISSING_DEPS=1"
if not exist "frontend\node_modules" set "MISSING_DEPS=1"

if "%MISSING_DEPS%"=="1" (
    echo.
    echo [!] ADVERTENCIA: Parecen faltar las dependencias del sistema.
    set /p install="¿Quieres instalarlas ahora? (s/n): "
    if /i "!install!"=="s" (
        echo.
        echo [1/2] Preparando directorios...
        if not exist "backend\data" mkdir "backend\data"
        if not exist "backend\data\uploads" mkdir "backend\data\uploads"
        
        echo [2/2] Instalando dependencias por modulos (esto puede tardar)...
        
        echo [PASO 1/3] Raiz...
        call npm install
        
        echo [PASO 2/3] Backend...
        cd backend
        call npm install
        cd ..
        
        echo [PASO 3/3] Frontend...
        cd frontend
        call npm install
        cd ..
        
        if %errorlevel% neq 0 goto error_deps
        echo.
        echo [OK] Dependencias instaladas correctamente.
    ) else (
        echo.
        echo [!] Es posible que el sistema no inicie correctamente sin dependencias.
        pause
    )
)
:: -------------------------------

echo  Iniciando servidores...
echo  Dashboard: http://localhost:3000
echo.
echo  Presiona Ctrl+C para detener.
echo.
npm run dev
pause
exit /b

:error_deps
echo.
echo [ERROR] Hubo un problema instalando las dependencias.
pause
exit /b
