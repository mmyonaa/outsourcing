import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      // 필수 옵션만 넣어보세요.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Your App Name',
        short_name: 'App',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // <-- 여기 경로 맞게 조정
    },
  },
  build: {
    rollupOptions: {
      // external: ['lz-string'],  // 문제가 되는 모듈 추가
    },
  },
})
