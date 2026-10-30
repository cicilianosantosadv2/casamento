$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root
$fotoSource = 'C:\Users\Windows\Pictures\Casamento\Casamento Dani e Anderson'
$votosSource = 'C:\Users\Windows\Documents\VOTOS - ANDERSON.docx'
Write-Host ''
Write-Host 'DANIELA & ANDERSON - INICIALIZACAO' -ForegroundColor Yellow
Write-Host "Projeto: $root"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js nao encontrado. Instale Node.js LTS.' }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw 'npm nao encontrado. Reinstale Node.js LTS.' }
Write-Host '1/4 Instalando dependencias npm...'
npm install
if ($LASTEXITCODE -ne 0) { throw 'Falha no npm install.' }
if (Test-Path -LiteralPath $votosSource) {
  Copy-Item -LiteralPath $votosSource -Destination (Join-Path $root 'roteiro\originais\VOTOS - ANDERSON - copia-local.docx') -Force
  Write-Host 'Votos DOCX copiados para preservacao da fonte local.'
} else {
  Write-Host 'DOCX nao encontrado na pasta Documents; o original ja esta no kit e o texto esta disponivel.' -ForegroundColor Yellow
}
if (Test-Path -LiteralPath $fotoSource) {
  Write-Host '2/4 Importando fotografias...'
  node scripts/importar-fotos.mjs "$fotoSource"
  if ($LASTEXITCODE -ne 0) { throw 'Falha ao importar fotografias.' }
} else {
  Write-Host 'Pasta de fotos ainda nao disponivel. Ajuste o caminho se necessario:' -ForegroundColor Yellow
  Write-Host $fotoSource
}
Write-Host '3/4 Construindo a timeline inicial...'
node scripts/montar-timeline.mjs
if ($LASTEXITCODE -ne 0) { throw 'Falha ao criar timeline.' }
if (Get-Command py -ErrorAction SilentlyContinue) {
  Write-Host '4/4 Instalando ferramentas Python de voz e contato...'
  py -m pip install -r requirements.txt
  if ($LASTEXITCODE -ne 0) { Write-Host 'Python: dependencias nao instaladas; configure manualmente.' -ForegroundColor Yellow }
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  python -m pip install -r requirements.txt
  if ($LASTEXITCODE -ne 0) { Write-Host 'Python: dependencias nao instaladas; configure manualmente.' -ForegroundColor Yellow }
} else {
  Write-Host 'Python nao encontrado. Instale Python 3.11+ para TTS e folhas de contato.' -ForegroundColor Yellow
}
Write-Host ''
Write-Host 'Estrutura inicial preparada. Verifique pendencias antes de renderizar.' -ForegroundColor Green
Write-Host 'Execute: claude'
Write-Host 'Para conferir as fotos: python scripts/folha-de-contato.py'
Write-Host 'Para testar as vozes: python scripts/gerar-vozes.py --testes'
Write-Host 'Para abrir o Studio: npm run studio'
Write-Host 'AVISO: o render FINAL fica bloqueado ate receber os votos da Daniela, a voz aprovada e a trilha.'
