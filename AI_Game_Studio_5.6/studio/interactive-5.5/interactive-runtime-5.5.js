export class InteractiveGameRuntime55 {
  constructor(compiled={}) {
    this.rules=compiled.rules||compiled;
    this.state={hp:100,maxHp:100,coins:0,hunger:100,cold:0,inventory:[],quests:{},worldFlags:{},enemies:[],player:{x:0,y:0,z:0}};
    this.log=[];
  }
  emit(type,payload={}){this.log.push({type,payload,t:Date.now()}); return {type,payload};}
  damage(amount){this.state.hp=Math.max(0,this.state.hp-amount); this.emit('damage',{amount,hp:this.state.hp}); if(this.state.hp===0)this.emit('player_dead');}
  heal(amount){this.state.hp=Math.min(this.state.maxHp,this.state.hp+amount); this.emit('heal',{amount,hp:this.state.hp});}
  collect(item){if(!item)return; this.state.inventory.push(item); this.emit('item_collected',{item});}
  spend(cost){if(this.state.coins<cost)return false; this.state.coins-=cost; this.emit('coins_spent',{cost}); return true;}
  addCoins(amount){this.state.coins+=Math.max(0,amount); this.emit('coins_added',{amount,coins:this.state.coins});}
  tick(dt){if(this.rules.hunger?.enabled)this.state.hunger=Math.max(0,this.state.hunger-(this.rules.hunger.drainPerSecond||0)*dt); if(this.rules.cold?.enabled)this.state.cold=Math.min(100,this.state.cold+(this.rules.cold.gainPerSecond||0)*dt);}
  attack(target){if(!target||target.dead)return false; const d=this.rules.combat?.damage||10; target.hp=Math.max(0,(target.hp??100)-d); this.emit('attack',{target:target.id,damage:d}); if(target.hp===0){target.dead=true;this.addCoins(target.reward||0);this.collect(target.loot);this.emit('enemy_defeated',{target:target.id});} return true;}
  startQuest(id){this.state.quests[id]={progress:0,completed:false};this.emit('quest_started',{id});}
  progressQuest(id,amount=1){const q=this.state.quests[id]||{progress:0,completed:false};q.progress+=amount;this.state.quests[id]=q;this.emit('quest_progress',{id,progress:q.progress});}
  snapshot(){return structuredClone(this.state);}
  load(s){if(!s||!s.state)return false;this.state=structuredClone(s.state);this.emit('save_loaded');return true;}
}
