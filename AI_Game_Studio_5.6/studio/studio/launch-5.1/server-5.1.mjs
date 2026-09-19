import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
const app=express(); app.use(express.json());
const root=path.resolve(process.cwd());
const dbFile=path.join(root,'studio','launch-5.1','launch-projects.json');
function read(){try{return JSON.parse(fs.readFileSync(dbFile,'utf8'))}catch{return []}}
function write(x){fs.writeFileSync(dbFile,JSON.stringify(x,null,2))}
app.get('/health',(req,res)=>res.json({ok:true,version:'5.1'}));
app.use('/',express.static(path.join(root,'studio','web-5.1')));
app.post('/api/launch/projects',(req,res)=>{const idea=String(req.body?.idea||'').trim();if(!idea)return res.status(400).json({error:'idea required'});const p={projectId:'PROJECT-'+crypto.randomBytes(4).toString('hex').toUpperCase(),idea,status:'CREATED',createdAt:new Date().toISOString()};const all=read();all.push(p);write(all);res.json(p)});
app.listen(process.env.PORT||8080,'0.0.0.0',()=>console.log('AI Game Studio 5.1 listening'));
