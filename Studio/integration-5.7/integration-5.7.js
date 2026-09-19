export const PIPELINE_57 = Object.freeze([
  'project','blueprint','gameplay','world','characters','quests','assets','runtime','director','preview','unity','build'
]);

export function createReleasePlan(projectId, description) {
  if (!projectId) throw new Error('projectId is required');
  return { version:'5.7', projectId, description: description || '', stages: PIPELINE_57.map((stage,i)=>({stage,index:i,status:'pending'})) };
}

export function validateReleasePlan(plan) {
  return !!plan && plan.version === '5.7' && Array.isArray(plan.stages) &&
    PIPELINE_57.every((name,i)=>plan.stages[i]?.stage === name);
}
