import fs from "node:fs/promises";
import path from "node:path";

const worldJobs = new Map();

export function createWorldJob({ projectId, worldId, stage, prompt, provider="provider-adapter" }) {
  const jobId = `WORLDJOB-${projectId}-${worldId}-${stage}-${Date.now()}`;
  const job = {
    jobId, projectId, worldId, stage, prompt, provider,
    status: "queued", createdAt: new Date().toISOString()
  };
  worldJobs.set(jobId, job);
  return job;
}

export function getWorldJob(jobId) {
  return worldJobs.get(jobId) || null;
}

export async function persistWorldJob(root, job) {
  const dir = path.join(root, "generated", job.projectId, "World", job.worldId);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${job.stage}.json`), JSON.stringify(job, null, 2), "utf8");
  return job;
}
