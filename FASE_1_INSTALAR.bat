@echo off
setlocal enabledelayedexpansion

echo.
echo  ######################################################
echo  #                                                    #
echo  #          FASE 1: INSTALADOR AUTOMATICO             #
echo  #                                                    #
echo  ######################################################
echo.

:: 1. Verificar Node.js
echo [1/3] Verificando entorno...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js no esta instalado. 
    echo Por favor, descarga e instala Node.js (LTS) desde: https://nodejs.org/
    echo.
    pause
    exit /b
)
echo [OK] Node.js detectado correctamente.
echo.

:: 1.5 Instalar Asistente de IA (Opcional)
echo [OPCIONAL] ¿Deseas instalar el Asistente de IA para ayuda en tiempo real?
echo           (Requiere npm install -g @openai/codex)
set /p inst_ai="¿Instalar Asistente? (s/n): "
if /i "%inst_ai%"=="s" (
    echo [INFO] Instalando Asistente de IA globalmente...
    call npm install -g @openai/codex
    if %errorlevel% neq 0 (
        echo [!] No se pudo instalar el asistente, pero continuaremos con el proyecto.
    ) else (
        echo [OK] Asistente de IA listo.
    )
)
echo.

:: 2. Crear carpetas de persistencia
echo [2/3] Preparando directorios de datos...
if not exist "backend\data" mkdir "backend\data"
if not exist "backend\data\uploads" mkdir "backend\data\uploads"
echo [OK] Directorios listos.

:: 3. Instalar dependencias paso a paso
echo [3/3] Instalando dependencias por modulos...
echo.

:: --- RAÍZ ---
echo [PASO 1/3] Instalando herramientas del sistema (Raiz)...
call npm install
if %errorlevel% neq 0 goto error_raiz
echo [OK] Raiz lista.
echo.

:: --- BACKEND ---
echo [PASO 2/3] Instalando dependencias del Servidor (Backend)...
cd backend
call npm install
cd ..
if %errorlevel% neq 0 goto error_backend
echo [OK] Backend listo.
echo.

:: --- FRONTEND ---
echo [PASO 3/3] Instalando dependencias del Dashboard (Frontend)...
cd frontend
call npm install
cd ..
if %errorlevel% neq 0 goto error_frontend
echo [OK] Frontend listo.

echo.
echo  ######################################################
echo  #                                                    #
echo  #  [OK] FASE 1 COMPLETADA CON EXITO                  #
echo  #  Todos los modulos se instalaron correctamente.    #
echo  #                                                    #
echo  ######################################################
echo.
echo  Procede a la FASE 2 para configurar tus llaves API.
echo.
pause
exit /b

:error_raiz
echo.
echo [ERROR] Fallo la instalacion en la Raiz.
goto preguntar_ia

:error_backend
echo.
echo [ERROR] Fallo la instalacion en el Backend.
goto preguntar_ia

:error_frontend
echo.
echo [ERROR] Fallo la instalacion en el Frontend.
goto preguntar_ia

:preguntar_ia
echo.
echo [?] ¿Quieres que el Asistente de IA te ayude con este error?
set /p help="Presiona 's' para consultar o cualquier otra tecla para salir: "
if /i "%help%"=="s" (
    echo [IA] Analizando error... Por favor, describe brevemente que paso si el mensaje no es claro.
    codex "Ayudame a solucionar este error en una instalacion de Node.js en Windows: %ERRORLEVEL%. El comando fallo en la carpeta actual."
)
pause
exit /b
