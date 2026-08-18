import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { includedRoutes, onPageRendered } from './src/ssg/prerender-seo';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ isProduction: true }),
    VitePWA({
      injectRegister: null,
      registerType: 'autoUpdate',
      workbox: {
        // 앱 셸 자산 + 루트 index.html 만 프리캐시한다.
        // (기존 '**/*{js,html,wasm,css}' 는 점(.) 누락으로 "js로 끝나는 아무 파일"을 매칭했고,
        //  html 포함으로 프리렌더된 모든 상세 페이지가 프리캐시되어 글이 늘수록
        //  첫 방문 다운로드가 비대해지는 문제가 있었다)
        globPatterns: ['**/*.{js,css,wasm}', 'index.html'],
        maximumFileSizeToCacheInBytes: 5000000,
        // 배포마다 옛 프리캐시를 정리해 사용자 스토리지가 계속 불어나지 않게 한다
        cleanupOutdatedCaches: true,
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
    // 프리렌더 대상 라우트 선정 + 페이지별 SEO 주입은 src/ssg/prerender-seo.ts 참고.
    //  - /admin/* 은 색인 대상이 아니고 Quill 에디터가 SSR 중 document 접근으로 크래시하므로 제외
    //  - 정적 공개 라우트 + API에서 수집한 상세(:id) 라우트를 프리렌더
    includedRoutes,
    onPageRendered,
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