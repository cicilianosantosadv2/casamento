"""Geracao de amostras e votos em pt-BR (Edge TTS). Nunca altera os votos de origem.

Exemplos:
  python scripts/gerar-vozes.py --testes
  python scripts/gerar-vozes.py --pessoa anderson
  python scripts/gerar-vozes.py --pessoa daniela
  python scripts/gerar-vozes.py --pessoa todas
"""
import argparse
import asyncio
import hashlib
import json
import re
from pathlib import Path

import edge_tts
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
CONFIG = {
    'daniela': {'voice':'pt-BR-FranciscaNeural','rate':'-6%','pitch':'-2Hz'},
    'anderson': {'voice':'pt-BR-AntonioNeural','rate':'-8%','pitch':'-5Hz'},
}
TESTS = [
    ('daniela_01','pt-BR-FranciscaNeural','-6%','-2Hz', 'Daniela'),
    ('daniela_02','pt-BR-FranciscaNeural','-9%','-2Hz', 'Daniela'),
    ('daniela_03','pt-BR-ThalitaMultilingualNeural','-6%','+0Hz', 'Daniela'),  # Brenda saiu do catalogo Edge (out/2026)
    ('anderson_01','pt-BR-AntonioNeural','-8%','-5Hz', 'Anderson'),
    ('anderson_02','pt-BR-AntonioNeural','-5%','-2Hz', 'Anderson'),
    ('anderson_03','pt-BR-AntonioNeural','-7%','-9Hz', 'Anderson'),  # Fabio saiu do catalogo Edge; Antonio mais grave
]
TEST_TEXT = {
    'Daniela': ('Anderson, quando penso em tudo o que vivemos, percebo que o amor '
                'também mora nos pequenos gestos de cada dia.'),
    'Anderson': ('Daniela, depois de tudo o que construímos, sigo escolhendo '
                 'caminhar ao seu lado, com amor e atenção aos nossos dias.'),
}


def chunks_of(text: str, max_len: int = 235) -> list[str]:
    # Divide por paragrafos e sentencas sem parafrasear o texto.
    paragraphs = [p.strip() for p in re.split(r'\n\s*\n', text) if p.strip()]
    pieces = []
    for p in paragraphs:
        if len(p) <= max_len:
            pieces.append(p)
        else:
            sentences = re.split(r'(?<=[.!?])\s+(?=[A-ZÁÀÂÃÉÍÓÔÕÚÇ])', p)
            buf = ''
            for sentence in sentences:
                if len(buf) + len(sentence) + 1 <= max_len:
                    buf = (buf + ' ' + sentence).strip()
                else:
                    if buf: pieces.append(buf)
                    buf = sentence
            if buf: pieces.append(buf)
    # Agrupa paragrafos muito curtos, preservando as palavras e a ordem.
    merged=[]
    for piece in pieces:
        if merged and len(merged[-1]) < 48 and len(merged[-1])+len(piece)+1 < max_len:
            merged[-1] += ' ' + piece
        else:
            merged.append(piece)
    return merged


def pause_after(text: str) -> int:
    if text.endswith(':'): return 24
    if re.search(r'(prometo|escolho|continuar|amor)', text, re.I) and len(text)<100: return 21
    if text.endswith(('.', '!', '?')): return 12
    return 8


async def synthesize(text:str, filename:Path, voice:str,rate:str,pitch:str):
    filename.parent.mkdir(parents=True,exist_ok=True)
    last_error=None
    for attempt in range(3):
        try:
            task=edge_tts.Communicate(text=text,voice=voice,rate=rate,pitch=pitch,volume='+0%')
            await task.save(str(filename))
            if filename.stat().st_size<1000: raise RuntimeError('MP3 aparentemente incompleto')
            return
        except Exception as exc:
            last_error=exc
            filename.unlink(missing_ok=True)
            await asyncio.sleep(1.5*(attempt+1))
    raise RuntimeError(f'Falha ao gerar {filename.name}: {last_error}')


async def run_tests():
    output=ROOT/'public/audio/testes'
    output.mkdir(parents=True,exist_ok=True)
    for filename,voice,rate,pitch,who in TESTS:
        target=output/f'{filename}.mp3'
        await synthesize(TEST_TEXT[who],target,voice,rate,pitch)
        print(f'{target.name}: {MP3(target).info.length:.2f}s / {voice} {rate} {pitch}')
    print('Ouça as seis amostras e aprove as duas vozes ANTES de gerar o filme definitivo.')


async def generate(who:str):
    source=ROOT/f'roteiro/votos-{who}.txt'
    content=source.read_text(encoding='utf-8') if source.exists() else ''
    if not content.strip():
        raise RuntimeError(f'Falta o texto de {who}: {source}. Nao inventar os votos.')
    original_hash=hashlib.sha256(content.encode('utf-8')).hexdigest()
    config=CONFIG[who]
    pieces=chunks_of(content)
    folder=ROOT/'public/audio/votos'
    folder.mkdir(parents=True,exist_ok=True)
    segments=[]
    for i,piece in enumerate(pieces,1):
        target=folder/f'{who}_{i:03d}.mp3'
        # Regenera todos ao modificar o texto: nenhum trecho desatualizado.
        await synthesize(piece,target,**config)
        duration=float(MP3(target).info.length)
        segments.append({'file':f'audio/votos/{target.name}','text':piece,
                         'durationSeconds':round(duration,4), 'pauseAfterFrames':pause_after(piece)})
        print(f'{who} {i:02d}/{len(pieces)} | {duration:.1f}s | {piece[:55]}')
        await asyncio.sleep(.6)
    data={'speaker':who,'sourceHash':original_hash,'config':config,
          'segments':segments,'totalSecondsApprox':round(sum(s['durationSeconds']+s['pauseAfterFrames']/FPS for s in segments),1)}
    target=ROOT/f'public/data/tts_{who}.json'
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Manifesto salvo: {target}')
    print(f'Frases/partes geradas: {len(segments)}, duracao aproximada: {data["totalSecondsApprox"]} segundos')

async def main():
    parser=argparse.ArgumentParser()
    group=parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--testes',action='store_true')
    group.add_argument('--pessoa', choices=['anderson','daniela','todas'])
    args=parser.parse_args()
    if args.testes:
        await run_tests()
    else:
        targets=['daniela','anderson'] if args.pessoa=='todas' else [args.pessoa]
        for t in targets: await generate(t)

if __name__=='__main__':
    asyncio.run(main())
