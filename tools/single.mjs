// Packs the portable build into ONE self-contained HTML file (all pages, CSS, fonts, scripts inside).
// Pages become hash routes (#/contact). Opens by double-click on PC and from the Files app on a phone.
// usage: node tools/single.mjs [srcDir=dist-portable] [out=bucatarul-copiilor.html]
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const src = process.argv[2] || 'dist-portable';
const out = process.argv[3] || 'bucatarul-copiilor.html';
// optional: swap a page's content for a preview variant, e.g. meniu=preview/meniu-5-zile
const swap = Object.fromEntries((process.argv[4] || '').split(',').filter(Boolean).map((s) => s.split('=')));
const order = ['index', 'catering-gradinite', 'evenimente', 'meniu', 'despre', 'contact', 'confidentialitate'];
const extra = fs.readdirSync(src).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)).filter((n) => !order.includes(n) && n !== '404');
const pages = [...order, ...extra].filter((n) => fs.existsSync(path.join(src, n + '.html')));
// preview sub-folder pages
const previewDir = path.join(src, 'preview');
const previewPages = false && fs.existsSync(previewDir) ? fs.readdirSync(previewDir).filter((f) => f.endsWith('.html')).map((f) => 'preview/' + f.slice(0, -5)) : [];
const allPages = [...pages, ...previewPages];

const route = (name) => (name === 'index' ? '#/' : '#/' + name);
const fontData = (file) => `data:font/woff2;base64,${fs.readFileSync(path.join(src, '_astro', file)).toString('base64')}`;

const cssSeen = new Set();
const css = [];
const scriptSeen = new Set();
const scripts = [];
let shell = null;
const sections = [];

const fixHref = (href, pageName) => {
  if (!href) return href;
  if (/^(https?:|mailto:|tel:|data:)/.test(href)) return href;
  const pfx = (n) => n.replace(/\//g, '-') + '--';
  if (href.startsWith('#')) return href === '#continut' ? href : `#/${pageName === 'index' ? '' : pageName}::${pfx(pageName)}${href.slice(1)}`;
  const [file, hash] = href.split('#');
  let name = file.replace(/^\.\.\//, '').replace(/^\.?\//, '').replace(/\.html$/, '');
  if (name === '' || name === 'index') name = 'index';
  if (!allPages.includes(name)) return href;
  return hash ? `${route(name)}::${pfx(name)}${hash}` : route(name);
};

for (const name of allPages) {
  const file = path.join(src, (swap[name] || name) + '.html');
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);
  const base = src; // all asset hrefs are root-relative after the portable rewrite

  $('link[rel=stylesheet]').each((_, el) => {
    const p = path.join(base, $(el).attr('href').replace(/^\.?\//, ''));
    if (cssSeen.has(p)) return;
    cssSeen.add(p);
    css.push(fs.readFileSync(p, 'utf8'));
  });
  $('style').each((_, el) => { const t = $(el).html(); if (!cssSeen.has(t)) { cssSeen.add(t); css.push(t); } });
  $('script[type=module]').each((_, el) => { const t = $(el).html(); if (t && !scriptSeen.has(t)) { scriptSeen.add(t); scripts.push(t); } });

  // Prefix ids per page so hidden pages never collide
  const pre = name.replace(/\//g, '-') + '--';
  const main = $('main');
  main.find('[id]').each((_, el) => $(el).attr('id', pre + $(el).attr('id')));
  for (const attr of ['for', 'aria-controls', 'aria-labelledby', 'aria-describedby']) {
    main.find(`[${attr}]`).each((_, el) => $(el).attr(attr, $(el).attr(attr).split(' ').map((v) => pre + v).join(' ')));
  }
  main.find('a[href]').each((_, el) => {
    $(el).attr('href', fixHref($(el).attr('href'), name));
  });
  sections.push(`<div class="page" data-page="${name}" data-title="${$('title').text().replace(/"/g, '&quot;')}" hidden>${main.html()}</div>`);

  if (name === 'index') {
    $('header a[href], footer a[href], nav.mbar a[href]').each((_, el) => $(el).attr('href', fixHref($(el).attr('href'), 'index')));
    shell = { $, head: $('head') };
  }
}

// Inline fonts (woff2 only), drop woff fallbacks
let allCss = css.join('\n')
  .replace(/,\s*url\(\.\/[^)]+\.woff\)\s*format\(["']woff["']\)/g, '')
  .replace(/url\(\.\/([^)]+\.woff2)\)/g, (m, f) => `url(${fontData(f)})`);
// de-duplicate identical @font-face blocks
const faceSeen = new Set();
allCss = allCss.replace(/@font-face\{[^}]+\}/g, (b) => (faceSeen.has(b) ? '' : (faceSeen.add(b), b)));

const { $ } = shell;
$('head link[rel=preload], head link[rel=stylesheet], head style, head script[type=module], head link[rel=icon], head link[rel=apple-touch-icon], head link[rel=canonical], head meta[property^="og:"], head meta[name^="twitter:"]').remove();
const fav = fs.readFileSync(path.join(src, 'favicon.svg'), 'utf8');
$('head').append(`<link rel="icon" href="data:image/svg+xml;base64,${Buffer.from(fav).toString('base64')}">`);
$('head').append(`<style>${allCss}\n.page[hidden]{display:none!important}</style>`);
$('body script[type=module]').remove();
$('main').html(sections.join('\n'));

const router = `
(function(){
  var pages=[].slice.call(document.querySelectorAll('.page'));
  function show(){
    var h=location.hash||'#/';
    if(h==='#continut'){return;}
    var m=h.match(/^#\\/([^:]*)(?:::(.+))?$/); var name=(m&&m[1])||'index'; var anchor=m&&m[2];
    if(!pages.some(function(p){return p.dataset.page===name;})) name='index';
    pages.forEach(function(p){p.hidden=p.dataset.page!==name;});
    var cur=pages.filter(function(p){return p.dataset.page===name;})[0];
    document.title=cur.dataset.title;
    document.querySelectorAll('.hdr__link').forEach(function(a){ if(a.getAttribute('href')==='#/'+name) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    var el=anchor&&document.getElementById(anchor);
    if(el){ el.scrollIntoView(); } else { window.scrollTo({top:0,behavior:'instant'}); }
    document.dispatchEvent(new Event('astro:page-load'));
  }
  window.addEventListener('hashchange',show); show();
})();`;
// each component script keeps its own scope: minified names (function t…) would collide in one module
$('body').append(`<script type="module">${scripts.map((t) => `{\n${t}\n}`).join('\n')}</script>`);
$('body').append(`<script>${router}</script>`);

fs.writeFileSync(out, '<!doctype html>\n' + $.html().replace(/^<!DOCTYPE html>/i, ''));
console.log(`${out}: ${(fs.statSync(out).size / 1024).toFixed(0)} KB, pages: ${allPages.join(', ')}`);
