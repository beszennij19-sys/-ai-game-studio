import fs from "node:fs/promises";
import path from "node:path";

const runtimeJobs = new Map();

export function createRuntimeJob({ projectId, stage = "assemble", provider = "unity-runtime" }) {
  const jobId = `RUNTIME-${projectId}-${stage}-${Date.now()}`;
  const job = {
    jobId, projectId, stage, provider,
    status: "queued", createdAt: new Date().toISOString()
  };
  runtimeJobs.set(jobId, job);
  return job;
}

export function getRuntimeJob(jobId) {
  return runtimeJobs.get(jobId) || null;
}

export async function persistRuntimeJob(root, job) {
  const dir = path.join(root, "generated", job.projectId, "Runtime");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${job.stage}.json`), JSON.stringify(job, null, 2), "utf8");
  return job;
}
