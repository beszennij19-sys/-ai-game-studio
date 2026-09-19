import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const required = [
  'studio/launch-5.1/launch-manifest-5.1.json',
  'studio/web-5.1/index.html',
  'studio/deploy-5.1/docker-compose.yml',
  'studio/deploy-5.1/Caddyfile'
];
const missing = required.filter(p => !fs.existsSync(path.join(root, p)));
if (missing.length) { console.error(JSON.stringify({ok:false, missing}, null, 2)); process.exit(1); }
console.log(JSON.stringify({ok:true, checks:required.length, missing:[]}, null, 2));
