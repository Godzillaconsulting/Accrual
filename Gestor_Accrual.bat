@echo off
setlocal
:: Comprobar privilegios de Administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando permisos de Administrador...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: Cambiar al directorio del script
cd /d "%~dp0"

echo ============================================
echo   LEVANTANDO GESTOR ACCRUAL (BAILEYS + IA)
echo ============================================
node gestor.js
pause
