<script setup lang="ts">
import { getCategoryListV2 } from '@/api/category.api';
import { ssoUserCheck } from '@/api/sso.api';
import LayoutFooter from '@/components/footer/LayoutFooter.vue';
import MegaMenu from '@/components/header/MegaMenu.vue';
import MobileMenu from '@/components/header/MobileMenu.vue';
import PopupManager from '@/components/popup/PopupManager.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { POPUP_TYPE } from '@/types';
import { getApiClient, removeApiToken, setApiToken } from '@/utils/apiClient';
import { loadLocalData, removeLocalData, saveLocalData } from '@/utils/common-util';
import { useHead } from '@unhead/vue';
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';

useHead({
  title: 'APOC COMMUNITY',
  meta: [{ name: 'description', content: '' }],
});

const storeManager = initStore();
const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
const route = useRoute();
const isOpenMobileMenu = computed(() => storeManager.commonStore.isOpenMobileMenu);
const isHiddenHeader = computed(() => route.name === 'Write' || route.name === 'Edit' || route.name === 'LoginSuccess');
const isHiddenFooter = computed(() => route.name === 'Write' || route.name === 'Edit' || route.name === 'LoginSuccess');
const isPopupBg = computed(() => storeManager.stateStore.popupMode?.type === POPUP_TYPE.TABLET_SIDE_MENU);

const setLoginToken = (token: string) => {
  if (token) {
    storeManager.dataStore.setAuthToken(token);
    saveLocalData(AppConfig.KEYS.LOGIN_TOKEN, storeManager.dataStore.authToken);
    setApiToken(storeManager.dataStore.authToken);
  } else {
    storeManager.dataStore.setAuthToken('');
    removeLocalData(AppConfig.KEYS.LOGIN_TOKEN);
    removeApiToken();
  }
};

const token = loadLocalData(AppConfig.KEYS.LOGIN_TOKEN) || '';
setLoginToken(token);

// 카테고리 불러오기
const categoryLoading = ref(true);
const getCategory = async () => {
  const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
  try {
    const res = await getCategoryListV2(apiClient);
    if (res.resultCode === 0 && res.data) {
      saveLocalData(AppConfig.KEYS.CATEGORY, JSON.stringify(res.data));
      categoryLoading.value = false;
    }
  } catch (error) {
    console.error('Failed to load categories', error);
  }
};

const onClickBg = () => {
  storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.NONE });
};

onMounted(async () => {
  await getCategory();
});

watch(
  () => storeManager.dataStore.authToken,
  () => {
    setLoginToken(storeManager.dataStore.authToken);
  },
);
</script>

<template>
  <popup-manager />
	<div class="popup-bg" v-if="isPopupBg" @click="onClickBg"></div>
  <!--  <layout-header :class="{ 'is-hidden': isHiddenHeader }"></layout-header>-->
<!--  <layout-header2 :class="{ 'is-hidden': isHiddenHeader }"></layout-header2>-->
  <mega-menu :class="{ 'is-hidden': isHiddenHeader }"></mega-menu>
  <mobile-menu :class="{ 'is-open': isOpenMobileMenu }" v-if="!categoryLoading"></mobile-menu>
  <div class="page" :class="[{ 'hidden-header': isHiddenHeader, 'search-bar-open-page': storeManager.stateStore.isOpenSearchBar }]">
    <router-view :key="$route.path" v-if="!categoryLoading" />
  </div>
  <layout-footer :class="{ 'is-hidden': isHiddenFooter }"></layout-footer>
</template>

<style lang="scss">
@import 'assets/css/app.scss';
</style>
