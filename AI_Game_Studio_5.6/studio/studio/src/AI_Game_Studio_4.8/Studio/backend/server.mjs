import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import OpenAI from "openai";
import { saveBase64Png, safeName } from './asset-service.mjs';
import { createAssetJob, getAssetJob } from './asset-pipeline-3.5.mjs';
import { create3DJob, get3DJob, sync3DJob } from './asset-provider-3.6.mjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT || 8787);
const DB_DIR = path.resolve("../data");
const DB_FILE = path.join(DB_DIR, "projects-3.1.json");
const ROOT_DIR = path.resolve('../..');

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function readDb() {
  try { return JSON.parse(await fs.readFile(DB_FILE, "utf8")); }
  catch { return { projects: [] }; }
}
async function writeDb(db) {
  await fs.mkdir(DB_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}
function projectId() {
  return "PROJECT-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

const SYSTEM = `
You are AI Game Studio's Game Director and Production Planner.
Turn a user's natural-language game idea into a coherent production Blueprint.
Preserve the user's requested genre, camera, visual style, scale and player mode when stated.
Create original content. Do not copy protected characters, stories, names, maps or assets.
Return JSON only with these top-level keys:
title, elevatorPitch, genre, visualStyle, scale, camera, playerMode, networking,
story, world, systems, qa, buildTargets.
story has premise, chapters, keyQuests, characters, endings.
world has locations, resources, events.
systems is an array of concrete gameplay systems.
qa is an array of testable checks.
buildTargets is an array selected from WebGL, Windows, Android, iOS.
Make the design internally consistent and sufficiently detailed to be useful as a real project specification.
`;

function fallbackBlueprint(idea, id) {
  return {
    projectId: id,
    version: "3.1.0",
    title: "AI Generated Game",
    elevatorPitch: idea,
    genre: "survival",
    visualStyle: "realistic 3D",
    scale: "small",
    camera: "third-person",
    playerMode: "solo",
    networking: "offline",
    story: { premise: idea, chapters: [], keyQuests: [], characters: [], endings: [] },
    world: { locations: [], resources: [], events: [] },
    systems: ["movement","camera","health","inventory","quests","dialogue","save","mobile_controls"],
    qa: ["Project ID isolation","Mobile input available","Save/load works"],
    buildTargets: ["WebGL","Android","iOS","Windows"]
  };
}

app.post('/api/assets/:projectId/jobs', async (req,res)=>{
  const db=await readDb();
  const p=db.projects.find(x=>x.projectId===req.params.projectId);
  if(!p) return res.status(404).json({error:'project not found'});
  const {type,name,prompt,format}=req.body||{};
  if(!type||!name||!prompt) return res.status(400).json({error:'type, name and prompt are required'});
  try { const job=await createAssetJob({projectId:p.projectId,type,name,prompt,format}); res.status(202).json(job); }
  catch(e){res.status(500).json({error:'asset job creation failed',detail:String(e?.message||e)})}
});

app.post('/api/assets/:projectId/3d/meshy', async (req,res)=>{
  const db=await readDb(); const p=db.projects.find(x=>x.projectId===req.params.projectId);
  if(!p) return res.status(404).json({error:'project not found'});
  const body=req.body||{}; if(!body.name||(!body.prompt&&!body.imageUrl)) return res.status(400).json({error:'name and prompt or imageUrl are required'});
  try {
    const job=await create3DJob({projectId:p.projectId,name:String(body.name),prompt:String(body.prompt||''),imageUrl:body.imageUrl,format:body.format||'glb',provider:body.imageUrl?'meshy-image':'meshy-text',autoRefine:body.autoRefine!==false,texturePrompt:body.texturePrompt});
    res.status(202).json(job);
  } catch(e){res.status(500).json({error:'3D provider request failed',detail:String(e?.message||e)})}
});
app.get('/api/assets/3d/:jobId', async (req,res)=>{
  try { const job=await sync3DJob(req.params.jobId); if(!job) return res.status(404).json({error:'3D job not found'}); res.json(job); }
  catch(e){res.status(502).json({error:'3D provider sync failed',detail:String(e?.message||e)})}
});

app.get('/api/assets/jobs/:jobId', async (req,res)=>{
  const job=await getAssetJob(req.params.jobId);
  if(!job) return res.status(404).json({error:'job not found'});
  res.json(job);
});

app.get("/api/health", (_, res) => {
  res.json({ ok: true, service: "AI Game Studio 3.6", aiConfigured: Boolean(client), imageGeneration: Boolean(client), imageModel: process.env.IMAGE_MODEL || 'gpt-image-2', meshyConfigured: Boolean(process.env.MESHY_API_KEY), meshModel: process.env.MESHY_MODEL || 'latest' });
});

app.post('/api/assets/:projectId/generate-image', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'OPENAI_API_KEY is not configured' });
  const db = await readDb();
  const p = db.projects.find(x => x.projectId === req.params.projectId);
  if (!p) return res.status(404).json({ error: 'project not found' });
  const prompt = String(req.body?.prompt || '').trim();
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });
  const jobId = String(req.body?.jobId || ('ASSET-' + crypto.randomBytes(5).toString('hex').toUpperCase()));
  const name = String(req.body?.name || 'generated_asset');
  try {
    const result = await client.images.generate({
      model: process.env.IMAGE_MODEL || 'gpt-image-2',
      prompt: `Original game asset for project ${p.projectId}. ${prompt}. Do not reproduce copyrighted characters, logos, brands, or existing franchise artwork.`,
      size: req.body?.size || '1536x1024',
      quality: req.body?.quality || 'medium',
      output_format: 'png'
    });
    const b64 = result?.data?.[0]?.b64_json;
    if (!b64) throw new Error('Image API returned no base64 image');
    const saved = await saveBase64Png({ rootDir: ROOT_DIR, projectId: p.projectId, jobId, name, base64: b64 });
    res.json({ ok: true, projectId: p.projectId, jobId, status: 'generated', model: process.env.IMAGE_MODEL || 'gpt-image-2', ...saved });
  } catch (err) {
    res.status(500).json({ error: 'image generation failed', detail: String(err?.message || err) });
  }
});

