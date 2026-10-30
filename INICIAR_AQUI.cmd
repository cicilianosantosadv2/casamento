@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\INICIAR_AQUI.ps1"
if errorlevel 1 (
  echo.
  echo ERRO NA PREPARACAO. Verifique a mensagem acima.
) else (
  echo.
  echo Preparacao concluida. Leia o README e siga com o Claude Code.
)
pause
