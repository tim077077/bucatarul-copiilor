import { createRequire } from 'node:module';
const { chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright');
import { spawn } from 'node:child_process';
const srv = spawn('npx', ['astro', 'preview', '--port', '4360'], { stdio: 'ignore', detached: true });
await new Promise((r) => setTimeout(r, 2500));
const b = await chromium.launch();
try {
  for (const path of ['/', '/catering-gradinite', '/evenimente', '/meniu', '/despre']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto('http://localhost:4360' + path, { waitUntil: 'networkidle' });
    const armedAtLoad = await p.evaluate(() => [...document.querySelectorAll('[data-reveal]')].map(e => (e.getBoundingClientRect().top < innerHeight ? 'VISIBLE-' : '') + (e.classList.contains('is-armed') ? 'armed' : 'free')));
    const total = armedAtLoad.length, badFlash = armedAtLoad.filter(x => x === 'VISIBLE-armed').length;
    let seen = new Set();
    await p.evaluate(() => window.__on = new Set());
    await p.evaluate(() => new MutationObserver(m => m.forEach(r => { if (r.target.classList?.contains('is-on')) window.__on.add(r.target.dataset.reveal + ':' + (r.target.className.split(' ')[0] || r.target.tagName)); })).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] }));
    for (let y = 0; y < 9000; y += 300) { await p.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), y); await p.waitForTimeout(80); }
    await p.waitForTimeout(2300);
    const fired = await p.evaluate(() => [...window.__on]);
    const stillHidden = await p.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter(e => e.classList.contains('is-armed')).length);
    console.log(path, '| reveals:', total, '| armed while on first screen:', badFlash, '| played:', fired.length, '| left hidden after scroll:', stillHidden);
    await p.close();
  }
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await p.goto('http://localhost:4360/', { waitUntil: 'networkidle' });
  console.log('reduced motion -> armed elements:', await p.evaluate(() => document.querySelectorAll('.is-armed').length));
  const nj = await b.newPage({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  await nj.goto('http://localhost:4360/'); await nj.evaluate(() => scrollTo(0, 3000));
  console.log('no JS -> hidden allergen chips:', await nj.evaluate(() => [...document.querySelectorAll('.allergens li')].filter(li => getComputedStyle(li).opacity === '0').length));
} finally { await b.close(); process.kill(-srv.pid); }
