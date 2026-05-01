@echo off
setlocal enabledelayedexpansion
title BOTMARE - FASE 4: ACTUALIZAR

:fase4
cls
echo [FASE 4] Sincronizando con Repositorio (Git)...
git pull origin main || goto error_ia

echo.
echo [OK] Cambios descargados. 
echo Reinstalando dependencias para asegurar compatibilidad...
echo.
call FASE_1_INSTALAR.bat

echo.
echo [OK] ACTUALIZACION COMPLETADA.
pause
exit /b

:error_ia
echo.
echo [!] Ocurrio un problema con Git.
set /p help="¿Quieres consultar al Asistente de IA? (s/n): "
if /i "%help%"=="s" (
    echo [IA] Analizando conflictos...
    codex "Error al hacer git pull en Windows. Codigo: %ERRORLEVEL%"
)
pause
exit /b
