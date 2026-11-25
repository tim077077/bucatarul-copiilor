// Single source of truth for contact data and navigation.
export const site = {
  name: 'Bucătarul copiilor',
  url: 'https://www.bucatarulcopiilor.ro',
  phone: '0743 064 433',
  phoneHref: 'tel:+40743064433',
  whatsappHref: 'https://wa.me/40743064433',
  email: 'marius@bucatarulcopiilor.ro',
  address: { street: 'Str. Brateș nr. 6A', locality: 'Ghiroda', county: 'Timiș', postal: '307200', country: 'RO' },
  mapHref: 'https://www.google.com/maps/search/?api=1&query=Str.+Brates+6A+Ghiroda+Timis',
  facebook: 'https://www.facebook.com/bucatarulcopiilor/',
  instagram: 'https://www.instagram.com/bucatarulcopiilor/',
  years: 14,
  locations: 56,
};

export const nav = [
  { href: '/catering-gradinite', label: 'Catering grădinițe' },
  { href: '/evenimente', label: 'Evenimente' },
  { href: '/meniu', label: 'Meniu' },
  { href: '/despre', label: 'Despre' },
];

export const isDraft = import.meta.env.PUBLIC_DRAFT === 'true';
