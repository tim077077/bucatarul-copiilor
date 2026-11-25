import { createRequire } from 'node:module';
import fs from 'node:fs';
const { chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright');
import { spawn } from 'node:child_process';
const axe = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const srv = spawn('npx', ['astro', 'preview', '--port', '4332'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const b = await chromium.launch();
let total = 0;
for (const path of ['/', '/catering-gradinite', '/evenimente', '/meniu', '/despre', '/contact', '/confidentialitate', '/404']) {
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    await p.goto('http://localhost:4332' + path, { waitUntil: 'networkidle' });
    await p.addScriptTag({ content: axe });
    const res = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0,2).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary||'').split('\n')[1]) })));
    if (res.length) { console.log(path, w, JSON.stringify(res, null, 1)); total += res.length; }
    await p.close();
  }
}
console.log('violations:', total);
await b.close(); srv.kill();
