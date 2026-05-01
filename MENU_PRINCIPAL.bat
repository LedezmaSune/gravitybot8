@echo off
setlocal enabledelayedexpansion
:menu
cls
echo.
echo  ######################################################
echo  #                                                    #
echo  #         BOTMARE - GRAVITY DASHBOARD                #
echo  #               MENU DE CONTROL                      #
echo  #                                                    #
echo  ######################################################
echo.
echo  [1] FASE 1: INSTALAR (Primer uso)
echo  [2] FASE 2: CONFIGURAR (API Keys e IA)
echo  [3] FASE 3: INICIAR EL BOT (Encender Dashboard)
echo  [4] FASE 4: ACTUALIZAR (Descargar mejoras de GitHub)
echo  [5] SALIR
set "MISSING_DEPS=0"
if not exist "node_modules" set "MISSING_DEPS=1"
if not exist "backend\node_modules" set "MISSING_DEPS=1"
if not exist "frontend\node_modules" set "MISSING_DEPS=1"

if "%MISSING_DEPS%"=="1" (
    echo  [ESTADO] IMPORTANTE: Dependencias NO instaladas.
    echo           Se recomienda ejecutar la opcion [1] primero.
) else (
    echo  [ESTADO] Listo para iniciar.
)
echo.
set /p opt="Selecciona una opcion (1-5): "

if "%opt%"=="1" goto fase1
if "%opt%"=="2" goto fase2
if "%opt%"=="3" goto fase3
if "%opt%"=="4" goto fase4
if "%opt%"=="5" exit

:invalido
echo Opcion no valida.
pause
goto menu

:fase1
call FASE_1_INSTALAR.bat
goto menu

:fase2
call FASE_2_CONFIGURAR.bat
goto menu

:fase3
call FASE_3_INICIAR.bat
goto menu

:fase4
call FASE_4_ACTUALIZAR.bat
goto menu
