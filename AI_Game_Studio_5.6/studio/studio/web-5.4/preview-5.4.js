import {compileGameplay} from '../gameplay-5.4/gameplay-compiler-5.4.js';
export function createPreviewState(blueprint){ return {blueprint, gameplay:compileGameplay(blueprint), player:{health:100,inventory:[],position:{x:0,y:0,z:0}}, events:[]}; }
