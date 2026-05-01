@echo off
echo.
echo  ######################################################
echo  #                                                    #
echo  #          FASE 4: ACTUALIZADOR DESDE GITHUB         #
echo  #                                                    #
echo  ######################################################
echo.

git pull origin main
if %errorlevel% neq 0 goto error_git

echo.
echo [2/2] Actualizando dependencias por modulos...
echo.
echo [ACTUALIZANDO] Raiz...
call npm install
if %errorlevel% neq 0 goto error_raiz

:: --- BACKEND ---
echo [ACTUALIZANDO] Backend...
cd backend
call npm install
cd ..
if %errorlevel% neq 0 goto error_backend

:: --- FRONTEND ---
echo [ACTUALIZANDO] Frontend...
cd frontend
call npm install
cd ..
if %errorlevel% neq 0 goto error_frontend

echo.
echo  [OK] FASE 4 COMPLETADA. El sistema esta al dia.
echo.
pause
exit /b

:error_git
echo [ERROR] Error al descargar. Revisa tu conexion.
goto preguntar_ia

:error_raiz
echo.
echo [ERROR] Fallo al actualizar la Raiz.
goto preguntar_ia

:error_backend
echo.
echo [ERROR] Fallo al actualizar el Backend.
goto preguntar_ia

:error_frontend
echo.
echo [ERROR] Fallo al actualizar el Frontend.
goto preguntar_ia

:preguntar_ia
echo.
echo [?] ¿Quieres que el Asistente de IA te ayude con este error?
set /p help="Presiona 's' para consultar o cualquier otra tecla para salir: "
if /i "%help%"=="s" (
    echo [IA] Analizando error...
    codex "Ayuda con error Git o NPM en Windows. Codigo: %ERRORLEVEL%"
)
pause
exit /b
