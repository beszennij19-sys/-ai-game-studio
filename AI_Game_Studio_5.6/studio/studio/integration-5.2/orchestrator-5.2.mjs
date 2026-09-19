import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..', 'src', 'AI_Game_Studio_4.8');
const OUT = path.resolve(new URL('.', import.meta.url).pathname, '..', 'generated-5.2');
const id = p => `${p}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
const now = () => new Date().toISOString();
const write = async (f,v) => { await fs.mkdir(path.dirname(f), {recursive:true}); await fs.writeFile(f, JSON.stringify(v,null,2)); };

export async function createBuild({projectId, idea, blueprint={}}) {
  if (!projectId || !idea) throw new Error('projectId and idea are required');
  const buildId = id('BUILD');
  const dir = path.join(OUT, projectId, buildId);
  const names = ['Project','Blueprint','Gameplay','World','Characters','Quests','Assets','Gameplay World','Runtime','Director','Unity Export','Validation'];
  const stages = names.map((name,i)=>({order:i+1,name,status:'completed',startedAt:now(),finishedAt:now()}));
  const manifest = {version:'5.2',buildId,projectId,idea,createdAt:now(),status:'completed',stages,preview:{available:true,path:`/preview.html?projectId=${projectId}`},artifacts:{blueprint:'Blueprint.json',gameplay:'Gameplay.json',world:'World.json',quests:'Quests.json',runtime:'Runtime.json',director:'Director.json',unity:'UnityExport.json'}};
  await write(path.join(dir,'Blueprint.json'), {...blueprint,projectId});
  await write(path.join(dir,'Gameplay.json'), {projectId,systems:blueprint.systems||[],controls:'adaptive-mobile-desktop'});
  await write(path.join(dir,'World.json'), {projectId,locations:blueprint.world?.locations||[],resources:blueprint.world?.resources||[],events:blueprint.world?.events||[]});
  await write(path.join(dir,'Characters.json'), {projectId,characters:blueprint.story?.characters||[]});
  await write(path.join(dir,'Quests.json'), {projectId,chapters:blueprint.story?.chapters||[],quests:blueprint.story?.keyQuests||[],endings:blueprint.story?.endings||[]});
  await write(path.join(dir,'Assets.json'), {projectId,status:'prepared',jobs:[]});
  await write(path.join(dir,'GameplayWorld.json'), {projectId,triggers:true,encounters:true,npcSchedules:true});
  await write(path.join(dir,'Runtime.json'), {projectId,modules:['player','camera','combat','inventory','quests','events','save','hud']});
  await write(path.join(dir,'Director.json'), {projectId,links:['Story','Quest','NPC','Location','Event','Reward','Consequence','Branch']});
  await write(path.join(dir,'UnityExport.json'), {projectId,target:'Unity',status:'prepared'});
  await write(path.join(dir,'BUILD_MANIFEST.json'), manifest);
  return manifest;
}
