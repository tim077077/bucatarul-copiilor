import fs from 'node:fs';
import sharp from 'sharp';
const mark = fs.readFileSync('src/assets/logo/mark.svg', 'utf8');
const stacked = fs.readFileSync('src/assets/logo/stacked.svg', 'utf8');
const word = fs.readFileSync('src/assets/logo/word.svg', 'utf8');
const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
// Favicon: milk mark on a parsley rounded square
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1f4a33"/><g transform="translate(17.5 7) scale(0.0242)" fill="#fff9ee" fill-rule="evenodd">${inner(mark)}</g></svg>`;
fs.writeFileSync('public/favicon.svg', fav);
await sharp(Buffer.from(fav)).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(Buffer.from(fav)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
// OG image 1200x630: parsley ground, stacked logo, one line of type rendered as outlines-free text fallback
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#1f4a33"/>

<g transform="translate(120 105) scale(0.17)" fill="#fff9ee" fill-rule="evenodd">${inner(stacked)}</g>
<text x="400" y="290" font-family="Georgia, serif" font-size="54" fill="#fff9ee">Prânz cald pentru creșe</text>
<text x="400" y="370" font-family="Georgia, serif" font-size="54" fill="#fff9ee">și grădinițe din Timiș</text>
<text x="400" y="450" font-family="Arial, sans-serif" font-size="30" fill="#c9dccd">Gătit zilnic · meniu cu medic nutriționist</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-image.png');
fs.writeFileSync('public/robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: https://www.bucatarulcopiilor.ro/sitemap-index.xml\n');
console.log('icons ok');
