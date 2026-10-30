// Lista, sem alterar nada, o que ainda bloqueia o render final.
// Mesmas regras de `montar-timeline.mjs --final`, mais a conferencia humana da transcricao da Daniela.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sha256} from './lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJSON = (file, fallback) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : fallback;
const pendencias = [];
const ok = [];

for (const speaker of ['daniela','anderson']) {
  const raw = fs.existsSync(path.join(root,`roteiro/votos-${speaker}.txt`)) ? fs.readFileSync(path.join(root,`roteiro/votos-${speaker}.txt`),'utf8') : '';
  const tts = readJSON(path.join(root,`public/data/tts_${speaker}.json`), null);
  if (!raw.trim()) pendencias.push(`Votos ${speaker}: texto vazio`);
  else if (!tts || tts.sourceHash !== sha256(Buffer.from(raw))) pendencias.push(`Narracao ${speaker}: ausente ou desatualizada (rodar python scripts/gerar-vozes.py --pessoa ${speaker})`);
  else {
    const faltando = (tts.segments || []).filter(seg => !fs.existsSync(path.join(root,'public',seg.file)));
    if (faltando.length) pendencias.push(`Narracao ${speaker}: ${faltando.length} arquivo(s) de audio ausente(s)`);
    else ok.push(`Narracao ${speaker}: ${tts.segments.length} trechos em dia com o texto`);
  }
}

const transcricao = readJSON(path.join(root,'out/transcricao-votos-daniela.json'), null);
if (!transcricao?.conferidoPorHumano) pendencias.push('Transcricao da Daniela: conferir contra o PDF e marcar "conferidoPorHumano": true em out/transcricao-votos-daniela.json');
else ok.push('Transcricao da Daniela conferida');

const photos = readJSON(path.join(root,'src/data/photos.json'), []);
if (photos.length !== 178) pendencias.push(`Fotografias: esperadas 178; encontradas ${photos.length}`);
else ok.push('178 fotografias no manifesto');

if (!fs.existsSync(path.join(root,'public/audio/trilha.mp3'))) pendencias.push('Trilha: falta public/audio/trilha.mp3');
else ok.push('Trilha presente');
const license = fs.existsSync(path.join(root,'roteiro/licenca-trilha.txt')) ? fs.readFileSync(path.join(root,'roteiro/licenca-trilha.txt'),'utf8') : '';
if (!license.trim() || license.includes('[PREENCHER]')) pendencias.push('Licenca: preencher roteiro/licenca-trilha.txt');
else ok.push('Licenca preenchida');

const approvals = readJSON(path.join(root,'roteiro/aprovacoes.json'), {});
for (const [key, value] of Object.entries(approvals)) {
  if (value === true) ok.push(`Aprovado: ${key}`);
  else pendencias.push(`Aprovacao pendente (marcar voce mesmo): ${key}`);
}

console.log('OK:');
for (const item of ok) console.log(`  [x] ${item}`);
console.log('PENDENTE:');
for (const item of pendencias) console.log(`  [ ] ${item}`);
console.log(pendencias.length ? `\nRENDER FINAL BLOQUEADO: ${pendencias.length} pendencia(s).` : '\nPRONTO: pode rodar npm run render.');
process.exit(pendencias.length ? 2 : 0);
