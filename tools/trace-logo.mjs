import sharp from 'sharp';
import potrace from 'potrace';
import fs from 'node:fs';
const src = process.argv[2], out = process.argv[3];
// alpha -> black-on-white bitmap, upscaled 4x for smoother curves
const { data, info } = await sharp(src).ensureAlpha().extractChannel(3).resize({ width: 1200, kernel: 'lanczos3' }).negate().png().toBuffer({ resolveWithObject: true });
fs.writeFileSync('tools/_mask.png', data);
potrace.trace('tools/_mask.png', { threshold: 128, turdSize: 20, optTolerance: 0.3, color: 'currentColor', background: 'transparent' }, (err, svg) => {
  if (err) throw err; fs.writeFileSync(out, svg); console.log(info, svg.length);
});
