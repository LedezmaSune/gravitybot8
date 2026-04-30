@echo off
echo.
echo  ######################################################
echo  #                                                    #
echo  #          ACTUALIZADOR DE BOTMARE                   #
echo  #                                                    #
echo  ######################################################
echo.

:: 1. Verificar Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git no esta instalado o no se encuentra en el PATH.
    pause
    exit /b
)

:: 2. Descargar ultimos cambios
echo [1/2] Descargando actualizaciones desde GitHub...
git pull origin main
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No se pudieron descargar los cambios. 
    echo Verifica si tienes cambios locales sin guardar o tu conexion a internet.
    pause
    exit /b
)
echo [OK] Codigo actualizado.

:: 3. Actualizar dependencias
echo.
echo [2/2] Sincronizando dependencias...
call npm run install-all

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema instalando las nuevas dependencias.
    pause
    exit /b
)

echo.
echo  ######################################################
echo  #            ACTUALIZACION COMPLETADA                #
echo  ######################################################
echo.
echo  El sistema esta al dia. Ahora puedes ejecutar 'iniciar.bat'.
echo.
pause
