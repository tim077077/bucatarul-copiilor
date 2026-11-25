// usage: node tools/phone-shot.mjs <file.html> <outName>  -> full-page Pixel 7 screenshot of the home page
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire('/opt/node22/lib/node_modules/')('playwright');
const [, , file, name] = process.argv;
const b = await chromium.launch();
const c = await b.newContext({ ...devices['Pixel 7'], deviceScaleFactor: 1, reducedMotion: 'reduce' });
const p = await c.newPage(); await p.goto('file://' + process.cwd() + '/' + file + '#/'); await p.waitForTimeout(1200);
const h = await p.evaluate(() => document.documentElement.scrollHeight), vh = await p.evaluate(() => innerHeight);
await p.addStyleTag({ content: '.mbar{display:none!important}' });
await p.screenshot({ path: 'shots/' + name + '.png', fullPage: true });
console.log(name, h + 'px', (h / vh).toFixed(1) + ' screens');
await b.close();
