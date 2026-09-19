import fs from 'node:fs/promises';
import path from 'node:path';
const projectId = process.env.PROJECT_ID || 'UNKNOWN_PROJECT';
const buildId = process.env.BUILD_ID || 'CI_BUILD';
await fs.mkdir('Build', {recursive:true});
await fs.writeFile(path.join('Build','CI_BUILD_INFO.json'), JSON.stringify({projectId,buildId,createdAt:new Date().toISOString(),source:'AI Game Studio 4.3'},null,2));
console.log(JSON.stringify({ok:true,projectId,buildId}));
