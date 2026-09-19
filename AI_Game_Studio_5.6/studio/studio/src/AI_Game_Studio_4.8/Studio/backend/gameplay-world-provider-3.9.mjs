import fs from "node:fs/promises";
import path from "node:path";

const jobs = new Map();

export function createGameplayWorldJob({ projectId, worldId, stage, prompt, provider="runtime-adapter" }) {
  const jobId = `GWJOB-${projectId}-${worldId}-${stage}-${Date.now()}`;
  const job = {
    jobId, projectId, worldId, stage, prompt, provider,
    status: "queued", createdAt: new Date().toISOString()
  };
  jobs.set(jobId, job);
  return job;
}

export function getGameplayWorldJob(jobId) {
  return jobs.get(jobId) || null;
}

export async function persistGameplayWorldJob(root, job) {
  const dir = path.join(root, "generated", job.projectId, "GameplayWorld", job.worldId);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${job.stage}.json`), JSON.stringify(job, null, 2), "utf8");
  return job;
}
