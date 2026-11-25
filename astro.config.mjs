import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.bucatarulcopiilor.ro',
  trailingSlash: 'never',
  integrations: [sitemap({ filter: (p) => !p.includes('/404') })],
  redirects: { '/landing': '/' },
  build: { format: 'file' },
});
