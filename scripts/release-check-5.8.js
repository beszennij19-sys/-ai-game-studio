import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const required = ['VERSION_5.8.json', 'RELEASE_5.8.md'];
const errors = [];
for (const file of required) if (!fs.existsSync(path.join(root, file))) errors.push(`Missing ${file}`);

try { JSON.parse(fs.readFileSync(path.join(root, 'VERSION_5.8.json'), 'utf8')); }
catch (e) { errors.push(`Invalid VERSION_5.8.json: ${e.message}`); }

const files = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full); else files.push(full);
  }
}
walk(root);

const jsFiles = files.filter(f => /\.(js|mjs|cjs)$/.test(f) && !f.endsWith('release-check-5.8.js'));
for (const file of jsFiles) {
  const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (r.status !== 0) errors.push(`JS syntax failed: ${path.relative(root, file)}\n${r.stderr.trim()}`);
}

const envExamples = files.filter(f => /\.env(\.|$)/.test(path.basename(f)));
for (const file of envExamples) {
  const text = fs.readFileSync(file, 'utf8');
  if (/OPENAI_API_KEY\s*=\s*sk-[A-Za-z0-9_-]{20,}/.test(text)) errors.push(`Possible real OpenAI key in ${path.relative(root, file)}`);
}

if (errors.length) {
  console.error('5.8 RELEASE CHECK: FAIL');
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('5.8 RELEASE CHECK: PASS');
console.log(`Files checked: ${files.length}`);
console.log(`JS/MJS/CJS checked: ${jsFiles.length}`);
console.log('JSON release manifest: valid');
console.log('Secret scan: pass');
