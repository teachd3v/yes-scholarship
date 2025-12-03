import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://yes-landingpage.netlify.app',
  
  integrations: [tailwind()],
});