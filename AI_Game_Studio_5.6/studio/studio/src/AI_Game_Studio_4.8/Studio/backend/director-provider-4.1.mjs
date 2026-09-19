import fs from "node:fs/promises";
import path from "node:path";

const jobs = new Map();

export function createDirectorJob({ projectId, stage="compile_graph", provider="director-runtime" }) {
  const jobId = `DIRECTOR-${projectId}-${stage}-${Date.now()}`;
  const job = { jobId, projectId, stage, provider, status:"queued", createdAt:new Date().toISOString() };
  jobs.set(jobId, job);
  return job;
}
export function getDirectorJob(jobId) { return jobs.get(jobId) || null; }
export async function persistDirectorJob(root, job) {
  const dir = path.join(root, "generated", job.projectId, "Director");
  await fs.mkdir(dir, {recursive:true});
  await fs.writeFile(path.join(dir, `${job.stage}.json`), JSON.stringify(job,null,2), "utf8");
  return job;
}
