import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const rootDir = path.resolve('../..');
const jobsDir = path.join(rootDir,'Studio','asset-jobs');
const safe=s=>String(s||'asset').replace(/[^a-z0-9_-]+/gi,'_').slice(0,70)||'asset';
export async function createAssetJob({projectId,type,name,prompt,format='glb'}){
  const jobId='ASSET35-'+crypto.randomBytes(6).toString('hex').toUpperCase();
  const job={jobId,projectId,type,name,prompt,format,status:'queued',createdAt:new Date().toISOString(),outputDir:`Studio/generated-assets/${projectId}/${type}`};
  await fs.mkdir(jobsDir,{recursive:true});
  await fs.writeFile(path.join(jobsDir,`${safe(jobId)}.json`),JSON.stringify(job,null,2));
  return job;
}
export async function getAssetJob(jobId){
  try{return JSON.parse(await fs.readFile(path.join(jobsDir,`${safe(jobId)}.json`),'utf8'));}catch{return null;}
}
