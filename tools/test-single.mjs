import { createRequire } from 'node:module';
const { chromium, devices } = createRequire('/opt/node22/lib/node_modules/')('playwright');
const file = 'file://' + process.cwd() + '/' + (process.argv[2] || 'bucatarul-copiilor.html');
const b = await chromium.launch();
for (const [label, ctxOpts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['phone', devices['Pixel 7']]]) {
  const ctx = await b.newContext(ctxOpts); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('requestfailed', r => errs.push('fail ' + r.url().slice(0, 80)));
  await p.goto(file); await p.waitForTimeout(1500);
  const fonts = await p.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).filter((v,i,a)=>a.indexOf(v)===i).join('+'); });
  const vis = async () => p.evaluate(() => [...document.querySelectorAll('.page')].filter(x => !x.hidden).map(x => x.dataset.page).join(','));
  console.log(label, '| fonts:', fonts, '| start page:', await vis());
  if (label === 'desktop') {
    await p.click('.hdr__nav a:has-text("Meniu")'); await p.waitForTimeout(400); console.log('  nav Meniu ->', await vis(), '| title:', await p.title());
    await p.click('.hdr a.btn'); await p.waitForTimeout(400); console.log('  Cere o ofertă ->', await vis());
    await p.click('label[for="contact--oferta-gdpr"], .page[data-page=contact] .check'); 
    await p.click('.hdr__logo'); await p.waitForTimeout(400);
    await p.click('.page[data-page=index] a[href*="catering-gradinite::"]'); await p.waitForTimeout(600);
    console.log('  age card -> page', await vis(), '| hash', await p.evaluate(() => location.hash), '| scrolled', await p.evaluate(() => Math.round(scrollY)));
    await p.goto(file + '#/'); await p.waitForTimeout(500);
    await p.click('[id="index--hero-board-tab-marti"]'); console.log('  menu tab works:', await p.locator('[id="index--hero-board-panel-marti"]').isVisible());
  } else {
    await p.click('[data-burger]'); await p.waitForTimeout(400); console.log('  burger menu open:', await p.locator('[data-menu]').isVisible());
    await p.click('[data-menu] a:has-text("Evenimente")'); await p.waitForTimeout(500); console.log('  mobile nav ->', await vis());
    await p.screenshot({ path: 'shots/single-phone.png' });
  }
  console.log('  errors:', errs.length ? errs : 'none'); await ctx.close();
}
await b.close();
