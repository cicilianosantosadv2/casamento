import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  FPS, INTRO_FRAMES, OUTRO_FRAMES, TRANSITION_FRAMES,
  NARRATION_HEAD_FRAMES, calculateCues, photoSequenceFrames,
  choosePhotoDuration, sha256,
} from './lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--final');
const readJSON = (file, fallback) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : fallback;
const photos = readJSON(path.join(root,'src/data/photos.json'), []);
const voices = {};
const texts = {};
const missing = [];
const warnings = [];
for (const speaker of ['daniela','anderson']) {
  const textPath = path.join(root,`roteiro/votos-${speaker}.txt`);
  const raw = fs.existsSync(textPath) ? fs.readFileSync(textPath,'utf8') : '';
  texts[speaker] = raw.trim();
  const tts = readJSON(path.join(root,`public/data/tts_${speaker}.json`), null);
  if (!texts[speaker]) {
    missing.push(`Texto ${speaker}`);
    voices[speaker] = [];
  } else if (!tts || tts.sourceHash !== sha256(Buffer.from(raw))) {
    missing.push(`Audios ${speaker} ausentes/desatualizados`);
    voices[speaker] = [];
  } else {
    voices[speaker] = tts.segments || [];
    for (const seg of voices[speaker]) {
      if (!fs.existsSync(path.join(root,'public',seg.file))) {
        missing.push(`Arquivo ausente: ${seg.file}`);
      }
    }
  }
}

const cues = calculateCues(voices, INTRO_FRAMES + NARRATION_HEAD_FRAMES);
const selected = choosePhotoDuration({count: photos.length, cues});
const photoFrames = photoSequenceFrames(photos.length, selected.durationFrames, TRANSITION_FRAMES);
const music = path.join(root,'public/audio/trilha.mp3');
const musicEnabled = fs.existsSync(music);
const approvals = readJSON(path.join(root,'roteiro/aprovacoes.json'), {});
const missingApprovals = Object.entries(approvals).filter(([key,approved])=>approved!==true).map(([key])=>key);
const license = fs.readFileSync(path.join(root,'roteiro/licenca-trilha.txt'), 'utf8');
if (!license.trim() || license.includes('[PREENCHER]')) missing.push('Ficha de origem/licenca da trilha ainda nao preenchida');
if (!musicEnabled) missing.push('Trilha musical licenciada: public/audio/trilha.mp3');
if (photos.length !== 178) missing.push(`Fotografias: esperadas 178; encontradas ${photos.length}`);
if (!selected.fits && cues.length) warnings.push(`Narracao termina ${(selected.shortfallFrames/FPS).toFixed(1)} s alem da sequencia fotografica no teto de 3,5 s/foto. Replanejar conscientemente a montagem, sem cortar os votos.`);
const timeline = {
  fps: FPS, version: 1, photoCount: photos.length,
  introFrames: INTRO_FRAMES, outroFrames: OUTRO_FRAMES,
  photoDurationFrames: selected.durationFrames, transitionFrames: TRANSITION_FRAMES,
  photoSequenceFrames: photoFrames,
  durationFrames: INTRO_FRAMES + photoFrames + OUTRO_FRAMES,
  narrationStartFrame: INTRO_FRAMES + NARRATION_HEAD_FRAMES,
  voiceCues: cues,
  musicEnabled, incomplete: missing.length > 0, missing, warnings,
  createdAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(root,'src/data/timeline.json'), JSON.stringify(timeline,null,2)+'\n','utf8');
console.log(JSON.stringify({
  mode: strict?'FINAL':'RASCUNHO', count:photos.length, voices:voices && Object.fromEntries(Object.entries(voices).map(([k,v])=>[k,v.length])),
  durationMin: +(timeline.durationFrames/FPS/60).toFixed(2), musicEnabled,
  photoSeconds: +(selected.durationFrames/FPS).toFixed(2), missing, warnings,
},null,2));
if (strict && missingApprovals.length) console.error('Aprovacoes pendentes:', missingApprovals);
if (strict && (missing.length || warnings.length || missingApprovals.length)) {
  console.error('RENDER FINAL BLOQUEADO: corrija as pendencias acima. O rascunho/studio continua disponivel.');
  process.exit(2);
}
