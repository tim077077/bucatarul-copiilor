// confirmed:false answers are drafts — shown only in draft mode, hidden in production
// until the client confirms the wording.
export type Faq = { q: string; a: string; confirmed: boolean; tags: string[] };

export const faqs: Faq[] = [
  { q: 'Cine face meniul?', confirmed: true, tags: ['gradinite', 'meniu'],
    a: 'Meniul îl face Chef Marius, pe un ciclu de 4 săptămâni care se repetă. Așa știți dinainte ce mănâncă copiii în fiecare zi, iar porțiile sunt potrivite vârstei lor.' },
  { q: 'Cum gestionați alergiile și regimurile speciale?', confirmed: true, tags: ['gradinite', 'meniu'],
    a: 'Avem opțiuni pentru alergii și regimuri speciale. Ne spuneți de la început ce nevoi există în grupă, iar noi pregătim variantele potrivite pentru copiii respectivi.' },
  { q: 'Ce costă o porție?', confirmed: true, tags: ['gradinite'],
    a: 'Prețul este fix pe porție, fără costuri ascunse. Îl stabilim în ofertă, în funcție de numărul de copii, de vârste și de mesele de care aveți nevoie.' },
  { q: 'Cum livrați mâncarea?', confirmed: true, tags: ['gradinite'],
    a: 'Gătim în fiecare dimineață și livrăm mâncarea caldă, la timp, în fiecare zi lucrătoare, direct la ușa unității.' },
  { q: 'Din ce zone livrați?', confirmed: false, tags: ['gradinite'],
    a: 'Livrăm în Timișoara și în localitățile din jur (Ghiroda, Dumbrăvița, Giroc, Moșnița, Sânmihaiu Român). [de confirmat cu Marius]' },
  { q: 'De la câți copii lucrați?', confirmed: false, tags: ['gradinite'],
    a: 'Lucrăm cu unități de toate mărimile, de la creșe mici până la grădinițe cu mai multe grupe. [prag minim de confirmat]' },
  { q: 'Putem schimba meniul?', confirmed: false, tags: ['gradinite', 'meniu'],
    a: 'Da. Revedem meniul împreună în fiecare lună și ținem cont de ce le place copiilor și de observațiile educatoarelor. [de confirmat]' },
  { q: 'Aveți autorizație sanitar-veterinară?', confirmed: false, tags: ['gradinite'],
    a: 'Da, bucătăria este înregistrată la DSVSA Timiș. Vă trimitem documentele odată cu oferta. [număr și document de confirmat]' },
];

export const faqSchema = (tag?: string) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.filter((f) => f.confirmed && (!tag || f.tags.includes(tag)))
    .map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
