import { createRequire } from 'node:module';
const { chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright');
import { spawn } from 'node:child_process';
const srv = { kill() {} };
await new Promise((r) => setTimeout(r, 2500));
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [1920, 1080]]) for (const [path, name] of [['/meniu', 'og'], ['/preview/meniu-5-zile', 'week']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto('http://localhost:4350' + path + '.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  const box = await p.locator('.mhero').boundingBox();
  await p.screenshot({ path: 'shots/cmp-' + name + '-' + w + '.png', fullPage: true, clip: { x: 0, y: 0, width: w, height: Math.min(box.y + box.height, 1500) } });
  await p.close();
}
await b.close(); srv.kill(); console.log('ok');
