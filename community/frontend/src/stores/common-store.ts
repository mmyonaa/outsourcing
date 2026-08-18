import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCommonStore = defineStore('common', () => {
  const isOpenMobileMenu = ref<boolean>(false);

  function setOpenMobileMenu(v: boolean) {
    isOpenMobileMenu.value = v;
  }

  return {
    isOpenMobileMenu,
    setOpenMobileMenu,
  };
});
