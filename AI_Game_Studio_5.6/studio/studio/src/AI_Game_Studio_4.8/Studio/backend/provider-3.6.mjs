import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT_DIR = path.resolve('../..');
const generatedRoot = path.join(ROOT_DIR, 'Studio', 'generated-assets');
const meshApi = 'https://api.meshy.ai';

function token(prefix='JOB') { return `${prefix}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`; }
function safe(v='asset') { return String(v).replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,80)||'asset'; }
function headers() { return { Authorization: `Bearer ${process.env.MESHY_API_KEY}`, 'Content-Type':'application/json' }; }
function requireKey() { if (!process.env.MESHY_API_KEY) throw new Error('MESHY_API_KEY is not configured'); }

export async function createMeshyText3D({projectId, name, prompt, format='glb', texture=true}) {
  requireKey();
  const r = await fetch(`${meshApi}/openapi/v2/text-to-3d`, { method:'POST', headers:headers(), body:JSON.stringify({
    mode:'preview', prompt, ai_model:process.env.MESHY_MODEL || 'latest', target_formats:[format],
    moderation:true
  })});
  const data = await r.json();
  if (!r.ok) throw new Error(data?.message || data?.error || `Meshy create failed (${r.status})`);
  return { provider:'meshy', providerTaskId:data.result, projectId, jobId:token('ASSET36'), name, type:'3d_model', stage:'preview', format, textureRequested:Boolean(texture), status:'queued' };
}

export async function refineMeshyText3D({providerTaskId, format='glb', texturePrompt, enablePbr=true}) {
  requireKey();
  const body={ mode:'refine', preview_task_id:providerTaskId, ai_model:process.env.MESHY_MODEL || 'latest', target_formats:[format], enable_pbr:enablePbr, texture_resolution:process.env.MESHY_TEXTURE_RESOLUTION || '2k' };
  if (texturePrompt) body.texture_prompt=texturePrompt;
  const r=await fetch(`${meshApi}/openapi/v2/text-to-3d`,{method:'POST',headers:headers(),body:JSON.stringify(body)});
  const data=await r.json();
  if(!r.ok) throw new Error(data?.message || data?.error || `Meshy refine failed (${r.status})`);
  return {providerTaskId:data.result,status:'queued',stage:'refine'};
}

export async function getMeshyText3D(taskId) {
  requireKey();
  const r=await fetch(`${meshApi}/openapi/v2/text-to-3d/${encodeURIComponent(taskId)}`,{headers:{Authorization:`Bearer ${process.env.MESHY_API_KEY}`}});
  const data=await r.json();
  if(!r.ok) throw new Error(data?.message || data?.error || `Meshy status failed (${r.status})`);
  return data;
}

export async function createMeshyImage3D({projectId,name,imageUrl,format='glb'}) {
  requireKey();
  const r=await fetch(`${meshApi}/openapi/v1/image-to-3d`,{method:'POST',headers:headers(),body:JSON.stringify({image_url:imageUrl,model_type:'standard',ai_model:process.env.MESHY_MODEL || 'latest',should_texture:true,enable_pbr:true,target_formats:[format],moderation:true})});
  const data=await r.json();
  if(!r.ok) throw new Error(data?.message || data?.error || `Meshy image-to-3D failed (${r.status})`);
  return {provider:'meshy',providerTaskId:data.result,projectId,jobId:token('ASSET36'),name,type:'3d_model',stage:'image_to_3d',format,status:'queued'};
}

export async function getMeshyImage3D(taskId) {
  requireKey();
  const r=await fetch(`${meshApi}/openapi/v1/image-to-3d/${encodeURIComponent(taskId)}`,{headers:{Authorization:`Bearer ${process.env.MESHY_API_KEY}`}});
  const data=await r.json();
  if(!r.ok) throw new Error(data?.message || data?.error || `Meshy image status failed (${r.status})`);
  return data;
}

export async function downloadGenerated({projectId,jobId,name,type,format,url}) {
  if(!url) throw new Error('provider did not return a model URL');
  const dir=path.join(generatedRoot,safe(projectId),safe(type));
  await fs.mkdir(dir,{recursive:true});
  const ext=String(format||'glb').replace(/[^a-z0-9]/gi,'') || 'glb';
  const file=`${safe(jobId)}_${safe(name)}.${ext}`;
  const abs=path.join(dir,file);
  const r=await fetch(url);
  if(!r.ok) throw new Error(`asset download failed (${r.status})`);
  const buf=Buffer.from(await r.arrayBuffer());
  await fs.writeFile(abs,buf);
  return {file,absolutePath:abs,relativePath:path.relative(ROOT_DIR,abs).replaceAll(path.sep,'/'),bytes:buf.length};
}
