import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export function safeName(value='asset') {
  return String(value).toLowerCase().replace(/[^a-z0-9а-яё_-]+/gi,'_').replace(/^_+|_+$/g,'').slice(0,70) || 'asset';
}

export async function saveBase64Png({rootDir, projectId, jobId, name, base64}) {
  const dir = path.join(rootDir, 'Studio', 'generated-assets', projectId);
  await fs.mkdir(dir, {recursive:true});
  const file = `${safeName(jobId)}_${safeName(name)}.png`;
  const abs = path.join(dir, file);
  await fs.writeFile(abs, Buffer.from(base64, 'base64'));
  return {file, absolutePath: abs, relativePath: path.relative(rootDir, abs).replaceAll(path.sep,'/')};
}

export function assetToken() { return 'ASSET-' + crypto.randomBytes(5).toString('hex').toUpperCase(); }
