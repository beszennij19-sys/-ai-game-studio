const base = process.env.STUDIO_URL || 'http://127.0.0.1:8787';
const checks = ['/api/health','/api/ready'];
for (const path of checks) {
  const r = await fetch(base + path);
  const body = await r.text();
  console.log(path, r.status, body.slice(0,300));
  if (!r.ok) process.exit(1);
}
console.log('SMOKE TEST OK');
