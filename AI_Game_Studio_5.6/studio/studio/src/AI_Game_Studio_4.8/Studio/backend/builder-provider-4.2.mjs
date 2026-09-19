import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildCompleteGame } from '../builder-4.2/build-4.2.js';

const ROOT = path.resolve('../');
const jobs = new Map();
const makeId=()=> 'BUILD-'+crypto.randomBytes(5).toString('hex').toUpperCase();

export async function createBuildJob({projectId,idea,blueprint}) {
  const buildId=makeId();
  const job={buildId,projectId,status:'running',createdAt:new Date().toISOString(),stages:[]};
  jobs.set(buildId,job);
  try { const result=await buildCompleteGame({projectId,idea,blueprint,buildId}); Object.assign(job,result); job.status='completed'; }
  catch(e){ job.status='failed'; job.error=String(e?.message||e); }
  return job;
}
export function getBuildJob(buildId){ return jobs.get(buildId)||null; }
