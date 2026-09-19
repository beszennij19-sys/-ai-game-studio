#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || path.resolve(process.cwd());
const data = path.join(root,'Studio','data');
const assets = path.join(data,'assets');
const read = f => JSON.parse(fs.readFileSync(path.join(data,f),'utf8'));
const bp = read('Blueprint.json');
const manifestPath = path.join(assets,'AssetManifest.json');
const manifest = fs.existsSync(manifestPath) ? read('assets/AssetManifest.json') : {version:'3.4.0',jobs:[]};
manifest.version='3.4.0';
manifest.projectId=bp.projectId;
manifest.status='ready_for_real_generation';
manifest.providers={...(manifest.providers||{}),image:{provider:'openai',model:process.env.IMAGE_MODEL||'gpt-image-2',enabled:'server-side API key required'},model3d:{provider:null,status:'adapter_only'},audio:{provider:null,status:'adapter_only'},vfx:{provider:null,status:'adapter_only'}};
for (const j of manifest.jobs||[]) { if (j.category==='art'||j.category==='ui') j.generationProvider='openai:gpt-image-2'; }
fs.mkdirSync(assets,{recursive:true});
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(assets,'GENERATION_README.txt'),`3.4 real generation enabled for image/UI jobs.\nProject: ${bp.projectId}\nServer endpoint: POST /api/assets/${bp.projectId}/generate-image\n`);
console.log(`Prepared ${manifest.jobs?.length||0} jobs for real image generation for ${bp.projectId}`);
