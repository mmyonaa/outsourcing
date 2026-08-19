<script lang="ts">
import BaseLink from '@/components/common/BaseLink.vue';
import { initStore } from '@/stores/store-manager';
import { POPUP_TYPE } from '@/types';
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'AdminMegaMenu',
  components: { BaseLink },
  setup() {
    const storeManager = initStore();
    const route = useRoute();

    const isSubMenuVisible = ref<boolean>(false);
    const isTabletMenuVisibleType = ref<string | null>(null);

    // 현재 상위 메뉴를 path 기준으로 판단 — admin 경로는 전부 /admin 프리픽스를 가진다
    const activeMenu = computed(() => {
      const path = route.path.toLowerCase();
      if (path.startsWith('/admin/banner')) return 'banner';
      if (path.startsWith('/admin/performance')) return 'performance';
      if (path.startsWith('/admin/notice') || path.startsWith('/admin/news')) return 'notice';
      return '';
    });

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

    // 메뉴 링크 클릭 시 서브메뉴/팝업 닫기 (이동은 router-link가 담당)
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

    watch(
      () => storeManager.stateStore.popupMode,
      () => {
        if (storeManager.stateStore.popupMode?.type !== POPUP_TYPE.TABLET_SIDE_MENU) {
          isTabletMenuVisibleType.value = null;
        }
      },
    );

    return {
      isSubMenuVisible,
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
    <!-- admin 경로는 홈('/')이 아니므로 headerType 은 항상 'border' -->
    <header :class="['border', { 'white-background': isSubMenuVisible }]">
      <div class="main-header-wrapper">
        <base-link class="main-header-logo" href="/admin">
          <img src="/assets/images/logo/theater.png" alt="보광극장 관리자 홈" />
          <img class="admin-icon" src="/assets/images/admin/admin.png" alt="" />
        </base-link>

        <!-- PC main menu -->
        <section class="main-menu-section" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <ul class="menu-list">
            <li class="menu play" :class="{ active: activeMenu === 'banner' }">
              <router-link to="/admin/banner" @click="onCloseMenus">배너</router-link>
            </li>
            <li class="menu studio" :class="{ active: activeMenu === 'performance' }">
              <router-link to="/admin/performance" @click="onCloseMenus">활동</router-link>
            </li>
            <li class="menu community" :class="{ active: activeMenu === 'notice' }">
              <router-link to="/admin/notice" @click="onCloseMenus">알림</router-link>
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
        <section v-show="isSubMenuVisible" class="sub-menu-section menu-list admin" @mouseleave="handleMouseSubLeave">
          <ul class="sub-menu-list play menu">
            <li><router-link to="/admin/banner" @click="onCloseMenus">배너 등록</router-link></li>
          </ul>
          <ul class="sub-menu-list studio menu">
            <li><router-link to="/admin/performance" @click="onCloseMenus">자체 프로그램 등록</router-link></li>
            <li><router-link to="/admin/performance/next" @click="onCloseMenus">대관 프로그램 등록</router-link></li>
          </ul>
          <ul class="sub-menu-list community menu">
            <li><router-link to="/admin/notice" @click="onCloseMenus">공지 작성</router-link></li>
            <li><router-link to="/admin/news" @click="onCloseMenus">보도자료 작성</router-link></li>
          </ul>
        </section>
      </transition>
    </header>
  </div>
</template>
