// The menu runs on a 4-week cycle that repeats. Real menu from the kitchen's A4 sheets
// ("Meniu complet / Săptămâna 1–4", received Nov 2026), portions as printed on the sheet.
export const meals = ['Mic dejun', 'Prânz', 'Gustare'] as const;

export const cycleStart: string | null = null;

export type Day = { id: string; short: string; name: string; items: [string, string, string]; plate: string };
export type Week = { days: Day[] };

const D = [
  { id: 'luni', short: 'Lu', name: 'Luni' },
  { id: 'marti', short: 'Ma', name: 'Marți' },
  { id: 'miercuri', short: 'Mi', name: 'Miercuri' },
  { id: 'joi', short: 'Jo', name: 'Joi' },
  { id: 'vineri', short: 'Vi', name: 'Vineri' },
];
// [breakfast, lunch "soup · main", snack] per day; plate = what the lunch photo shows
type Row = [string, string, string];
const week = (rows: Row[]): Week => ({
  days: rows.map((items, i) => ({ ...D[i], items, plate: items[1].replace(' · ', ', ').replace(/\s\d+(\s?\/\s?\d+)*(\sml|\sg)?/g, '') })),
});

export const cycle: Week[] = [
  week([
    ['Omletă 80 g', 'Supă de legume 200 ml · Orez cu legume colorate și pui 250 g', 'Salam de biscuiți 50 g'],
    ['Terci de ovăz 100 g', 'Supă de pui cu tăiței 200 ml · Friptură de pui la cuptor 50 g și piure de cartofi 150 g', 'Chec cu fructe 50 g'],
    ['Croissant cu cremă de brânză și prosciutto cotto 100 g', 'Supă cremă de chimen 200 ml cu crutoane 15 g · Paste cu sos bolognese 250 g', 'Plăcintă cu mere 60 g'],
    ['Ou fiert 50 g, roșii 50 g, brânză 25 g', 'Ciorbă de legume 200 ml · Mămăliguță 200 g cu brânză și smântână 60 g', 'Brioșe 50 g'],
    ['Iaurt cu cereale 100 g', 'Ciorbă de pui a la grec 200 ml · Papricaș de pui 200 g', 'Papanași fierți 60 g'],
  ]),
  week([
    ['Griș cu lapte și miere 100 g', 'Ciorbă de văcuță 200 ml · Paste cu roșii și busuioc 250 g', 'Sărățele cu cașcaval 50 g'],
    ['Terci de ovăz cu fructe de pădure 100 g', 'Supă de roșii 200 ml · Friptură de pui la cuptor 50 g și piure de cartofi 150 g', 'Salam de biscuiți 50 g'],
    ['Sandviș cu cremă de brânză și prosciutto 100 g', 'Supă de pui 200 ml · Varză a la Cluj 200 g / Mămăliguță cu brânză și smântână 200 / 30 / 20 g', 'Brioșe 50 g'],
    ['Omletă 80 g', 'Supă cremă de legume 200 ml cu crutoane 15 g · Cușcuș cu pui 200 g', 'Cornulețe cu gem 50 g'],
    ['Iaurt cu fructe și biscuiți 100 g', 'Ciorbă de legume 200 ml · Mazăre 200 g cu chiftele de porc 50 g', 'Plăcintă cu brânză dulce 60 g'],
  ]),
  week([
    ['Orez cu lapte și scorțișoară 100 g', 'Supă de legume cu tășcuțe 200 ml · Paste carbonara 200 g', 'Turtă dulce 60 g'],
    ['Terci de ovăz cu fructe de pădure 100 g', 'Ciorbă de pui 200 ml · Spanac cu ou fiert 200 g / Mămăliguță cu brânză și smântână 200 / 30 / 20 g', 'Pandișpan 40 g'],
    ['Omletă cu legume 80 g', 'Supă de legume 200 ml · Gulaș de pui 200 g', 'Papanași fierți 60 g'],
    ['Sandviș cu pateu de casă 100 g', 'Supă cremă de morcov cu dovleac 200 ml cu crutoane 30 g · Șnițel de pui cu fulgi de porumb 50 g, orez cu legume colorate 200 g', 'Chec sărat 50 g'],
    ['Brânză de vaci cu iaurt și banană 80 g', 'Ciorbă de pui a la grec 200 ml · Chiftele de porc 50 g cu sos de roșii, cartofi 200 g', 'Plăcintă cu brânză dulce 60 g'],
  ]),
  week([
    ['Orez cu lapte și scorțișoară 100 g', 'Supă cremă de ciuperci 200 ml cu crutoane 15 g · Paste cu brânză și smântână 250 g', 'Covrigi cu susan 50 g'],
    ['Sandviș cu pui 100 g', 'Supă cremă de morcov 200 ml cu crutoane 15 g · Orez cu carne de pui 250 g', 'Chec cu fructe 50 g'],
    ['Ou fiert 50 g, roșii 50 g, brânză 25 g', 'Ciorbiță țărănească cu borș 220 ml · Tocăniță de pui 50 g cu mămăliguță 200 g', 'Brioșe 50 g'],
    ['Hummus cu ardei 50 g', 'Supă de roșii 200 ml · Friptură de pui la cuptor 50 g și piure de cartofi 200 g', 'Plăcintă cu mere 50 g'],
    ['Brioșe sărate cu morcov 50 g', 'Supă de pui cu tăiței 200 ml · Paste bolognese 250 g', 'Pandișpan cu fructe 40 g'],
  ]),
];

/** Photo shot id for a cycle day, e.g. week 2 Wednesday -> "M2-3" (see the shot list in README). */
export const shotId = (w: number, d: number) => `M${w + 1}-${d + 1}`;

// Lunch photos per cycle day (shotId -> file in public/photos/meniu). Photos supplied by the client
// in Nov 2026 (downloaded from the web, licence not verified; two with visible watermarks were left out).
// Replace with Marius's own photos as they arrive. Days without an entry show the logo placeholder.
const P = (f: string) => `/photos/meniu/${f}.webp`;
export const platePhotos: Record<string, string> = {
  'M1-1': P('supa-legume'), 'M1-2': P('supa-pui-taitei'), 'M1-3': P('paste-bolognese'), 'M1-4': P('mamaliguta'), 'M1-5': P('ciorba-a-la-grec'),
  'M2-1': P('paste-rosii'), 'M2-3': P('varza-a-la-cluj'), 'M2-5': P('mazare-chiftele'),
  'M3-1': P('paste-branza'), 'M3-2': P('mamaliguta'), 'M3-3': P('supa-legume'), 'M3-4': P('supa-crema-morcov'), 'M3-5': P('ciorba-a-la-grec'),
  'M4-1': P('paste-branza'), 'M4-5': P('paste-bolognese'),
};
