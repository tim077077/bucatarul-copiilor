// usage: node tools/shoot.mjs <path> <name> [widths=1440,390] [full=1]
import { createRequire } from 'node:module';
const { chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright');
import { spawn } from 'node:child_process';
const [, , path = '/', name = 'home', widthsArg = '1440,390', full = '1'] = process.argv;
const srv = spawn('npx', ['astro', 'preview', '--port', '4329'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const browser = await chromium.launch();
try {
  for (const w of widthsArg.split(',').map(Number)) {
    const page = await browser.newPage({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 1 });
    await page.goto('http://localhost:4329' + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 60)); } scrollTo({ top: 0, behavior: 'instant' }); });
    await page.waitForTimeout(2200);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) console.log(`!! horizontal overflow at ${w}: ${sw}`);
    await page.screenshot({ path: `shots/${name}-${w}.png`, fullPage: full === '1' });
    await page.close();
  }
} finally { await browser.close(); srv.kill(); }
console.log('ok');
