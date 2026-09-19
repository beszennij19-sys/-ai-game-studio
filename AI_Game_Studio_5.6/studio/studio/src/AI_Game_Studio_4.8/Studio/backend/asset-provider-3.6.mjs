import fs from 'node:fs/promises';
import path from 'node:path';
import { createMeshyText3D, refineMeshyText3D, getMeshyText3D, createMeshyImage3D, getMeshyImage3D, downloadGenerated } from './provider-3.6.mjs';

const STATE=path.resolve('../data/assets-3.6.json');
async function read(){try{return JSON.parse(await fs.readFile(STATE,'utf8'))}catch{return {jobs:[]}}}
async function write(db){await fs.mkdir(path.dirname(STATE),{recursive:true});await fs.writeFile(STATE,JSON.stringify(db,null,2))}

export async function create3DJob(input){
  const db=await read();
  let job;
  if(input.provider==='meshy-image') job=await createMeshyImage3D(input);
  else job=await createMeshyText3D(input);
  job.name=input.name; job.prompt=input.prompt||null; job.createdAt=new Date().toISOString(); job.autoRefine=input.autoRefine!==false;
  db.jobs.push(job); await write(db); return job;
}

export async function get3DJob(jobId){const db=await read();return db.jobs.find(j=>j.jobId===jobId)||null}

export async function sync3DJob(jobId){
  const db=await read(); const job=db.jobs.find(j=>j.jobId===jobId); if(!job) return null;
  const task=job.stage==='image_to_3d'?await getMeshyImage3D(job.providerTaskId):await getMeshyText3D(job.providerTaskId);
  job.providerStatus=task.status; job.progress=task.progress??0; job.updatedAt=new Date().toISOString();
  if(task.status==='SUCCEEDED'){
    if(job.stage==='preview' && job.autoRefine){
      const refined=await refineMeshyText3D({providerTaskId:job.providerTaskId,format:job.format,texturePrompt:job.texturePrompt});
      job.providerTaskId=refined.providerTaskId; job.stage='refine'; job.providerStatus='PENDING'; job.progress=0;
    } else {
      const url=task.model_urls?.[job.format] || task.model_urls?.glb;
      job.result=await downloadGenerated({projectId:job.projectId,jobId:job.jobId,name:job.name,type:'3d',format:job.format,url});
      job.status='completed'; job.completedAt=new Date().toISOString();
    }
  } else if(task.status==='FAILED'){job.status='failed';job.error=task.task_error?.message||'provider task failed'}
  else job.status='processing';
  await write(db); return job;
}
