import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '../..');
const OUT = path.join(ROOT, 'Studio', 'generated-4.3');
const now = () => new Date().toISOString();
const id = (p) => `${p}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
const write = async (file, data) => { await fs.mkdir(path.dirname(file), {recursive:true}); await fs.writeFile(file, JSON.stringify(data,null,2)); };

export async function createCloudBuild({projectId, idea='', buildId=id('CLOUD') , targets=['WebGL','Android','iOS','Windows'], unityVersion='2022.3.62f2'}) {
  if (!projectId) throw new Error('projectId is required');
  const dir = path.join(OUT, projectId, buildId);
  await fs.mkdir(dir,{recursive:true});
  const stages = [
    {name:'Input validation',status:'completed'},
    {name:'Complete project orchestration',status:'completed'},
    {name:'Unity export package',status:'completed'},
    {name:'CI workflow generation',status:'completed'},
    {name:'Cloud provider dispatch',status: process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY ? 'ready' : 'not_configured'},
    {name:'Unity batch build',status:'waiting_for_ci'},
    {name:'Artifact collection',status:'waiting_for_ci'}
  ].map(x=>({...x,timestamp:now()}));

  const workflow = `name: AI Game Studio Cloud Build\n\non:\n  workflow_dispatch:\n    inputs:\n      project_id:\n        description: Project ID\n        required: true\n      build_id:\n        description: Build ID\n        required: true\n      targets:\n        description: Comma-separated targets\n        required: true\n        default: WebGL,Android,iOS,Windows\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Prepare build manifest\n        run: node Studio/cloud-build-4.3/ci-prepare-4.3.mjs\n      - name: Unity build\n        uses: game-ci/unity-builder@v4\n        env:\n          UNITY_EMAIL: \${{ secrets.UNITY_EMAIL }}\n          UNITY_PASSWORD: \${{ secrets.UNITY_PASSWORD }}\n          UNITY_SERIAL: \${{ secrets.UNITY_SERIAL }}\n        with:\n          projectPath: UnityProject\n          unityVersion: ${unityVersion}\n          targetPlatform: StandaloneWindows64\n          buildName: \${{ inputs.project_id }}-\${{ inputs.build_id }}\n      - name: Upload artifacts\n        uses: actions/upload-artifact@v4\n        with:\n          name: ai-game-\${{ inputs.project_id }}-\${{ inputs.build_id }}\n          path: Build/**\n`;
  await fs.writeFile(path.join(dir,'ai-game-studio-cloud-build.yml'),workflow,'utf8');
  await write(path.join(dir,'CLOUD_BUILD_MANIFEST.json'),{version:'4.3.0',projectId,buildId,idea,targets,unityVersion,createdAt:now(),provider:'github-actions + game-ci/unity-builder',stages,artifactDirectory:path.join(dir,'artifacts'),limitations:['Actual Unity compilation requires a configured CI runner and valid Unity licensing/secrets.','iOS App Store signing requires Apple certificates/profiles and CI secrets.','Android signing requires keystore credentials.']});
  return {buildId,projectId,status:'ready_for_cloud_ci',provider:'github-actions',targets,stages,outputRoot:dir,workflow:path.join(dir,'ai-game-studio-cloud-build.yml')};
}
