import { createReleasePlan, validateReleasePlan } from './integration-5.7.js';
export function buildReleasePlan(projectId, description) {
  const plan = createReleasePlan(projectId, description);
  if (!validateReleasePlan(plan)) throw new Error('Invalid 5.7 release plan');
  return plan;
}
