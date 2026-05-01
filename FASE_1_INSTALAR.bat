@echo off
setlocal enabledelayedexpansion
title BOTMARE - FASE 1: INSTALACION

:fase1
cls
echo [FASE 1] Verificando entorno...
node -v >nul 2>&1 || goto error_ia

echo [1/3] Creando directorios de persistencia...
if not exist "backend\data\uploads" mkdir "backend\data\uploads"

echo [2/3] Instalando dependencias por modulos...
echo [RAIZ]...
call npm install --quiet || goto error_ia
echo [BACKEND]...
pushd backend && call npm install --quiet && popd || goto error_ia
echo [FRONTEND]...
pushd frontend && call npm install --quiet && popd || goto error_ia

echo [3/3] Verificando IA (Codex)...
call codex --version >nul 2>&1
if %errorlevel% neq 0 (
    set /p inst_ai="Codex no detectado. ¿Instalar globalmente? (s/n): "
    if /i "!inst_ai!"=="s" call npm install -g @openai/codex
) else (
    echo [OK] Asistente de IA ya esta instalado.
)

echo.
echo [OK] FASE 1 COMPLETADA CON EXITO.
pause
exit /b

:error_ia
echo.
echo [!] Ocurrio un problema en la instalacion.
set /p help="¿Quieres consultar al Asistente de IA? (s/n): "
if /i "%help%"=="s" (
    echo [IA] Analizando...
    codex "Ayudame con este error de instalacion en Windows. Codigo: %ERRORLEVEL%"
)
pause
exit /b
