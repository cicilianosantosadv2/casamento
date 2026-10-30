@echo off
chcp 65001 >nul
cd /d "%~dp0"
where claude >nul 2>nul
if errorlevel 1 (
  echo Claude Code nao encontrado no PATH. Instale ou abra o terminal Claude Code na pasta do projeto.
  pause
  exit /b 1
)
echo Iniciando Claude Code com as instrucoes do projeto...
claude "Leia CLAUDE.md, DIRECAO-DE-ARTE.md e COMANDO-PARA-CLAUDE-CODE.txt. Execute a fase inicial do projeto ate a previa e testes de voz, respeitando aprovacoes."
pause
