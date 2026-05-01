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
echo [2/2] Actualizando dependencias...
call npm run install-all

echo.
echo  [OK] FASE 4 COMPLETADA. El sistema esta al dia.
echo.
pause
