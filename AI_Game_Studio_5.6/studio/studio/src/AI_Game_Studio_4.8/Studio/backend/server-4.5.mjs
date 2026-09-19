import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import OpenAI from 'openai';
import { createBuildJob, getBuildJob } from './builder-provider-4.2.mjs';

dotenv.config({ path: path.join(process.cwd(), '.env') });
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
const ROOT = path.resolve('../..');
const DATA = path.join(ROOT, 'Studio', 'data');
const DB = path.join(DATA, 'projects-4.5.json');
const WEB = path.join(ROOT, 'Studio', 'web', '4.5');
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const makeId = p => `${p}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
async function read(){try{return JSON.parse(await fs.readFile(DB,'utf8'))}catch{return{users:[],projects:[]}}}
async function write(d){await fs.mkdir(DATA,{recursive:true});await fs.writeFile(DB,JSON.stringify(d,null,2))}
function userId(req){return String(req.headers['x-studio-user']||'').trim()}
function requireUser(req,res,next){const id=userId(req);if(!id)return res.status(401).json({error:'studio session required'});req.studioUser=id;next()}
const fallback=(idea,pid)=>({projectId:pid,version:'4.5.0',title:'AI Game Project',elevatorPitch:idea,genre:'survival',visualStyle:'realistic 3D',scale:'medium',camera:'third-person',playerMode:'solo',networking:'offline',story:{premise:idea,chapters:[],keyQuests:[],characters:[],endings:[]},world:{locations:[],resources:[],events:[]},systems:['movement','camera','health','inventory','quests','dialogue','save','mobile_controls'],qa:['Project isolation','Mobile controls','Save/load'],buildTargets:['WebGL','Android','iOS','Windows']});
const SYSTEM=`You are AI Game Studio Game Director. Create an original production Blueprint from the user's idea. Preserve stated genre, camera, visual style, scale and mode. Return JSON only with title,elevatorPitch,genre,visualStyle,scale,camera,playerMode,networking,story,world,systems,qa,buildTargets. story: premise,chapters,keyQuests,characters,endings. world: locations,resources,events. Make it coherent and production-ready. Do not copy protected franchises.`;
app.get('/api/health',(_,res)=>res.json({ok:true,service:'AI Game Studio 4.5',aiConfigured:Boolean(client),webStudio:'4.5'}));
app.post('/api/session',async(req,res)=>{const d=await read();const requested=String(req.body?.userId||'').trim();const id=requested||makeId('USER');let u=d.users.find(x=>x.userId===id);if(!u){u={userId:id,createdAt:new Date().toISOString(),name:String(req.body?.name||'Game Creator').slice(0,80)};d.users.push(u);await write(d)}res.json({user:u})});
app.get('/api/projects',requireUser,async(req,res)=>{const d=await read();res.json({projects:d.projects.filter(p=>p.userId===req.studioUser).sort((a,b)=>String(b.updatedAt||b.createdAt).localeCompare(String(a.updatedAt||a.createdAt)))})});
app.post('/api/projects',requireUser,async(req,res)=>{const idea=String(req.body?.idea||'').trim();if(!idea)return res.status(400).json({error:'idea is required'});const d=await read();const p={projectId:makeId('PROJECT'),userId:req.studioUser,version:'4.5.0',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),status:'created',idea,blueprint:null,builds:[]};d.projects.push(p);await write(d);res.status(201).json({project:p})});
app.get('/api/projects/:id',requireUser,async(req,res)=>{const d=await read();const p=d.projects.find(x=>x.projectId===req.params.id&&x.userId===req.studioUser);if(!p)return res.status(404).json({error:'project not found'});res.json(p)});
app.post('/api/projects/:id/generate',requireUser,async(req,res)=>{const d=await read();const p=d.projects.find(x=>x.projectId===req.params.id&&x.userId===req.studioUser);if(!p)return res.status(404).json({error:'project not found'});let bp=fallback(p.idea,p.projectId),ai=false;if(client){try{const r=await client.responses.create({model:process.env.AI_MODEL||'gpt-5.6-sol',instructions:SYSTEM,input:p.idea});bp={...bp,...JSON.parse(r.output_text||'{}')};ai=true}catch(e){p.lastError='AI generation failed; fallback blueprint used'}}bp.projectId=p.projectId;bp.version='4.5.0';p.blueprint=bp;p.status='blueprint_ready';p.updatedAt=new Date().toISOString();await write(d);res.json({project:p,ai})});
app.post('/api/projects/:id/build',requireUser,async(req,res)=>{const d=await read();const p=d.projects.find(x=>x.projectId===req.params.id&&x.userId===req.studioUser);if(!p)return res.status(404).json({error:'project not found'});try{const job=await createBuildJob({projectId:p.projectId,idea:p.idea,blueprint:p.blueprint});p.status=job.status==='completed'?'build_ready':'build_failed';p.updatedAt=new Date().toISOString();p.builds=[...(p.builds||[]),{buildId:job.buildId,createdAt:job.createdAt,status:job.status}];await write(d);res.status(202).json(job)}catch(e){res.status(500).json({error:e.message})}});
app.get('/api/builds/:id',requireUser,async(req,res)=>{const d=await read();const owned=d.projects.some(p=>p.userId===req.studioUser&&(p.builds||[]).some(b=>b.buildId===req.params.id));if(!owned)return res.status(404).json({error:'build not found'});const j=getBuildJob(req.params.id);if(!j)return res.status(410).json({error:'build job is no longer in this server process'});res.json(j)});
app.use(express.static(WEB));app.use((req,res)=>res.sendFile(path.join(WEB,'index.html')));
const PORT=Number(process.env.PORT||8787);app.listen(PORT,()=>console.log(`AI Game Studio 4.5: http://localhost:${PORT}`));
