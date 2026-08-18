<script setup lang="ts">
import LayoutFooter from '@/components/footer/LayoutFooter.vue';
import MegaMenu from '@/components/header/MegaMenu.vue';
import AdminMegaMenu from '@/components/header/AdminMegaMenu.vue';
import ScrollToTop from '@/components/common/ScrollToTop.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { POPUP_TYPE } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

// 주의: 여기서 useHead로 전역 title/description을 설정하면 안 된다.
// 하이드레이션 시점에 프리렌더된 페이지별 SEO 메타를 덮어써서
// JS 렌더링 크롤러(Googlebot)가 보는 메타가 전부 무효화된다.
// 페이지별 메타는 프리렌더(ssg/prerender-seo.ts) + 라우터 beforeEach(setMetaTags)가 담당한다.

const storeManager = initStore();
getApiClient(AppConfig.API_SERVER);
const route = useRoute();
const isPopupBg = computed(() => storeManager.stateStore.popupMode?.type === POPUP_TYPE.TABLET_SIDE_MENU);

const onClickBg = () => {
  storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.NONE });
};
</script>

<template>
	<div class="popup-bg" v-if="isPopupBg" @click="onClickBg"></div>
  <admin-mega-menu v-if="route.path.startsWith('/admin')"></admin-mega-menu>
  <mega-menu v-else></mega-menu>
  <div class="page">
    <router-view :key="$route.path" />
  </div>
  <layout-footer></layout-footer>
  <scroll-to-top />
</template>

<style lang="scss">
@import 'assets/css/app.scss';
</style>