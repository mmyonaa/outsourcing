<script lang="ts">
import BaseImageSet from '@/components/common/BaseImageSet.vue';
import BaseLink from '@/components/common/BaseLink.vue';
import ArrowDown from '@/components/header/ArrowDown.vue';
import { initStore } from '@/stores/store-manager';
import { POPUP_TYPE } from '@/types';
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MegaMenu',
  components: { BaseLink, BaseImageSet, ArrowDown },
  setup() {
    const storeManager = initStore();
    const route = useRoute();

    const isActive = ref<boolean>(false);
    const isSubMenuVisible = ref<boolean>(false);
    const isTabletMenuVisibleType = ref<string | null>(null);

    // (tablet ~ mobile) 사이드 메뉴 열림 여부
    const isSideMenuOpen = computed(() => storeManager.stateStore.popupMode?.type === POPUP_TYPE.TABLET_SIDE_MENU);

    // 현재 상위 메뉴를 path 기준으로 판단하는 computed
    // '/introduce', '/introduce/org' 등 포함경로 체크 (startsWith)
    const activeMenu = computed(() => {
      const path = route.path.toLowerCase();
      if (path.startsWith('/introduce')) return 'introduce';
      if (path.startsWith('/performance')) return 'performance';
      if (path.startsWith('/rental')) return 'rental';
      if (path.startsWith('/notice')) return 'notice';
      return '';
    });

    // 헤더 스타일
    const headerType = computed(() => (route.path === '/' ? 'opacity' : 'border'));

    // 마우스 이벤트 (pc 드롭다운)
    const handleMouseEnter = () => {
      isSubMenuVisible.value = true;
    };
    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.relatedTarget as Element | null;
      const { clientY, clientX } = event;
      if (target && !target.closest('.sub-menu-section')) isSubMenuVisible.value = false;
      else if (clientY <= 0 || clientX <= 0 || clientX >= window.innerWidth) isSubMenuVisible.value = false;
    };
    const handleMouseSubLeave = (event: MouseEvent) => {
      const target = event.relatedTarget as Element | null;
      const { clientY, clientX } = event;
      if (target && !target.closest('.main-menu-section')) isSubMenuVisible.value = false;
      else if (clientY <= 0 || clientX <= 0 || clientX >= window.innerWidth) isSubMenuVisible.value = false;
    };

    // 메뉴 링크 클릭 시 서브메뉴/사이드 메뉴 닫기 (이동은 router-link가 담당)
    const onCloseMenus = () => {
      storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.NONE });
      isSubMenuVisible.value = false;
      isTabletMenuVisibleType.value = null;
    };

    // (tablet ~ mobile) 서브메뉴 토글
    const onClickOpenSubMenu = (menuKey: string) => {
      if (isTabletMenuVisibleType.value === menuKey) isTabletMenuVisibleType.value = null;
      else isTabletMenuVisibleType.value = menuKey;
    };

    // (tablet ~ mobile) 햄버거 메뉴 열기/닫기
    const onClickTabletMenu = (open: boolean) => {
      if (open) storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.TABLET_SIDE_MENU });
      else storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.NONE });
    };

    const handleScroll = () => {
      isActive.value = window.scrollY > 0;
    };

    // ESC로 사이드 메뉴 닫기
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSideMenuOpen.value) onClickTabletMenu(false);
    };

    watch(
      () => storeManager.stateStore.popupMode,
      () => {
        if (storeManager.stateStore.popupMode?.type !== POPUP_TYPE.TABLET_SIDE_MENU) {
          isTabletMenuVisibleType.value = null;
        }
        // 사이드 메뉴 오픈 중 배경 스크롤 잠금
        document.body.style.overflow = isSideMenuOpen.value ? 'hidden' : '';
      },
    );

    onMounted(() => {
      document.addEventListener('scroll', handleScroll);
      document.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    });

    return {
      isActive,
      headerType,
      isSubMenuVisible,
      isSideMenuOpen,
      isTabletMenuVisibleType,
      activeMenu,
      POPUP_TYPE,
      storeManager,
      onCloseMenus,
      onClickOpenSubMenu,
      onClickTabletMenu,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseSubLeave,
    };
  },
});
</script>

