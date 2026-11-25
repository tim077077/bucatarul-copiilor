import { createRequire } from 'node:module';
const { chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright');
import { spawn } from 'node:child_process';
const srv = spawn('npx', ['astro', 'preview', '--port', '4361'], { stdio: 'ignore', detached: true });
await new Promise((r) => setTimeout(r, 2500));
const b = await chromium.launch();
try {
  for (const [sel, name] of [['.who', 'who'], ['.why', 'why'], ['.alg', 'alg']]) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto('http://localhost:4361/', { waitUntil: 'networkidle' });
    const y = await p.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY - 160, sel);
    await p.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), y);
    for (const t of [120, 280, 1600]) { await p.waitForTimeout(t === 120 ? 120 : t - (t === 280 ? 120 : 280)); await p.screenshot({ path: 'shots/rv-' + name + '-' + t + '.png' }); }
    await p.close();
  }
} finally { await b.close(); process.kill(-srv.pid); }
console.log('ok');
