@echo off
echo.
echo  ######################################################
echo  #                                                    #
echo  #          FASE 4: ACTUALIZADOR DESDE GITHUB         #
echo  #                                                    #
echo  ######################################################
echo.

echo [1/2] Bajando ultimos cambios...
git pull origin main
if %errorlevel% neq 0 (
    echo [ERROR] Error al descargar. Revisa tu conexion.
    pause
    exit /b
)

echo.
echo [2/2] Actualizando dependencias por modulos...
echo.

:: --- RAÍZ ---
echo [ACTUALIZANDO] Raiz...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Fallo al actualizar la Raiz.
    pause
    exit /b
)

:: --- BACKEND ---
echo [ACTUALIZANDO] Backend...
cd backend
call npm install
cd ..
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Fallo al actualizar el Backend.
    pause
    exit /b
)

:: --- FRONTEND ---
echo [ACTUALIZANDO] Frontend...
cd frontend
call npm install
cd ..
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Fallo al actualizar el Frontend.
    pause
    exit /b
)

echo.
echo  [OK] FASE 4 COMPLETADA. El sistema esta al dia.
echo.
pause
