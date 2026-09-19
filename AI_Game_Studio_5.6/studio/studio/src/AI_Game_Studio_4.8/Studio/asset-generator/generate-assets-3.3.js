#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || path.resolve(process.cwd());
const data = path.join(root, 'Studio', 'data');
const out = path.join(data, 'assets');
fs.mkdirSync(out, { recursive: true });
const read = f => JSON.parse(fs.readFileSync(path.join(data, f), 'utf8'));
const bp = read('Blueprint.json');
const world = read('World.json');
const npcs = read('NPCs.json');
const ui = read('UIDesign.json');
const projectId = bp.projectId || `PROJECT-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
const safe = s => String(s||'item').toLowerCase().replace(/[^a-z0-9а-яё_-]+/gi,'_').replace(/^_+|_+$/g,'').slice(0,60);
const jobs=[];
function add(type,name,category,prompt,outputs,source){ jobs.push({jobId:`ASSET-${String(jobs.length+1).padStart(4,'0')}`,projectId,type,name,category,status:'spec_ready',generationProvider:null,prompt,outputs,source}); }
add('key_art', bp.title || 'Game Key Art','art',`Create original key art for a ${bp.genre||'game'} with ${bp.visualStyle||'coherent visual'} style. Title: ${bp.title||'Untitled Game'}. No protected characters, logos, or copied franchise elements.`,['PNG 1600x900'], 'Blueprint');
add('player_character', 'Player Character','characters',`Create an original playable character for ${bp.title||'the game'} in ${bp.visualStyle||'the specified style'}. Silhouette must read clearly on mobile, with neutral, walk, run, interaction and combat-ready poses as applicable.`,['GLB/FBX','PBR textures','idle/walk/run animations'], 'Blueprint');
for (const x of (world.locations||[])) add('environment','Location '+(x.name||'Location'),'environment',`Create a modular environment for location "${x.name||'Location'}". Genre: ${bp.genre||''}. Visual style: ${bp.visualStyle||''}. Include mobile-friendly optimized geometry, collision-ready props and coherent materials.`,['GLB/FBX','PBR materials','LOD variants'], 'World');
for (const x of (world.resources||[])) add('prop',x.name||'Resource Prop','props',`Create an original game prop representing "${x.name||'resource'}", readable at gameplay camera distance, with a simple pickup-ready presentation.`,['GLB/FBX','PBR textures'], 'World');
for (const x of (npcs.npcs||[])) add('npc',x.name||'NPC','characters',`Create an original NPC named "${x.name||'NPC'}" with role "${x.role||'NPC'}". Match ${bp.visualStyle||''}. Provide idle, walk and role-specific animation set.`,['GLB/FBX','PBR textures','animations'], 'NPCs');
const controls=(ui.profiles||ui.profilesByGenre||{});
for (const p of Object.keys(controls)) add('ui_profile',`${p} HUD`,'ui',`Create a cohesive mobile-first HUD for the ${p} profile. Large touch targets, safe-area support, readable typography, scalable icons.`,['SVG/PNG icons','9-slice panels','layout spec'], 'UIDesign');
add('audio_pack','Core Audio Pack','audio',`Create original audio direction and assets for ${bp.title||'the game'}: UI taps, interaction, pickup, quest complete, damage, ambience and adaptive background music.`,['WAV/OGG audio set','loop metadata'], 'Blueprint');
add('vfx_pack','Core VFX Pack','vfx',`Create original VFX specifications for ${bp.title||'the game'}: interaction feedback, pickup, quest completion, damage and environment effects appropriate to ${bp.visualStyle||''}.`,['VFX graph/specs','flipbooks/textures'], 'Blueprint');
const manifest={version:'3.3.0',projectId,title:bp.title||'Untitled Game',status:'spec_ready',generatedAt:new Date().toISOString(),providers:{image:null,model3d:null,audio:null,vfx:null},jobs,folders:{root:`Assets/AIStudio/Generated/${projectId}`,art:`Assets/AIStudio/Generated/${projectId}/Art`,characters:`Assets/AIStudio/Generated/${projectId}/Characters`,environment:`Assets/AIStudio/Generated/${projectId}/Environment`,props:`Assets/AIStudio/Generated/${projectId}/Props`,ui:`Assets/AIStudio/Generated/${projectId}/UI`,audio:`Assets/AIStudio/Generated/${projectId}/Audio`,vfx:`Assets/AIStudio/Generated/${projectId}/VFX`}};
fs.writeFileSync(path.join(out,'AssetManifest.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(out,'AssetJobs.json'),JSON.stringify(jobs,null,2));
console.log(`Generated ${jobs.length} asset jobs for ${projectId}`);
