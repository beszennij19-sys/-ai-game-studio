import fs from 'node:fs';
import path from 'node:path';

const has=(systems, ...keys)=>systems.some(s=>keys.some(k=>String(s).toLowerCase().includes(k)));
export function compileGameplay(bp={}){
 const systems=Array.isArray(bp.systems)?bp.systems:[];
 const genre=String(bp.genre||'adventure').toLowerCase();
 const camera=String(bp.camera||'third-person').toLowerCase();
 const story=bp.story||{}, world=bp.world||{};
 const locations=Array.isArray(world.locations)?world.locations:[];
 const quests=Array.isArray(story.keyQuests)?story.keyQuests:[];
 const characters=Array.isArray(story.characters)?story.characters:[];
 const resources=Array.isArray(world.resources)?world.resources:[];
 const features={
  movement:has(systems,'movement')||true,
  camera:has(systems,'camera')||true,
  health:has(systems,'health','damage','combat')||['survival','shooter','rpg','action'].some(x=>genre.includes(x)),
  combat:has(systems,'combat','weapon','shoot','attack')||['shooter','action','survival','rpg'].some(x=>genre.includes(x)),
  inventory:has(systems,'inventory','item','loot'),
  crafting:has(systems,'craft'),
  building:has(systems,'build','base'),
  quests:has(systems,'quest')||quests.length>0,
  dialogue:has(systems,'dialogue')||characters.length>0,
  vehicles:has(systems,'vehicle','car','transport')||genre.includes('racing'),
  stealth:has(systems,'stealth'),
  save:has(systems,'save'),
  mobileControls:has(systems,'mobile'),
  enemies:has(systems,'enemy','npc','combat')||['shooter','survival','rpg','action'].some(x=>genre.includes(x))
 };
 const enemies=features.enemies?Math.max(2,Math.min(12,characters.length||4)):0;
 const pickups=features.inventory?Math.max(3,Math.min(16,resources.length*2||6)):0;
 return {version:'4.9.0',projectId:bp.projectId||null,genre,camera,features,world:{locations,resources,events:Array.isArray(world.events)?world.events:[]},story:{quests,characters,endings:story.endings||[]},spawn:{enemies,pickups,npcs:characters.length,locations:Math.max(1,locations.length)},controls:{mobile:features.mobileControls,desktop:true},rules:{enemyChase:true,damageOnContact:features.combat,interactReward:true,questProgress:true,crafting:features.crafting,building:features.building,vehicleMode:features.vehicles}};
}
export function compileFile(input,output){const bp=JSON.parse(fs.readFileSync(input,'utf8'));const out=compileGameplay(bp);fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(out,null,2));return out;}
if(process.argv[1]&&process.argv[1].endsWith('compile-gameplay-4.9.js')){const input=process.argv[2]||'../../data/Blueprint.json';const output=process.argv[3]||'../../data/gameplay-4.9/GameplayRuntime.json';compileFile(path.resolve(path.dirname(import.meta.url.replace('file://','')),input),path.resolve(path.dirname(import.meta.url.replace('file://','')),output));console.log('4.9 gameplay compiled');}
