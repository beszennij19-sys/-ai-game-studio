import 'dotenv/config';
import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { createBuild } from '../integration-5.2/orchestrator-5.2.mjs';
import { generateBlueprint } from '../ai-5.3/blueprint-5.3.mjs';

const app=express(); app.use(express.json({limit:'1mb'}));
const root=path.resolve(new URL('.', import.meta.url).pathname, '..');
const dbFile=path.join(root,'launch-5.2','projects.json');
const read=()=>{try{return JSON.parse(fs.readFileSync(dbFile,'utf8'))}catch{return []}};
const write=x=>{fs.mkdirSync(path.dirname(dbFile),{recursive:true});fs.writeFileSync(dbFile,JSON.stringify(x,null,2))};
app.get('/health',(req,res)=>res.json({ok:true,version:'5.3',ai:Boolean(process.env.OPENAI_API_KEY)}));
app.use('/',express.static(path.join(root,'web-5.2')));
app.post('/api/projects',(req,res)=>{const idea=String(req.body?.idea||'').trim();if(!idea)return res.status(400).json({error:'idea required'});const p={projectId:'PROJECT-'+crypto.randomBytes(4).toString('hex').toUpperCase(),idea,status:'CREATED',createdAt:new Date().toISOString()};const all=read();all.push(p);write(all);res.json(p)});
app.get('/api/projects',(req,res)=>res.json(read()));
app.post('/api/projects/:id/blueprint',async(req,res)=>{const all=read();const p=all.find(x=>x.projectId===req.params.id);if(!p)return res.status(404).json({error:'project not found'});try{p.status='GENERATING_BLUEPRINT';write(all);const blueprint=await generateBlueprint(p.idea);p.blueprint=blueprint;p.status='BLUEPRINT_READY';write(all);res.json({projectId:p.projectId,blueprint})}catch(e){p.status='BLUEPRINT_FAILED';write(all);res.status(500).json({error:String(e?.message||e)})}});
app.post('/api/projects/:id/build',async(req,res)=>{const all=read();const p=all.find(x=>x.projectId===req.params.id);if(!p)return res.status(404).json({error:'project not found'});try{p.status='BUILDING';write(all);let blueprint=req.body?.blueprint||p.blueprint;if(!blueprint){blueprint=await generateBlueprint(p.idea);p.blueprint=blueprint;}const result=await createBuild({projectId:p.projectId,idea:p.idea,blueprint});p.status='READY';p.lastBuild=result.buildId;p.preview=result.preview;write(all);res.json({...result,blueprint})}catch(e){p.status='FAILED';write(all);res.status(500).json({error:String(e?.message||e)})}});
app.listen(process.env.PORT||8080,'0.0.0.0',()=>console.log('AI Game Studio 5.3 listening'));

// 5.4 gameplay compiler endpoint
import { compileGameplay as compileGameplay54 } from '../gameplay-5.4/gameplay-compiler-5.4.js';
app.post('/api/projects/:id/gameplay/compile', (req,res)=>{ const blueprint=req.body?.blueprint||{}; res.json({projectId:req.params.id, gameplay:compileGameplay54(blueprint)}); });
