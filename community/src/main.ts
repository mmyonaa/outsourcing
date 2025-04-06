// import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { ViteSSG } from 'vite-ssg';
import VueClickAway from 'vue3-click-away';
import { I18nOptions } from 'vue-i18n';
import { loadLocalData, removeLocalData, saveLocalData } from '@/utils/common-util';

import App from './App.vue';
import { routesList } from './router';
import { useCounterStore } from '@/stores/counter';
import AppConfig from '@/constants';
import { ko, en, setLanguage, setupI18n } from '@/lang';
// import routes from 'virtual:generated-pages'

if (typeof window !== 'undefined') import('./pwa');

// i18n 설정
let lang = loadLocalData(AppConfig.KEYS.LANG);
if (!lang) {
  setLanguage(Intl.DateTimeFormat().resolvedOptions().locale);
  lang = loadLocalData(AppConfig.KEYS.LANG);
}
const i18nConfig: I18nOptions = {
  legacy: false,
  missingWarn: false,
  fallbackWarn: false,
  warnHtmlMessage: false,
  fallbackLocale: 'en',
  locale: lang ? lang : 'en',
  messages: {
    ko,
    en,
  },
};
const i18n = setupI18n(i18nConfig);

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
    app.use(pinia).use(VueClickAway).use(i18n);

    // @ts-ignore
    if (import.meta.env.SSR) initialState.pinia = pinia.state.value;
    else pinia.state.value = initialState.pinia || {};

    router.beforeEach((to, from, next) => {
      const store = useCounterStore(pinia);
      if (typeof Window === 'undefined') return;
      if (from.name === 'Board') saveLocalData(from.path, (window.document.querySelector('html') as HTMLElement).scrollTop.toString());

      // if (!store.ready)
      //   // perform the (user-implemented) store action to fill the store's state
      //   store.initialize()
      next();
    });
  },
);

// const app = createApp()

// app.use(createPinia())
// app.use(router)
//
// app.mount('#app')
