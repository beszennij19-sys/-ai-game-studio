import fs from "node:fs/promises";
import path from "node:path";

const jobs = new Map();

export function createCharacterJob({ projectId, characterId, stage, prompt, provider="provider-adapter" }) {
  const jobId = `CHARJOB-${projectId}-${characterId}-${stage}-${Date.now()}`;
  const job = { jobId, projectId, characterId, stage, prompt, provider, status: "queued", createdAt: new Date().toISOString() };
  jobs.set(jobId, job);
  return job;
}

export function getCharacterJob(jobId) {
  return jobs.get(jobId) || null;
}

export async function saveCharacterJob(root, job) {
  const dir = path.join(root, "generated", job.projectId, "Characters", job.characterId);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${job.stage}.json`), JSON.stringify(job, null, 2), "utf8");
  return job;
}
