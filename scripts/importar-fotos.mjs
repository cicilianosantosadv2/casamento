import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {naturalCompare, sha256File} from './lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultWindows = String.raw`C:\Users\Windows\Pictures\Casamento\Casamento Dani e Anderson`;
const source = path.resolve(process.argv[2] ?? defaultWindows);
const destination = path.join(root, 'public', 'fotos');
const manifestPath = path.join(root, 'src', 'data', 'photos.json');
const allowed = new Set(['.jpg','.jpeg','.png','.webp']);

if (!fs.existsSync(source)) {
  console.error(`Nao encontrei as fotos em: ${source}`);
  console.error('Use: npm run fotos -- "CAMINHO_COMPLETO_DAS_FOTOS"');
  process.exit(1);
}

// Fotos organizadas em subpastas de capitulo ("001 ...", "002 ..."): varre recursivo,
// ordena por pasta e depois por nome; "X - Copia" vem depois de "X" para a deduplicacao manter o original.
const excludedDirs = new Set(['CRIAÇÃO DE VIDEO CASAMENTO']);
const copySuffix = / - C[oó]pia( \(\d+\))?$/i;
const walk = (dir) => fs.readdirSync(dir, {withFileTypes: true}).flatMap(ent => {
  const full = path.join(dir, ent.name);
  if (ent.isDirectory()) return excludedDirs.has(ent.name) ? [] : walk(full);
  return ent.isFile() && allowed.has(path.extname(ent.name).toLowerCase()) ? [path.relative(source, full)] : [];
});
const sortKey = (rel) => {
  const base = path.basename(rel, path.extname(rel));
  return {dir: path.dirname(rel), stem: base.replace(copySuffix, ''), copy: copySuffix.test(base) ? 1 : 0};
};
const files = walk(source).sort((a, b) => {
  const ka = sortKey(a), kb = sortKey(b);
  return naturalCompare(ka.dir, kb.dir) || naturalCompare(ka.stem, kb.stem) || ka.copy - kb.copy || naturalCompare(a, b);
});
fs.mkdirSync(destination, {recursive: true});

const seenHash = new Map();
const photos = [];
const duplicates = [];
for (const name of files) {
  const originalPath = path.join(source, name);
  const digest = sha256File(originalPath);
  if (seenHash.has(digest)) {
    duplicates.push({name, matches: seenHash.get(digest), hash: digest});
    continue;
  }
  seenHash.set(digest, name);
  const serial = String(photos.length + 1).padStart(3, '0');
  const clean = path.basename(name, path.extname(name)).slice(0, 60).replace(/[^A-Za-z0-9_-]/g, '_');
  const outputFile = `${serial}_${clean}_${digest.slice(0,8)}${path.extname(name).toLowerCase()}`;
  const outputPath = path.join(destination, outputFile);
  if (!fs.existsSync(outputPath) || sha256File(outputPath) !== digest) {
    fs.copyFileSync(originalPath, outputPath);
  }
  const capitulo = path.dirname(name) === '.' ? '' : path.dirname(name).split(path.sep)[0];
  photos.push({id: serial, file: `fotos/${outputFile}`, sourceName: name.split(path.sep).join('/'), capitulo, sha256: digest});
}

fs.writeFileSync(manifestPath, JSON.stringify(photos, null, 2) + '\n', 'utf8');
fs.mkdirSync(path.join(root, 'out'), {recursive: true});
const report = {
  source, totalArquivos: files.length, fotosUnicas: photos.length,
  duplicatasIdenticas: duplicates, ordem: 'pasta de capitulo, depois nome natural; copias apos original; revisar com folha de contato', pastasExcluidas: [...excludedDirs],
  filesCopiedTo: destination, sourceFilesPreserved: true,
};
fs.writeFileSync(path.join(root,'out','auditoria-fotos.json'), JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify(report, null, 2));
if (photos.length !== 178) {
  console.warn(`AVISO: Esperadas 178 fotos unicas, encontradas ${photos.length}. Confirme antes da renderizacao final.`);
}
