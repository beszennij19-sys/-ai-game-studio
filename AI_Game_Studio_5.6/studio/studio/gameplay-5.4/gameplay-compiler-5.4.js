export function compileGameplay(blueprint){
  const text=JSON.stringify(blueprint||{}).toLowerCase();
  const has=(...w)=>w.some(x=>text.includes(x));
  const mechanics={
    movement:true, interaction:true, inventory:has('inventory','инвентар'),
    combat:has('combat','бой','weapon','оруж'), enemies:has('enemy','enemies','враг','существ'),
    resources:has('resource','ресурс','собирать'), crafting:has('craft','крафт'),
    building:has('build','строитель','база','убежищ'), dialogue:has('dialog','диалог','npc','персонаж'),
    hunger:has('hunger','голод'), thirst:has('thirst','жажд'), cold:has('cold','холод'),
    vehicle:has('vehicle','транспорт','машин'), quests:has('quest','квест','задан')
  };
  return {version:'5.4', mechanics, rules:[...Object.entries(mechanics).filter(([,v])=>v).map(([k])=>({type:k,enabled:true}))], source:'Blueprint'};
}
