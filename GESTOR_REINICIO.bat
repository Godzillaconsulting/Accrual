@echo off
:: ============================================================
::  ACCRUAL - GESTOR MAESTRO DE REINICIO GRANULAR (DOCKER)
::  Elige QUE reiniciar sin tumbar el resto del stack.
:: ============================================================

net session >nul 2>&1
if %errorLevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: Cambiar al directorio del script
cd /d "%~dp0"

title ACCRUAL - Gestor de Reinicio Granular (Docker)
color 0B

:MENU
cls
echo.
echo  ============================================
echo   ACCRUAL - REINICIO GRANULAR (DOCKER)
echo  ============================================
echo.
echo   Elige que proceso reiniciar o gestionar:
echo.
echo   [1] API Backend (Servidor Web) (accrual-api)
echo   [2] Bot WhatsApp               (accrual-bot)
echo   [3] Tunel Cloudflare           (accrual-cloudflare-tunnel)
echo   [4] REINICIO TOTAL             (los 3 servicios)
echo   [5] Ver estado Docker (PS)     (sin reiniciar nada)
echo   [6] RECONSTRUCCION COMPLETA    (down, build y up)
echo   [7] REPARAR BOT WP             (borra sesion corrupta de Baileys)
echo   [8] DORMIR BOT WP              (Apaga el bot)
echo   [9] DESPERTAR BOT WP           (Prende el bot)
echo   [0] Salir
echo.
set /p OPCION="  Tu eleccion: "

if "%OPCION%"=="1" goto RESTART_API
if "%OPCION%"=="2" goto RESTART_BOT
if "%OPCION%"=="3" goto RESTART_TUNEL
if "%OPCION%"=="4" goto RESTART_TOTAL
if "%OPCION%"=="5" goto STATUS
if "%OPCION%"=="6" goto REBUILD_ALL
if "%OPCION%"=="7" goto REPARAR_WP
if "%OPCION%"=="8" goto DORMIR_BOT
if "%OPCION%"=="9" goto DESPERTAR_BOT
if "%OPCION%"=="0" exit /b
goto MENU

:RESTART_API
cls
echo.
echo  Reiniciando SOLO accrual-api en Docker...
docker compose restart accrual-api
timeout /t 3 /nobreak >nul
echo.
echo  Logs recientes del API:
docker compose logs --tail=10 accrual-api
echo.
echo  Health check: http://localhost:3002/api/health
echo.
pause
goto MENU

:RESTART_BOT
cls
echo.
echo  Reiniciando SOLO accrual-bot en Docker...
docker compose restart accrual-bot
echo  Esperando 5s para inicializar...
timeout /t 5 /nobreak >nul
echo.
echo  Logs recientes del Bot:
docker compose logs --tail=10 accrual-bot
echo.
echo  Si necesita vincular WP, revisa la imagen qr_accrual.png
echo.
pause
goto MENU

:RESTART_TUNEL
cls
echo.
echo  Reiniciando SOLO tunel Cloudflare en Docker...
docker compose restart accrual-cloudflare-tunnel
echo  Esperando 3s...
timeout /t 3 /nobreak >nul
echo.
echo  Logs recientes del Tunel:
docker compose logs --tail=10 accrual-cloudflare-tunnel
echo.
pause
goto MENU

:RESTART_TOTAL
cls
echo.
echo  Reiniciando todos los servicios en Docker...
docker compose restart
timeout /t 3 /nobreak >nul
echo.
docker compose ps
echo.
pause
goto MENU

:STATUS
cls
echo.
echo  ==============================================================
echo   ESTADO ACTUAL DE CONTENEDORES DOCKER
echo  ==============================================================
docker compose ps
echo.
pause
goto MENU

:REBUILD_ALL
cls
echo.
echo  Liberando puertos 3001 y 3002 de procesos antiguos en Windows...
powershell -Command "Get-NetTCPConnection -LocalPort 3001,3002 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
timeout /t 2 /nobreak >nul

echo  Reconstruyendo y levantando todo el stack de Docker...
docker compose down
docker compose up --build -d
timeout /t 3 /nobreak >nul
echo.
docker compose ps
echo.
pause
goto MENU

:REPARAR_WP
cls
color 4F
echo.
echo ========================================================
echo   LIMPIEZA EXTREMA DE SESION CORRUPTA DE WHATSAPP
echo ========================================================
echo.
echo  ATENCION: Esto borrara la sesion del bot de WhatsApp.
echo  Presiona ENTER para continuar o cierra para cancelar.
pause

echo [1/3] Deteniendo contenedor del bot...
docker compose stop accrual-bot

echo [2/3] Borrando carpeta de sesion de Baileys...
if exist "bot_sessions" (
    rmdir /S /Q "bot_sessions"
    echo  Sesion borrada.
) else (
    echo  No se encontro carpeta de sesion, continuando...
)

:: Limpiar imagen QR anterior
if exist "qr_accrual.png" (
    del /F /Q "qr_accrual.png" 2>nul
)

echo [3/3] Arrancando bot fresco...
docker compose start accrual-bot
timeout /t 5 /nobreak >nul

echo.
echo ========================================================
echo PROCESO COMPLETADO.
echo Escanea la imagen qr_accrual.png para vincular WhatsApp.
echo ========================================================
pause
color 0B
goto MENU

:DORMIR_BOT
cls
color 60
echo.
echo ========================================================
echo   DURMIENDO AL BOT DE WHATSAPP (MODO SILENCIO)
echo ========================================================
echo.
docker compose stop accrual-bot
echo.
echo  ZZZ... El bot de WhatsApp esta detenido.
echo.
pause
color 0B
goto MENU

:DESPERTAR_BOT
cls
color 20
echo.
echo ========================================================
echo   DESPERTANDO AL BOT DE WHATSAPP (MODO ACTIVO)
echo ========================================================
echo.
docker compose start accrual-bot
echo.
echo  El bot ha arrancado.
echo.
pause
color 0B
goto MENU
