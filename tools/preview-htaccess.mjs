// Turns a production build into the preview copy for nou.bucatarulcopiilor.ro:
// no forced www redirect, noindex header, robots.txt that blocks everything.
// usage: node tools/preview-htaccess.mjs <distDir>
import fs from 'node:fs';
import path from 'node:path';
const dir = process.argv[2] || 'dist-preview';
const file = path.join(dir, '.htaccess');
let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('# One address'), b = s.indexOf('# Old WordPress');
if (a < 0 || b < 0) throw new Error('unexpected .htaccess layout');
s = s.slice(0, a) + '# Preview copy on nou.bucatarulcopiilor.ro: force https, keep it out of Google\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]\n\n' + s.slice(b);
s = s.replace('<IfModule mod_headers.c>', '<IfModule mod_headers.c>\n  Header always set X-Robots-Tag "noindex, nofollow"');
fs.writeFileSync(file, s);
fs.writeFileSync(path.join(dir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log('preview .htaccess ok');
