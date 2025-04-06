<script lang="ts">
import type { UserInfoEntityDto } from '@/api/dto/user.dto';
import { getUserInfo } from '@/api/user.api';
import ApocButton from '@/components/common/ApocButton.vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocInput from '@/components/common/ApocInput.vue';
import ApocLink from '@/components/common/ApocLink.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { getApiClient } from '@/utils/apiClient';
import { loadLocalData, removeLocalData, saveLocalData, ssoLogin } from '@/utils/common-util';
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'LayoutHeader',
  components: { ApocInput, ApocLink, ApocButton, ApocImageSet },
  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const route = useRoute();
    const router = useRouter();
    const openMobileMenu = computed(() => storeManager.commonStore.isOpenMobileMenu);
    const mainTab = computed(() => route.params.mainTab);
    const userInfo = ref<UserInfoEntityDto>();
    const isCheckUser = ref<boolean>(false); // 임시 변수(유저 관련 자리 잡히기 전까지)

    const headerRef = ref<HTMLElement | null>(null);
    const rightRef = ref<HTMLElement | null>(null);
    const isSearch = ref<boolean>(false); // 검색아이콘 활성 여부
    const searchText = ref<string>('');
    const isActive = ref<boolean>(false);
    const { t } = useI18n({ useScope: 'global' });

    // 글작성 페이지 이동, 로그아웃 확인 용으로 주석 삭제 예정
    const isClickMy = ref<boolean>(false);

    const headerType = computed(() => {
      const path = route.path;
      if (path === '/') {
        return 'opacity';
      } else {
        return 'border';
      }
    });
    const onClickMobileMenu = () => {
      storeManager.commonStore.setOpenMobileMenu(!openMobileMenu.value);
    };

    const onClickExternal = (site?: string) => {
      window.open(`https://${site}.apoc.day/`);
    };

    // 임시 로그인 페이지로 이동
    const onClickMyBtn = () => {
      if (isCheckUser.value) {
        // 글작성 페이지 이동, 로그아웃 확인 용으로 주석
        // router.push('/mypage?type=MY_CONTENTS');
        isClickMy.value = !isClickMy.value;
      } else {
        // router.push({ name: 'User' });
        ssoLogin();
      }
    };

    const updateUserInfo = async () => {
      await getUserInfo(apiClient, {}).then(res => {
        if (res.resultCode === 0) {
          if (res.data) {
            saveLocalData(AppConfig.KEYS.LOGIN_USER, JSON.stringify(res.data));
            userInfo.value = res.data;
            const token = loadLocalData(AppConfig.KEYS.LOGIN_TOKEN);
          }
        } else if (res.resultCode === 91) {
          removeLocalData(AppConfig.KEYS.LOGIN_TOKEN);
          removeLocalData(AppConfig.KEYS.LOGIN_USER);
          storeManager.dataStore.setAuthToken('');
        }
      });
    };

    watch(
      () => openMobileMenu.value,
      () => {
        if (typeof Window === 'undefined') return;
        if (openMobileMenu.value) {
          window.document.body.style.setProperty('overflow-y', 'hidden');
        } else {
          window.document.body.style.setProperty('overflow-y', 'scroll');
        }
      },
      { immediate: true },
    );

    const checkUserInfo = () => {
      const token = loadLocalData(AppConfig.KEYS.LOGIN_TOKEN);
      // const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      // if (token && user) {
      //   isCheckUser.value = true;
      // } else {
      //   isCheckUser.value = false;
      // }
      if (token) {
        isCheckUser.value = true;
      } else {
        isCheckUser.value = false;
      }
    };

    const onClickSearch = () => {
      if (isSearch.value) {
        if (!searchText.value) return;
        isSearch.value = true;
        searchText.value = '';
      } else {
        isSearch.value = true;
        searchText.value = '';
      }
    };

    // 글작성 페이지로 이동 검수용 삭제 예정
    const onClickWrite = () => {
      router.push({ name: 'Write' });
      isClickMy.value = false;
    };

    // 로그아웃 검수용 삭제 예정
    const onClickLogout = async () => {

    };
    watch(
      () => storeManager.dataStore.authToken,
      (current, prev) => {
        if (current !== prev) {
          checkUserInfo();
        }
      },
    );
    const handleClickOutsideHeader = (event: Event) => {
      if (isSearch.value) {
        if (rightRef.value && rightRef.value.contains(event.target as Node)) {
          return;
        }
        if (headerRef.value && !headerRef.value.contains(event.target as Node)) {
          isSearch.value = false;
        }
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 0) {
        isActive.value = true;
      } else {
        isActive.value = false;
      }
    };

    onMounted(() => {
      checkUserInfo();
      updateUserInfo();
      document.addEventListener('click', handleClickOutsideHeader);
      document.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutsideHeader);
      document.removeEventListener('scroll', handleScroll);
    });

    return {
      t,
      headerRef,
      rightRef,
      mainTab,
      isCheckUser,
      headerType,
      isSearch,
      searchText,
      isClickMy,
      isActive,
      onClickMobileMenu,
      onClickExternal,
      onClickMyBtn,
      onClickSearch,
      onClickWrite,
      onClickLogout,
    };
  },
});
</script>

