@echo off
setlocal enabledelayedexpansion
title BotMaRe - Gravity Control Panel
color 0b

:MENU
cls
:: --- AUTODIAGNOSTICO PARA NOVATOS ---
set "MISSING="
if not exist "node_modules" set "MISSING=1"
if not exist "backend\node_modules" set "MISSING=1"
if not exist "backend\.env" set "MISSING=1"

echo ========================================================
echo          🦊 BOTMARE - GRAVITY DASHBOARD 🦊
echo ========================================================
if defined MISSING (
    color 0e
    echo.
    echo  [!] ATENCION: El sistema no esta configurado aun.
    echo      Se recomienda elegir la OPCION 8 para comenzar.
    echo  --------------------------------------------------------
) else (
    color 0b
)
echo.
echo  [ 1 ] EJECUCION DEL SISTEMA
echo  --------------------------------------------------------
echo  1. MODO DESARROLLO (Backend + Frontend juntos)
echo  2. MODO PRODUCCION (Iniciar en segundo plano con PM2)
echo  3. DETENER TODO (Stop PM2)
echo  4. VER LOGS EN TIEMPO REAL
echo.
echo  [ 2 ] MANTENIMIENTO Y SESION
echo  --------------------------------------------------------
echo  5. RESETEAR WHATSAPP (Cierra sesion y limpia QR)
echo  6. LIMPIAR PUERTOS (Libera el 8000 y 8001)
echo  7. LIMPIAR CACHE (Borra dist y .next)
echo.
echo  [ 3 ] HERRAMIENTAS Y BUILD
echo  --------------------------------------------------------
echo  8. INSTALAR / REPARAR (Ejecuta Setup Completo)
echo  9. COMPILAR PORTABLE (Genera .exe ejecutable)
echo  U. ACTUALIZAR (Git Pull + Install)
echo.
echo  [ 4 ] ACCESO RAPIDO
echo  --------------------------------------------------------
echo  D. Abrir Dashboard Local (http://localhost:8001)
echo  T. Iniciar Tunel Cloudflare (Exponer Master)
echo  X. Salir
echo.
echo ========================================================
set /p opcion=">> Seleccione una opcion: "

if "%opcion%"=="1" goto DEV_MODE
if "%opcion%"=="2" goto PROD_MODE
if "%opcion%"=="3" goto STOP_ALL
if "%opcion%"=="4" goto VIEW_LOGS
if "%opcion%"=="5" goto RESET_WA
if "%opcion%"=="6" goto KILL_PORTS
if "%opcion%"=="7" goto CLEAN_CACHE
if "%opcion%"=="8" goto RUN_SETUP
if "%opcion%"=="9" goto BUILD_EXE
if "%opcion%"=="U" goto UPDATE_GIT
if "%opcion%"=="u" goto UPDATE_GIT
if "%opcion%"=="D" goto OPEN_DASH
if "%opcion%"=="d" goto OPEN_DASH
if "%opcion%"=="T" goto START_TUNNEL
if "%opcion%"=="t" goto START_TUNNEL
if "%opcion%"=="X" exit
if "%opcion%"=="x" exit

goto MENU

:DEV_MODE
cls
echo [!] Iniciando en Modo Desarrollo...
call npm_run_dev.bat
goto MENU

:PROD_MODE
cls
echo [!] Iniciando en Modo Produccion (PM2)...
echo [!] Compilando Frontend (esto puede tardar un poco)...
cd frontend && call npm run build && cd ..
echo [!] Compilando Backend...
cd backend && call npm run build && cd ..
echo [!] Reiniciando procesos en PM2...
call npx pm2 delete BotMaRe-Engine >nul 2>&1
call npm run start
echo.
echo ✅ BotMaRe-Engine iniciado en segundo plano.
echo ✅ BotMaRe-Engine iniciado en segundo plano.
echo ✅ Dashboard Local: http://localhost:8001
echo ✅ Para acceso remoto use su IP de red (vea la ventana de logs).
pause
goto MENU

:STOP_ALL
cls
echo [!] Deteniendo todos los procesos...
call npm run stop
echo ✅ Procesos detenidos.
pause
goto MENU

:VIEW_LOGS
cls
echo [!] Mostrando logs (Ctrl+C para salir)...
call npm run logs
goto MENU

:RESET_WA
cls
echo ========================================================
echo           RESETEAR SESION DE WHATSAPP
echo ========================================================
echo [!] Esto cerrara la sesion actual y pedira un nuevo QR.
set /p confirm="¿Estas seguro? (S/N): "
if /i "%confirm%" neq "S" goto MENU

echo Deteniendo procesos...
call npm run stop >nul 2>&1
echo Borrando base de datos de autenticacion...
if exist backend\data\whatsapp_auth.db del /f /q backend\data\whatsapp_auth.db
if exist backend\auth_info_baileys rd /s /q backend\auth_info_baileys
echo.
echo ✅ Sesion reseteada. Inicie el bot para ver el nuevo QR.
pause
goto MENU

:KILL_PORTS
cls
echo [!] Liberando puertos 8000 y 8001...
for /L %%p in (8000,1,8001) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%p "') do (
        if "%%a" neq "0" (
            echo Matando PID %%a en puerto %%p
            taskkill /F /PID %%a >nul 2>&1
        )
    )
)
echo ✅ Puertos listos.
pause
goto MENU

:CLEAN_CACHE
cls
echo [!] Limpiando archivos temporales...
if exist backend\dist rd /s /q backend\dist
if exist frontend\.next rd /s /q frontend\.next
echo ✅ Cache limpia.
pause
goto MENU

:RUN_SETUP
cls
echo [!] Iniciando configuracion completa...
call setup.bat
goto MENU

:BUILD_EXE
cls
echo [!] Iniciando compilacion de ejecutable portable...
call build_exe.bat
goto MENU

:UPDATE_GIT
cls
echo [!] Actualizando desde el repositorio...
call git pull
call npm install
echo ✅ Actualizacion finalizada.
pause
goto MENU

:OPEN_DASH
cls
echo [!] Abriendo Dashboard...
start http://localhost:8001
goto MENU

:START_TUNNEL
cls
echo [!] Iniciando Cloudflare Tunnel para el puerto 8001...
start cmd /c "title Cloudflare Tunnel && cloudflared tunnel --url http://localhost:8001"
echo ✅ Tunnel activo en ventana aparte.
pause
goto MENU
