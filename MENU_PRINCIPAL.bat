@echo off
setlocal enabledelayedexpansion
title BOTMARE - MENU PRINCIPAL v2.0

:menu
cls
echo.
echo  ######################################################
echo  #                                                    #
echo  #         BOTMARE - GRAVITY DASHBOARD PRO            #
echo  #               MENU DE CONTROL                      #
echo  #                                                    #
echo  ######################################################
echo.
echo  [1] FASE 1: INSTALAR (Entorno y Dependencias)
echo  [2] FASE 2: CONFIGURAR (Variables .env)
echo  [3] FASE 3: INICIAR (Backend + Frontend)
echo  [4] FASE 4: ACTUALIZAR (Descargar de GitHub)
echo  [5] SALIR
echo.

:: --- CHEQUEO DE ESTADO ---
set "MISSING_DEPS=0"
for %%d in (node_modules backend\node_modules frontend\node_modules) do (
    if not exist "%%d" set "MISSING_DEPS=1"
)

if "%MISSING_DEPS%"=="1" (
    echo  [ESTADO] status: INCOMPLETO - Ejecuta la opcion [1].
) else (
    echo  [ESTADO] status: LISTO.
)
echo.

set /p opt="Selecciona una opcion (1-5): "

if "%opt%"=="1" goto fase1
if "%opt%"=="2" goto fase2
if "%opt%"=="3" goto fase3
if "%opt%"=="4" goto fase4
if "%opt%"=="5" exit
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
