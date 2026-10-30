"""Compara o texto original de Anderson com o extrato usado pelo TTS.
Nao muda nem corrige o conteudo.
"""
from pathlib import Path
from docx import Document
ROOT=Path(__file__).resolve().parent.parent
source=ROOT/'roteiro/originais/VOTOS - ANDERSON.docx'
text=ROOT/'roteiro/votos-anderson.txt'
original=Document(source)
paragraphs=[p.text.strip() for p in original.paragraphs if p.text.strip()]
expected='\n\n'.join(paragraphs[1:])+'\n'
observed=text.read_text(encoding='utf-8')
if expected!=observed:
    raise SystemExit('ALERTA: texto dos votos foi alterado em relacao ao DOCX preservado. Reconciliar manualmente.')
print(f'TEXTO EXATO: {len(paragraphs)-1} paragrafos, {len(observed.split())} palavras, sem o titulo documental.')
print('OBSERVACAO: o subtitulo "As tres coisas que quero levar conosco" consta no trecho a narrar; decida se deve ser falado.')
