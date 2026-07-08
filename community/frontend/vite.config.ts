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
        // /api/* (Swagger 문서 포함)는 SPA가 아니므로 서비스워커의
        // index.html 네비게이션 폴백에서 제외한다
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  build: {
    outDir: 'dist',  // 빌드 출력 디렉토리를 dist로 설정
  },
  ssgOptions: {
    script: 'async',
    dirStyle: 'nested',
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