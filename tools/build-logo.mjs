import fs from 'node:fs';
import sharp from 'sharp';
const round = d => d.replace(/-?\d+\.\d+/g, n => (+n).toFixed(1).replace(/\.0$/, ''));
const mark = JSON.parse(fs.readFileSync('tools/mark.json')), word = JSON.parse(fs.readFileSync('tools/word.json'));
const md = round(mark.d), wd = round(word.d);
fs.mkdirSync('src/assets/logo', { recursive: true });
const svg = (vb, body, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}" fill="currentColor" fill-rule="evenodd">${body}</svg>`;
// mark 1200x1808, word 1200x524 (in 4x space)
const files = {
  'mark.svg': svg('0 0 1200 1808', `<path d="${md}"/>`, 'Bucătarul copiilor'),
  'word.svg': svg('0 0 1200 524', `<path d="${wd}"/>`, 'Bucătarul copiilor'),
  'stacked.svg': svg('0 0 1200 2492', `<path d="${md}"/><path transform="translate(0 1968)" d="${wd}"/>`, 'Bucătarul copiilor'),
  // horizontal: mark scaled to wordmark height*1.0, wordmark beside it
  'horizontal.svg': svg('0 0 1880 820', `<g transform="scale(0.4535)"><path d="${md}"/></g><g transform="translate(660 150)"><path d="${wd}"/></g>`, 'Bucătarul copiilor'),
};
for (const [f, s] of Object.entries(files)) {
  fs.writeFileSync('src/assets/logo/' + f, s);
  await sharp(Buffer.from(s.replace('currentColor', '#1F4A33'))).flatten({ background: '#FFF9EE' }).resize({ width: 600 }).png().toFile('tools/preview-' + f.replace('.svg', '.png'));
}
console.log(Object.keys(files).map(f => f + ' ' + fs.statSync('src/assets/logo/' + f).size));
