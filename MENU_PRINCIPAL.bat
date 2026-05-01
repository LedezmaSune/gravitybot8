@echo off
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
echo.
set /p opt="Selecciona una opcion (1-5): "

if "%opt%"=="1" (
    call FASE_1_INSTALAR.bat
    goto menu
)
if "%opt%"=="2" (
    call FASE_2_CONFIGURAR.bat
    goto menu
)
if "%opt%"=="3" (
    call FASE_3_INICIAR.bat
    goto menu
)
if "%opt%"=="4" (
    call FASE_4_ACTUALIZAR.bat
    goto menu
)
if "%opt%"=="5" exit

echo Opcion no valida.
pause
goto menu
