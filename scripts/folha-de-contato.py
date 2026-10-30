"""Cria paginas de contato para revisar visualmente a ordem das fotografias.
Uso: python scripts/folha-de-contato.py
"""
import json
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parent.parent
photos=json.loads((ROOT/'src/data/photos.json').read_text(encoding='utf-8'))
if not photos:
    raise SystemExit('Sem fotos. Execute primeiro: npm run fotos')
WIDTH,HEIGHT,COLS,ROWS=210,180,6,8
OUT=ROOT/'out/folhas-de-contato'
OUT.mkdir(parents=True,exist_ok=True)
for page in range((len(photos)+COLS*ROWS-1)//(COLS*ROWS)):
    canvas=Image.new('RGB',(COLS*WIDTH,ROWS*HEIGHT),(26,25,24))
    d=ImageDraw.Draw(canvas)
    for page_i,p in enumerate(photos[page*COLS*ROWS:(page+1)*COLS*ROWS]):
        x=(page_i%COLS)*WIDTH; y=(page_i//COLS)*HEIGHT
        try:
            with Image.open(ROOT/'public'/p['file']) as raw:
                img=ImageOps.exif_transpose(raw).convert('RGB')
                img.thumbnail((WIDTH-16,HEIGHT-43))
                canvas.paste(img,(x+(WIDTH-img.width)//2,y+5+(HEIGHT-43-img.height)//2))
        except Exception:
            d.text((x+8,y+8),'ERRO AO LER',fill=(255,0,0))
        label=f'{p["id"]} | {p["sourceName"]}'
        d.text((x+8,y+HEIGHT-31),label[:31],fill=(238,228,214))
    name=OUT/f'contato_{page+1:02d}.jpg'
    canvas.save(name,quality=90)
    print(name)