<template>
  <div class="mega-menu">
    <header :class="[{ 'active-border': isActive && headerType === 'opacity' }, { 'white-background': isSubMenuVisible }, headerType]">
      <div class="main-header-wrapper">
        <base-link class="main-header-logo" href="/">
          <img src="/assets/images/logo/theater.png" alt="보광극장 로고" />
        </base-link>

        <!-- PC main menu -->
        <section class="main-menu-section" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <ul class="menu-list">
            <li class="menu play" :class="{ active: activeMenu === 'introduce' }">
              <router-link to="/introduce" @click="onCloseMenus">소개</router-link>
            </li>
            <li class="menu studio" :class="{ active: activeMenu === 'performance' }">
              <router-link to="/performance" @click="onCloseMenus">활동</router-link>
            </li>
            <li class="menu asset" :class="{ active: activeMenu === 'rental' }">
              <router-link to="/rental" @click="onCloseMenus">대관</router-link>
            </li>
            <li class="menu community" :class="{ active: activeMenu === 'notice' }">
              <router-link to="/notice" @click="onCloseMenus">알림</router-link>
            </li>
          </ul>
        </section>

        <section class="login-section">
          <ul class="menu-list">
            <li @click="onClickTabletMenu(true)" class="menu-icon hamburger">
              <span></span>
              <span></span>
              <span></span>
            </li>
          </ul>
        </section>
      </div>

      <!-- PC dropdown submenu -->
      <transition name="dropdown">
        <section v-show="isSubMenuVisible" class="sub-menu-section menu-list" @mouseleave="handleMouseSubLeave">
          <ul class="sub-menu-list play menu">
            <li><router-link to="/introduce" @click="onCloseMenus">극장 소개</router-link></li>
            <li><router-link to="/introduce/org" @click="onCloseMenus">단체 소개</router-link></li>
            <li><router-link to="/introduce/route" @click="onCloseMenus">오시는 길</router-link></li>
          </ul>
          <ul class="sub-menu-list studio menu">
            <li><router-link to="/performance" @click="onCloseMenus">자체 프로그램</router-link></li>
            <li><router-link to="/performance/next" @click="onCloseMenus">대관 프로그램</router-link></li>
          </ul>
          <ul class="sub-menu-list asset menu">
            <li><router-link to="/rental" @click="onCloseMenus">공간 안내</router-link></li>
            <li><router-link to="/rental/schedule" @click="onCloseMenus">대관 일정</router-link></li>
            <li><router-link to="/rental/info" @click="onCloseMenus">대관 신청</router-link></li>
          </ul>
          <ul class="sub-menu-list community menu">
            <li><router-link to="/notice" @click="onCloseMenus">공지사항</router-link></li>
            <li><router-link to="/news" @click="onCloseMenus">보도자료</router-link></li>
          </ul>
        </section>
      </transition>
    </header>

    <!-- Tablet & mobile side menu -->
    <transition name="fade">
      <div v-show="isSideMenuOpen" class="side-menu-backdrop" @click="onClickTabletMenu(false)"></div>
    </transition>
    <transition name="slide">
      <section v-show="isSideMenuOpen" class="main-menu-section-tablet">
        <ul>
          <li class="close-wrapper">
            <img class="logo-img" src="/assets/images/logo/theater.png" alt="보광극장 로고" />
            <base-image-set
              class="close-btn"
              :img-sets="3"
              src="/assets/images/common/icons/black-close-icon.webp"
              @click="onClickTabletMenu(false)" />
          </li>
          <li
            class="menu play"
            :class="{ opened: isTabletMenuVisibleType === 'introduce', active: activeMenu === 'introduce' }"
            @click="() => onClickOpenSubMenu('introduce')">
            소개
            <ArrowDown />
          </li>
          <transition name="dropdown">
            <section
              v-show="isTabletMenuVisibleType === 'introduce'"
              class="sub-menu-tablet"
              :class="{ opened: isTabletMenuVisibleType === 'introduce' }">
              <ul>
                <li><router-link to="/introduce" @click="onCloseMenus">극장 소개</router-link></li>
                <li><router-link to="/introduce/org" @click="onCloseMenus">단체 소개</router-link></li>
                <li><router-link to="/introduce/route" @click="onCloseMenus">오시는 길</router-link></li>
              </ul>
            </section>
          </transition>

          <li
            class="menu studio"
            :class="{ opened: isTabletMenuVisibleType === 'performance', active: activeMenu === 'performance' }"
            @click="() => onClickOpenSubMenu('performance')">
            활동
            <ArrowDown />
          </li>
          <transition name="dropdown">
            <section
              v-show="isTabletMenuVisibleType === 'performance'"
              class="sub-menu-tablet"
              :class="{ opened: isTabletMenuVisibleType === 'performance' }">
              <ul>
                <li><router-link to="/performance" @click="onCloseMenus">자체 프로그램</router-link></li>
                <li><router-link to="/performance/next" @click="onCloseMenus">대관 프로그램</router-link></li>
              </ul>
            </section>
          </transition>

          <li
            class="menu asset"
            :class="{ opened: isTabletMenuVisibleType === 'rental', active: activeMenu === 'rental' }"
            @click="() => onClickOpenSubMenu('rental')">
            대관
            <ArrowDown />
          </li>
          <transition name="dropdown">
            <section v-show="isTabletMenuVisibleType === 'rental'" class="sub-menu-tablet" :class="{ opened: isTabletMenuVisibleType === 'rental' }">
              <ul>
                <li><router-link to="/rental" @click="onCloseMenus">공간 안내</router-link></li>
                <li><router-link to="/rental/schedule" @click="onCloseMenus">대관 일정</router-link></li>
                <li><router-link to="/rental/info" @click="onCloseMenus">대관 신청</router-link></li>
              </ul>
            </section>
          </transition>

          <li
            class="menu community"
            :class="{ opened: isTabletMenuVisibleType === 'notice', active: activeMenu === 'notice' }"
            @click="() => onClickOpenSubMenu('notice')">
            알림
            <ArrowDown />
          </li>
          <transition name="dropdown">
            <section v-show="isTabletMenuVisibleType === 'notice'" class="sub-menu-tablet" :class="{ opened: isTabletMenuVisibleType === 'notice' }">
              <ul>
                <li><router-link to="/notice" @click="onCloseMenus">공지사항</router-link></li>
                <li><router-link to="/news" @click="onCloseMenus">보도자료</router-link></li>
              </ul>
            </section>
          </transition>
        </ul>
      </section>
    </transition>
  </div>
</template>
