import sharp from 'sharp';
import potrace from 'potrace';
import fs from 'node:fs';
const S = 4, src = 'tools/logo-source.png';
const parts = { mark: [0, 452], word: [492, 623] };
const trace = (buf) => new Promise((res, rej) => potrace.trace(buf, { threshold: 128, turdSize: 30, optTolerance: 0.4 }, (e, svg) => e ? rej(e) : res(svg)));
for (const [name, [y0, y1]] of Object.entries(parts)) {
  const img = sharp(src).ensureAlpha().extract({ left: 0, top: y0, width: 300, height: y1 - y0 }).extractChannel(3);
  const buf = await img.resize({ width: 300 * S, kernel: 'lanczos3' }).negate().png().toBuffer();
  const svg = await trace(buf);
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map(m => m[1]).join(' ');
  // tight bbox from numbers
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number); const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1);
  const vb = [Math.floor(Math.min(...xs)), Math.floor(Math.min(...ys)), Math.ceil(Math.max(...xs) - Math.min(...xs)), Math.ceil(Math.max(...ys) - Math.min(...ys))];
  fs.writeFileSync(`tools/${name}.json`, JSON.stringify({ d, vb }));
  console.log(name, vb, d.length);
}