app.post("/api/projects", async (req, res) => {
  const idea = String(req.body?.idea || "").trim();
  if (!idea) return res.status(400).json({ error: "idea is required" });

  const db = await readDb();
  const id = projectId();
  const project = {
    projectId: id,
    version: "3.1.0",
    createdAt: new Date().toISOString(),
    status: "created",
    idea,
    blueprint: null
  };
  db.projects.push(project);
  await writeDb(db);
  res.json(project);
});

app.post("/api/projects/:id/generate", async (req, res) => {
  const db = await readDb();
  const p = db.projects.find(x => x.projectId === req.params.id);
  if (!p) return res.status(404).json({ error: "project not found" });

  if (!client) {
    p.blueprint = fallbackBlueprint(p.idea, p.projectId);
    p.status = "blueprint_ready_local_fallback";
    await writeDb(db);
    return res.json({ project: p, ai: false, message: "Set OPENAI_API_KEY to enable real AI generation." });
  }

  try {
    const response = await client.responses.create({
      model: process.env.AI_MODEL || "gpt-5.6-sol",
      instructions: SYSTEM,
      input: p.idea
    });

    const raw = response.output_text || "";
    let blueprint;
    try { blueprint = JSON.parse(raw); }
    catch {
      blueprint = fallbackBlueprint(p.idea, p.projectId);
      blueprint.rawModelOutput = raw.slice(0, 20000);
    }

    blueprint.projectId = p.projectId;
    blueprint.version = "3.1.0";
    p.blueprint = blueprint;
    p.status = "blueprint_ready";
    await writeDb(db);
    res.json({ project: p, ai: true });
  } catch (err) {
    res.status(500).json({ error: "AI generation failed", detail: String(err?.message || err) });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  const db = await readDb();
  const p = db.projects.find(x => x.projectId === req.params.id);
  if (!p) return res.status(404).json({ error: "project not found" });
  res.json(p);
});

app.listen(PORT, () => console.log(`AI Game Studio 3.1 backend: http://localhost:${PORT}`));


// --- AI Game Studio 3.7 Character Pipeline ---
import { createCharacterJob, getCharacterJob, saveCharacterJob } from "./character-provider-3.7.mjs";

app.post("/api/projects/:id/characters/:characterId/jobs", async (req, res) => {
  try {
    const projectId = req.params.id;
    const characterId = req.params.characterId;
    const { stage = "concept", prompt = "", provider = "provider-adapter" } = req.body || {};
    const job = createCharacterJob({ projectId, characterId, stage, prompt, provider });
    await saveCharacterJob(path.join(process.cwd(), "Studio", "backend"), job);
    res.json(job);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/character-jobs/:jobId", (req, res) => {
  const job = getCharacterJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Character job not found" });
  res.json(job);
});


// --- AI Game Studio 3.8 World Generator ---
import { createWorldJob, getWorldJob, persistWorldJob } from "./world-provider-3.8.mjs";

app.post("/api/projects/:id/worlds/:worldId/jobs", async (req, res) => {
  try {
    const projectId = req.params.id;
    const worldId = req.params.worldId;
    const { stage = "world_plan", prompt = "", provider = "provider-adapter" } = req.body || {};
    const job = createWorldJob({ projectId, worldId, stage, prompt, provider });
    await persistWorldJob(path.join(process.cwd(), "Studio", "backend"), job);
    res.json(job);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/world-jobs/:jobId", (req, res) => {
  const job = getWorldJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: "World job not found" });
  res.json(job);
});


// --- AI Game Studio 3.9 Gameplay World ---
import { createGameplayWorldJob, getGameplayWorldJob, persistGameplayWorldJob } from "./gameplay-world-provider-3.9.mjs";

app.post("/api/projects/:id/gameplay-worlds/:worldId/jobs", async (req, res) => {
  try {
    const projectId = req.params.id;
    const worldId = req.params.worldId;
    const { stage = "runtime_bindings", prompt = "", provider = "runtime-adapter" } = req.body || {};
    const job = createGameplayWorldJob({ projectId, worldId, stage, prompt, provider });
    await persistGameplayWorldJob(path.join(process.cwd(), "Studio", "backend"), job);
    res.json(job);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/gameplay-world-jobs/:jobId", (req, res) => {
  const job = getGameplayWorldJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Gameplay world job not found" });
  res.json(job);
});


// --- AI Game Studio 4.0 Unified Runtime ---
import { createRuntimeJob, getRuntimeJob, persistRuntimeJob } from "./runtime-4.0-provider.mjs";

app.post("/api/projects/:id/runtime/jobs", async (req, res) => {
  try {
    const projectId = req.params.id;
    const { stage = "assemble", provider = "unity-runtime" } = req.body || {};
    const job = createRuntimeJob({ projectId, stage, provider });
    await persistRuntimeJob(path.join(process.cwd(), "Studio", "backend"), job);
    res.json(job);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/runtime-jobs/:jobId", (req, res) => {
  const job = getRuntimeJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Runtime job not found" });
  res.json(job);
});


// --- AI Game Studio 4.1 AI Game Director Runtime ---
import { createDirectorJob, getDirectorJob, persistDirectorJob } from "./director-provider-4.1.mjs";

app.post("/api/projects/:id/director/jobs", async (req, res) => {
  try {
    const projectId = req.params.id;
    const { stage = "compile_graph", provider = "director-runtime" } = req.body || {};
    const job = createDirectorJob({ projectId, stage, provider });
    await persistDirectorJob(path.join(process.cwd(), "Studio", "backend"), job);
    res.json(job);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/director-jobs/:jobId", (req, res) => {
  const job = getDirectorJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Director job not found" });
  res.json(job);
});

// AI Game Studio 4.2 — one-command complete project builder
import { createBuildJob, getBuildJob } from './builder-provider-4.2.mjs';
app.post('/api/projects/:id/build', async (req,res)=>{
  const db=await readDb();
  const p=db.projects.find(x=>x.projectId===req.params.id);
  if(!p) return res.status(404).json({error:'project not found'});
  try {
    const job=await createBuildJob({projectId:p.projectId,idea:String(req.body?.idea||p.idea||''),blueprint:p.blueprint});
    res.status(202).json(job);
  } catch(e){ res.status(500).json({error:'build failed',detail:String(e?.message||e)}); }
});
app.get('/api/builds/:buildId',(req,res)=>{
  const job=getBuildJob(req.params.buildId);
  if(!job) return res.status(404).json({error:'build not found'});
  res.json(job);
});

// --- AI Game Studio 4.3 Cloud Build Orchestrator ---
import { createCloudBuildJob, getCloudBuildJob } from './cloud-build-provider-4.3.mjs';
app.post('/api/projects/:id/cloud-build', async (req,res)=>{
  const db=await readDb(); const p=db.projects.find(x=>x.projectId===req.params.id);
  if(!p) return res.status(404).json({error:'project not found'});
  try {
    const targets=Array.isArray(req.body?.targets)&&req.body.targets.length ? req.body.targets : (p.blueprint?.buildTargets||['WebGL','Android','iOS','Windows']);
    const job=await createCloudBuildJob({projectId:p.projectId,idea:String(p.idea||''),targets,unityVersion:String(req.body?.unityVersion||'2022.3.62f2')});
    res.status(202).json(job);
  } catch(e){res.status(500).json({error:'cloud build preparation failed',detail:String(e?.message||e)});}
});
app.get('/api/cloud-builds/:buildId',(req,res)=>{
  const job=getCloudBuildJob(req.params.buildId); if(!job) return res.status(404).json({error:'cloud build not found'}); res.json(job);
});
