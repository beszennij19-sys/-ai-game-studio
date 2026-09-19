import OpenAI from 'openai';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

const Character = z.object({name:z.string(),role:z.string(),description:z.string()});
const Blueprint = z.object({
  title:z.string(), elevatorPitch:z.string(), genre:z.string(), visualStyle:z.string(), scale:z.string(), camera:z.string(), playerMode:z.string(), networking:z.string(),
  story:z.object({premise:z.string(),chapters:z.array(z.string()),keyQuests:z.array(z.string()),consequences:z.array(z.string()),characters:z.array(Character),endings:z.array(z.string())}),
  world:z.object({locations:z.array(z.string()),resources:z.array(z.string()),events:z.array(z.string())}),
  systems:z.array(z.string()), qa:z.array(z.string()), buildTargets:z.array(z.string())
});

const SYSTEM = `You are AI Game Director for AI Game Studio. Turn the user's game idea into a coherent production Blueprint. Preserve the requested genre, perspective, player mode and fantasy. Create original content; do not copy protected characters, names, worlds, or text from existing games. Make mechanics, story, world and progression internally consistent. Prefer concrete game systems over vague marketing language. Return only the requested structured object.`;

export async function generateBlueprint(idea,{model=process.env.AI_MODEL||'gpt-5.6-sol'}={}) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured');
  const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const response = await client.responses.parse({model,input:[{role:'system',content:SYSTEM},{role:'user',content:idea}],text:{format:zodTextFormat(Blueprint,'game_blueprint')}});
  if (!response.output_parsed) throw new Error('AI returned no structured Blueprint');
  return response.output_parsed;
}

export { Blueprint };
