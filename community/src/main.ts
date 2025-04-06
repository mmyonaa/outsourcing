// import { createApp } from 'vue'
import { loadLocalData, removeLocalData, saveLocalData } from '@/utils/common-util';
import { createPinia } from 'pinia';
import { ViteSSG } from 'vite-ssg';
import VueClickAway from 'vue3-click-away';
import { useCounterStore } from '@/stores/counter';
import App from './App.vue';
import { routesList } from './router';

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

    // @ts-ignore
    if (import.meta.env.SSR) initialState.pinia = pinia.state.value;
    else pinia.state.value = initialState.pinia || {};

    router.beforeEach((to, from, next) => {
      const store = useCounterStore(pinia);
      if (typeof Window === 'undefined') return;
      if (from.name === 'Board') saveLocalData(from.path, (window.document.querySelector('html') as HTMLElement).scrollTop.toString());

      next();
    });
  },
);


