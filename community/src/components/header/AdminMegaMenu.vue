<script lang="ts">
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocInput from '@/components/common/ApocInput.vue';
import ApocLink from '@/components/common/ApocLink.vue';
import ArrowDown from '@/components/header/ArrowDown.vue';
import { initStore } from '@/stores/store-manager';
import { POPUP_TYPE } from '@/types';
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'AdminMegaMenu',
  components: { ApocInput, ApocLink, ApocImageSet, ArrowDown },
  setup() {
    const storeManager = initStore();
    const router = useRouter();
    const route = useRoute();

    const isActive = ref<boolean>(false);
    const isSubMenuVisible = ref<boolean>(false);
    const isTabletMenuVisibleType = ref<string | null>(null);

    // 경로 기준으로 active 메뉴 판단용
    // DEV 환경에서만 url 매핑 (필요하면 env에 따라 확장 가능)
    const urlMap = {
      introduce: '/introduce',
      performance: '/performance',
      rental: '/rental',
      notice: '/notice',
    };

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

    // 메뉴 클릭 시 해당 경로로 이동 + 서브메뉴 닫기 + 팝업 닫기
    const onClickMenu = (path: string) => {
      storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.NONE });
      isSubMenuVisible.value = false;
      router.push('/admin' + path);
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

    const onClickLogo = () => {
      onClickMenu(urlMap.introduce);
    };

    watch(
      () => storeManager.stateStore.popupMode,
      () => {
        if (storeManager.stateStore.popupMode?.type !== POPUP_TYPE.TABLET_SIDE_MENU) {
          isTabletMenuVisibleType.value = null;
        }
      }
    );

    onMounted(() => {
      document.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      document.removeEventListener('scroll', handleScroll);
    });

    return {
      isActive,
      headerType,
      isSubMenuVisible,
      isTabletMenuVisibleType,
      activeMenu,
      POPUP_TYPE,
      storeManager,
      onClickMenu,
      onClickOpenSubMenu,
      onClickTabletMenu,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseSubLeave,
      onClickLogo,
    };
  },
});
</script>

<template>
  <div class="mega-menu">
    <header
      :class="[
        { 'active-border': isActive && headerType === 'opacity' },
        { 'white-background': isSubMenuVisible },
        headerType
      ]"
    >
      <div class="main-header-wrapper">
        <apoc-link class="main-header-logo" href="/">
          <img src="/assets/images/logo/theater.png" @click="onClickLogo" />
        </apoc-link>

        <!-- PC main menu -->
        <section class="main-menu-section" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <ul class="menu-list">
            <li
              class="menu play"
              :class="{ active: activeMenu === 'introduce' }"
              @click="() => onClickMenu('/introduce')"
            >
              소개
            </li>
            <li
              class="menu studio"
              :class="{ active: activeMenu === 'performance' }"
              @click="() => onClickMenu('/performance')"
            >
              공연
            </li>
            <li
              class="menu asset"
              :class="{ active: activeMenu === 'rental' }"
              @click="() => onClickMenu('/rental')"
            >
              대관
            </li>
            <li
              class="menu community"
              :class="{ active: activeMenu === 'notice' }"
              @click="() => onClickMenu('/notice')"
            >
              공지사항
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
            <!-- <li @click="() => onClickMenu('/introduce')">극장 소개</li>
            <li @click="() => onClickMenu('/introduce/org')">단체 소개</li>
            <li @click="() => onClickMenu('/introduce/route')">오시는 길</li> -->
          </ul>
          <ul class="sub-menu-list studio menu">
            <li @click="() => onClickMenu('/performance')">역대 공연 등록</li>
            <li @click="() => onClickMenu('/performance/next')">예정 공연 등록</li>
          </ul>
          <ul class="sub-menu-list asset menu">
            <!-- <li @click="() => onClickMenu('/rental')">극장 상세사항</li>
            <li @click="() => onClickMenu('/rental/info')">대관 안내</li>
            <li @click="() => onClickMenu('/rental/schedule')">대관 스케줄</li> -->
          </ul>
          <ul class="sub-menu-list community menu">
            <li @click="() => onClickMenu('/notice')">공지 작성</li>
          </ul>
        </section>
      </transition>
    </header>
  </div>
</template>