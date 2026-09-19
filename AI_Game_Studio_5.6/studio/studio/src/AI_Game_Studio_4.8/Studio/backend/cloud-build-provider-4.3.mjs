import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createCloudBuild } from '../cloud-build-4.3/cloud-build-4.3.js';

const ROOT = path.resolve('../..');
const jobs = new Map();
const makeId=()=> 'CLOUD-'+crypto.randomBytes(5).toString('hex').toUpperCase();

export async function createCloudBuildJob({projectId,idea,targets,unityVersion}) {
  const buildId=makeId();
  const job={buildId,projectId,status:'preparing',createdAt:new Date().toISOString()};
  jobs.set(buildId,job);
  try {
    const result=await createCloudBuild({projectId,idea,buildId,targets,unityVersion});
    Object.assign(job,result);
    if(process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY) {
      job.dispatch='configured';
      job.dispatchNote='Credentials detected. Use the generated workflow with GitHub Actions dispatch.';
    } else {
      job.dispatch='not_configured';
      job.dispatchNote='Set GITHUB_TOKEN and GITHUB_REPOSITORY to enable remote dispatch.';
    }
  } catch(e){ job.status='failed'; job.error=String(e?.message||e); }
  return job;
}
export function getCloudBuildJob(id){ return jobs.get(id)||null; }
