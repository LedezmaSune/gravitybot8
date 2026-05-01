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
pause
exit /b

:error_raiz
echo.
echo [ERROR] Fallo al actualizar la Raiz.
pause
exit /b

:error_backend
echo.
echo [ERROR] Fallo al actualizar el Backend.
pause
exit /b

:error_frontend
echo.
echo [ERROR] Fallo al actualizar el Frontend.
pause
exit /b
