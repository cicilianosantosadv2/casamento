"""Registra a transcricao dos votos de Daniela feita a partir do PDF escaneado.
O PDF nao tem camada de texto (scan CamScanner), entao nao ha comparacao automatica
como no DOCX do Anderson: a conferencia final e humana, linha a linha, contra o PDF.
Nao muda nem corrige o conteudo.
"""
import hashlib, json
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
pdf=ROOT/'roteiro/originais/Votos Daniela.pdf'
text=ROOT/'roteiro/votos-daniela.txt'
sha=lambda b: hashlib.sha256(b).hexdigest()
if not pdf.exists():
    raise SystemExit(f'ALERTA: PDF original ausente em {pdf}')
observed=text.read_text(encoding='utf-8')
if not observed.strip():
    raise SystemExit('ALERTA: roteiro/votos-daniela.txt vazio. Transcrever o PDF literalmente.')
paragraphs=[p for p in observed.split('\n\n') if p.strip()]
if observed!='\n\n'.join(p.strip() for p in paragraphs)+'\n':
    raise SystemExit('ALERTA: formato fora do padrao (paragrafos separados por linha em branco, \\n final).')
report={
    'pdf': str(pdf.relative_to(ROOT)), 'pdfSha256': sha(pdf.read_bytes()),
    'texto': str(text.relative_to(ROOT)), 'textoSha256': sha(observed.encode('utf-8')),
    'paragrafos': len(paragraphs), 'palavras': len(observed.split()),
    'metodo': 'transcricao literal do scan (PDF sem camada de texto); requer conferencia humana contra o PDF',
    'observacoes': [
        '"diante um do outro" mantido literal, sem "de", como no original',
        '"eu escolho você." esta em negrito no original; o TTS nao reproduz negrito',
        'paragrafo 1 e a saudacao "Anderson,"; decidir se deve ser falada',
    ],
    'conferidoPorHumano': False,
}
(ROOT/'out').mkdir(exist_ok=True)
(ROOT/'out/transcricao-votos-daniela.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'TRANSCRICAO REGISTRADA: {report["paragrafos"]} paragrafos, {report["palavras"]} palavras. Conferencia humana pendente.')