<template>
  <div class="header" :class="[{ 'active-border': isActive && headerType === 'opacity' }, headerType]">
    <div class="header-external-wrapper">
      <ul class="external-list">
        <apoc-link class="external-item community" href="/">COMMUNITY</apoc-link>
        <apoc-link class="external-item studio" href="" @click="onClickExternal('studio')">STUDIO</apoc-link>
        <apoc-link class="external-item apoc" href="" @click="onClickExternal('www')">PLAY</apoc-link>
        <apoc-link class="external-item kit" href="" @click="onClickExternal('kit')">ASSET</apoc-link>
      </ul>
    </div>
    <div class="header-wrapper" ref="headerRef">
      <div class="left-area">
        <div class="mobile-menu-icon" @click="onClickMobileMenu">
          <apoc-image-set src="/assets/images/common/icons/mobile-menu-icon.webp" alt="mobile-menu-icon" :img-sets="3" />
        </div>
        <div class="logo-area" :class="{ 'search-active': isSearch }">
          <apoc-link href="/"><apoc-image-set src="/assets/images/logo/comm-logo.webp" alt="logo" :img-sets="3" /></apoc-link>
        </div>
      </div>
      <nav class="menu-area">
        <ul class="menu-list">
          <apoc-link href="/board/apoc_news?type=NOW" :class="{ active: mainTab === 'apoc_news' }"><li class="menu-item">{{ t('menu.mainMenu.apocNews') }}</li></apoc-link>
          <apoc-link href="/board/tutorial?type=TUTORIAL" :class="{ active: mainTab === 'tutorial' }"><li class="menu-item">{{ t('menu.mainMenu.tutorial') }}</li></apoc-link>
          <apoc-link href="/board/board?type=TIPS" :class="{ active: mainTab === 'board' }"><li class="menu-item">게시판</li></apoc-link>
          <apoc-link href="/board/notice?type=NOTICE" :class="{ active: mainTab === 'notice' }"><li class="menu-item">공지</li></apoc-link>
        </ul>
      </nav>
      <div class="right-area" ref="rightRef">
        <div class="search" v-if="!isSearch">
          <apoc-image-set src="/assets/images/common/icons/search-icon.webp" alt="search" @click.stop="onClickSearch" :img-sets="3"></apoc-image-set>
        </div>
        <div class="search-area" v-else>
          <apoc-input :model-value="searchText" @update="searchText = $event" type="text" placeholder="검색어를 입력하세요." />
          <apoc-image-set src="/assets/images/common/icons/search-icon.webp" alt="search" @click.stop="onClickSearch" :img-sets="3"></apoc-image-set>
        </div>
        <div class="login-area">
          <apoc-button v-if="isCheckUser" @click="onClickLogout">Logout</apoc-button>
          <apoc-button v-else @click="onClickMyBtn">Login</apoc-button>
        </div>
        <div class="my-list-area" v-if="isClickMy">
          <div @click="onClickWrite">Write</div>
          <div @click="onClickLogout">Logout</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
