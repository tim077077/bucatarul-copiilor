// Builds a copy of the site that opens straight from disk (double-click index.html):
// absolute paths -> relative, page links -> .html files, no client router.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const out = process.env.OUT || 'dist-portable';
fs.rmSync(out, { recursive: true, force: true });
execSync(`npx astro build --outDir ${out}`, { stdio: 'inherit', env: { ...process.env, PUBLIC_PORTABLE: 'true' } });
fs.rmSync(path.join(out, 'landing.html'), { force: true });
const pages = new Set(fs.readdirSync(out).filter((f) => f.endsWith('.html')).map((f) => f.replace('.html', '')));
const fixLink = (p) => {
  const [base, hash = ''] = p.split('#');
  const h = hash ? '#' + hash : '';
  if (base === '' || base === '/') return (base === '' ? '' : 'index.html') + h;
  const name = base.replace(/^\//, '');
  if (pages.has(name)) return name + '.html' + h;
  return name + h; // assets: _astro/x.css, favicon.svg ...
};
for (const f of fs.readdirSync(out).filter((f) => f.endsWith('.html'))) {
  let s = fs.readFileSync(path.join(out, f), 'utf8');
  s = s.replace(/(href|src|action)="(\/[^"]*|\/)"/g, (m, a, p) => p.startsWith('//') ? m : `${a}="${fixLink(p)}"`);
  fs.writeFileSync(path.join(out, f), s);
}
for (const f of fs.readdirSync(path.join(out, '_astro')).filter((f) => f.endsWith('.css') || f.endsWith('.js'))) {
  const fp = path.join(out, '_astro', f);
  fs.writeFileSync(fp, fs.readFileSync(fp, 'utf8').replace(/\/_astro\//g, './'));
}
fs.writeFileSync(path.join(out, 'CITESTE-MA.txt'), 'Deschide index.html in browser (dublu-click).\nVersiune de previzualizare: fotografiile sunt inca placeholdere, iar formularul nu trimite inca mesaje.\n');
console.log('portable ok:', [...pages].join(', '));
