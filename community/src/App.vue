<script setup lang="ts">
import LayoutFooter from '@/components/footer/LayoutFooter.vue';
import MegaMenu from '@/components/header/MegaMenu.vue';
import AdminMegaMenu from '@/components/header/AdminMegaMenu.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { POPUP_TYPE } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

useHead({
  title: 'BKTHEATER',
  meta: [{ name: 'description', content: '' }],
});

const storeManager = initStore();
const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
const route = useRoute();
const isOpenMobileMenu = computed(() => storeManager.commonStore.isOpenMobileMenu);
const isHiddenHeader = computed(() => route.name === 'Write' || route.name === 'Edit' || route.name === 'LoginSuccess');
const isHiddenFooter = computed(() => route.name === 'Write' || route.name === 'Edit' || route.name === 'LoginSuccess');
const isPopupBg = computed(() => storeManager.stateStore.popupMode?.type === POPUP_TYPE.TABLET_SIDE_MENU);

const onClickBg = () => {
  storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.NONE });
};


</script>

<template>
	<div class="popup-bg" v-if="isPopupBg" @click="onClickBg"></div>
  <admin-mega-menu v-if="route.path.includes('admin')" :class="{ 'is-hidden': isHiddenHeader }"></admin-mega-menu>
  <mega-menu v-else :class="{ 'is-hidden': isHiddenHeader }"></mega-menu>
  <!-- 일단 주석.... 오류 준나 나.... -->
  <!-- <mobile-menu :class="{ 'is-open': isOpenMobileMenu }"></mobile-menu> -->
  <div class="page" :class="[{ 'hidden-header': isHiddenHeader, 'search-bar-open-page': storeManager.stateStore.isOpenSearchBar }]">
    <router-view :key="$route.path" />
  </div>
  <layout-footer :class="{ 'is-hidden': isHiddenFooter }"></layout-footer>
</template>

<style lang="scss">
@import 'assets/css/app.scss';
</style>
