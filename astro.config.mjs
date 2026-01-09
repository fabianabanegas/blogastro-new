import { defineConfig } from 'astro/config';
import node from '@astrojs/node';  // Install: npm i @astrojs/node
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: node(),
  vite: { plugins: [tailwindcss()] }
});
