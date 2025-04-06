import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ isProduction: true }),
    VitePWA({
      injectRegister: null,
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*{js,html,wasm,css}'],
        maximumFileSizeToCacheInBytes: 5000000,
        cleanupOutdatedCaches: false,
      },
    }),
  ],
  ssgOptions: {
    script: 'async',
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@types': path.resolve(__dirname, './src/types'),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
