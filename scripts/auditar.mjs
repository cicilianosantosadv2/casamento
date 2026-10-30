import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sha256File} from './lib.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const photos = JSON.parse(fs.readFileSync(path.join(root,'src/data/photos.json'),'utf8'));
const missing = [];
const mismatches = [];
for (const [i,p] of photos.entries()) {
  const f = path.join(root,'public',p.file);
  if (!fs.existsSync(f)) missing.push(p.file);
  else if (sha256File(f) !== p.sha256) mismatches.push({position:i+1,file:p.file});
}
const hashGroups = photos.reduce((groups,p)=>{(groups[p.sha256] ??= []).push(p);return groups;},{});
const duplicates = Object.values(hashGroups).filter(v=>v.length>1).map(v=>v.map(x=>x.sourceName));
console.log(JSON.stringify({total:photos.length, missing, mismatches, duplicates, integrityOK:missing.length===0&&mismatches.length===0},null,2));
if (missing.length||mismatches.length||duplicates.length) process.exitCode = 1;
