import { loadLocalData, removeLocalData, saveLocalData } from '@/utils/common-util';
import { createPinia } from 'pinia';
import { ViteSSG } from 'vite-ssg';
import { vReveal } from '@/directives/reveal';
import App from './App.vue';
import { routesList } from './router';
import { setMetaTags, pageSeoConfig } from '@/utils/seo.util';

if (typeof window !== 'undefined') import('./pwa');

export const createApp = ViteSSG(
  App,
  {
    routes: routesList,

    /*
     * @comment 이전 스크롤 기억
     */
    scrollBehavior(to, from) {
      // 홈 화면으로 돌아온 경우
      if (to.path === '/') {
        removeLocalData(from.path);
        return { top: 0, left: 0 };
      }
      // 동일한 PATH
      if (to.path === from.path) {
        removeLocalData(to.path);
        return { top: 0, left: 0 };
      }
      // footer로 보드끼리 강제로 이동하는경우 계속 로컬스토리지에 저장이 됩니다
      if (to.name === 'Board' && from.name === 'Board') {
        removeLocalData(to.path);
        return { top: 0, left: 0 };
      }
      const scrollY = loadLocalData(to.path);
      if (scrollY) {
        removeLocalData(to.path);
        return { top: Number(scrollY) };
      } else {
        return { top: 0, left: 0 };
      }
    },
  },
  ({ app, router, routes, isClient, initialState }) => {
    const pinia = createPinia();
    // pinia를 앱에 설치해야 컴포넌트의 useXxxStore() 호출이 동작한다.
    // (과거에는 beforeEach의 useCounterStore(pinia) 호출이 우연히 active pinia를
    //  설정해줘서 동작했으나, counter 스토어 제거 후 명시적 설치가 필수가 됨)
    app.use(pinia);

    // 스크롤 리빌 애니메이션 (전역 디렉티브)
    app.directive('reveal', vReveal);

    if (import.meta.env.SSR) initialState.pinia = pinia.state.value;
    else pinia.state.value = initialState.pinia || {};

    router.beforeEach((to, from, next) => {
      // SSR(프리렌더) 환경에서는 브라우저 전용 처리를 건너뛰되, 반드시 next()를 호출해
      // 네비게이션이 완료되도록 한다. (next() 없이 return하면 router.isReady()가 영영
      // resolve되지 않아 vite-ssg 프리렌더가 멈춘다.)
      if (isClient) {
        if (from.name === 'Board') saveLocalData(from.path, (window.document.querySelector('html') as HTMLElement).scrollTop.toString());

        // SEO 메타 태그 설정 — canonical/og:url 은 이동 "대상" 경로(to.path)로 만든다
        // (beforeEach 시점의 window.location.href 는 아직 이전 페이지)
        if (to.name && typeof to.name === 'string') {
          const seoConfig = pageSeoConfig[to.name];
          if (seoConfig) {
            setMetaTags(seoConfig, to.path);
          }
        }
      }

      next();
    });
  },
);


