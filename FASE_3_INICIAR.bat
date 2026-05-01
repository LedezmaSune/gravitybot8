@echo off
setlocal enabledelayedexpansion
title BOTMARE - FASE 3: INICIO DEL SISTEMA

:fase3
cls
echo [FASE 3] Iniciando servicios independientes...
echo.

:: Verificacion rapida de deps
if not exist "node_modules" (
    echo [!] Advertencia: No se detectan dependencias.
    set /p ins="¿Deseas ejecutar la FASE 1 primero? (s/n): "
    if /i "!ins!"=="s" (
        call FASE_1_INSTALAR.bat
        goto fase3
    )
)

echo [INFO] Se abriran ventanas independientes para Backend y Frontend.
echo.

echo Lanzando Backend (Puerto 3001)...
start "BOTMARE_BACKEND" /D backend cmd /c "npm run dev"

echo Lanzando Frontend (Puerto 3000)...
start "BOTMARE_FRONTEND" /D frontend cmd /c "npm run dev"

echo.
echo [LISTO] Dashboard accesible en: http://localhost:3000
echo Los procesos seguiran corriendo aunque cierres esta ventana.
echo.
pause
exit /b
