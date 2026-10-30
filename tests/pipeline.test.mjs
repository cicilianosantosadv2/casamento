import test from 'node:test';
import assert from 'node:assert/strict';
import {
 photoSequenceFrames, naturalCompare, calculateCues, choosePhotoDuration,
 INTRO_FRAMES, FPS,
} from '../scripts/lib.mjs';

test('178 imagens com transicoes sobrepostas: duracao exata',()=>{
  assert.equal(photoSequenceFrames(178, 103, 6), 178*103 - 177*6);
});
test('ordenacao de arquivos respeita numeros',()=>{
  assert.ok(naturalCompare('3I1A9.jpg','3I1A10.jpg')<0);
});
test('sintese: vozes sequenciais nao se sobrepoem',()=>{
 const cues=calculateCues({daniela:[{file:'d.mp3',text:'A',durationSeconds:3,pauseAfterFrames:12}],anderson:[{file:'a.mp3',text:'B',durationSeconds:4,pauseAfterFrames:12}]},INTRO_FRAMES+210);
 assert.equal(cues.length,2);
 assert.ok(cues[1].startFrame>cues[0].endFrame);
 assert.equal(cues[0].durationFrames,3*FPS);
});
test('voz longa nao deve ser truncada silenciosamente',()=>{
 const v=choosePhotoDuration({count:178,cues:[{endFrame:30000}]});
 assert.equal(v.fits,false);
 assert.ok(v.shortfallFrames>0);
});

test('marcacao de intro compatível com 12 segundos de abertura',()=>{
 assert.equal(INTRO_FRAMES, 12 * FPS);
});
test('se nao ha fotos a duracao nao pode ser negativa',()=>{
 assert.equal(photoSequenceFrames(0,103,6),0);
});
