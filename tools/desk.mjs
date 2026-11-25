import { createRequire } from 'node:module';
const { chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright');
import { spawn } from 'node:child_process';
const pages = (process.argv[2] || '/').split(',');
const sizes = [[1280,720],[1366,768],[1536,864],[1920,1080],[2560,1440]];
const srv = spawn('npx', ['astro', 'preview', '--port', '4335'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const b = await chromium.launch();
for (const path of pages) for (const [w,h] of sizes) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:4335' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1600);
  const name = (path === '/' ? 'home' : path.slice(1)) + '-' + w;
  await p.screenshot({ path: 'shots/d-' + name + '.png' });
  if (process.argv[3] === 'full') { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 50)); } scrollTo({ top: 0, behavior: 'instant' }); }); await p.waitForTimeout(2000); await p.screenshot({ path: 'shots/df-' + name + '.png', fullPage: true }); }
  await p.close();
}
await b.close(); srv.kill(); console.log('ok');
