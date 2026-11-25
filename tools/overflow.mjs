import { createRequire } from 'node:module';
const { chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright');
import { spawn } from 'node:child_process';
const srv = spawn('npx', ['astro', 'preview', '--port', '4330'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const b = await chromium.launch();
for (const path of ['/', '/catering-gradinite', '/evenimente', '/meniu', '/despre', '/contact', '/confidentialitate']) {
  for (const w of [390, 768, 1024]) {
    const p = await b.newPage({ viewport: { width: w, height: 844 } });
    await p.goto('http://localhost:4330' + path, { waitUntil: 'networkidle' });
    const r = await p.evaluate((w) => {
      const out = [];
      document.querySelectorAll('body *').forEach((el) => { const rc = el.getBoundingClientRect(); if (rc.right > w + 1 && rc.width > 0) out.push(el.tagName + '.' + [...el.classList].join('.') + ' ' + Math.round(rc.right)); });
      return [document.documentElement.scrollWidth, out.slice(0, 6)];
    }, w);
    if (r[0] > w || r[1].length) console.log(path, w, JSON.stringify(r));
    await p.close();
  }
}
await b.close(); srv.kill();
