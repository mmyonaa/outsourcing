<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocLink from '@/components/common/ApocLink.vue';
import { initStore } from '@/stores/store-manager';
import SideBar from '@/components/common/SideBar.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MobileMenu',
  components: { SideBar, ApocLink, ApocImageSet },
  setup() {
    const store = initStore();
    const isOpenSubMenu = ref<boolean>(false);
    const route = useRoute();
    const sideBarRef = ref<InstanceType<typeof SideBar> | null>(null); // sideBar를 ref로 선언
    const isActiveBorder = ref<boolean>(false);

    const scrollDisable = () => {
      document.body.style.overflow = 'hidden';
      document.body.style.position = '';
      document.body.style.width = '100%';
    };

    const scrollAble = () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };

    const closeMobileMenu = () => {
      store.commonStore.setOpenMobileMenu(false);
      scrollAble();
    };

    const handleScroll = () => {
      if (sideBarRef.value) {
        const scrollTop = sideBarRef.value.$el.scrollTop;
        if (scrollTop > 0) {
          isActiveBorder.value = true;
        } else {
          isActiveBorder.value = false;
        }
      }
    };

    watch(
      () => store.commonStore.isOpenMobileMenu,
      isOpen => {
        if (isOpen) {
          scrollDisable();
        } else {
          scrollAble();
        }
      },
    );

    watch(
      () => route.query.type,
      () => {
        closeMobileMenu();
      },
    );

    onMounted(() => {
      window.addEventListener('resize', closeMobileMenu);
      nextTick(() => {
        if (sideBarRef.value) {
          sideBarRef.value.$el.addEventListener('scroll', handleScroll);
        }
      });
    });

    onUnmounted(() => {
      window.removeEventListener('resize', closeMobileMenu);
      if (sideBarRef.value) {
        sideBarRef.value.$el.removeEventListener('scroll', handleScroll);
      }
    });

    return {
      isOpenSubMenu,
      sideBarRef,
      isActiveBorder,
      closeMobileMenu,
    };
  },
});
</script>

<template>
  <div class="mobile-menu">
    <div class="mobile-menu-bg" @click="closeMobileMenu" @touchstart.prevent="closeMobileMenu"></div>
    <div class="menu-wrapper">
      <div class="logo-section" :class="{ 'active-border': isActiveBorder }">
        <div class="logo-area">
          <apoc-link href="/"><apoc-image-set src="/assets/images/logo/mobile-menu-logo.webp" alt="logo" :img-sets="3" /></apoc-link>
        </div>
        <div class="close-btn" @click="closeMobileMenu">
          <apoc-image-set src="/assets/images/common/icons/close-btn.webp" alt="close-btn" :img-sets="3" />
        </div>
      </div>
      <side-bar ref="sideBarRef" :is-drop-down="true" />
    </div>
  </div>
</template>

<style scoped></style>
