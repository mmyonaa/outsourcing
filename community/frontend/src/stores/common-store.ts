import { defineStore } from 'pinia';
import { ref } from 'vue';

export enum THIRD_PARTY_TYPE {
  NONE = 'NONE',
  MS_TEAMS = 'MS_TEAMS',
  CAFE_24 = 'CAFE_24',
}

export const useCommonStore = defineStore('common', () => {
  const isLoading = ref(false); // 불러오기 상태 표시
  const thirdPartyType = ref<THIRD_PARTY_TYPE>(THIRD_PARTY_TYPE.NONE); // Third party에서 호출했는지 여부
  const isContentLoading = ref(false); // 콘텐츠 불러오기 상태 표시
  const isOpenMobileMenu = ref<boolean>(false);

  function setLoading(v: boolean) {
    isLoading.value = v;
  }
  function setContentLoading(v: boolean) {
    isContentLoading.value = v;
  }
  function setThirdPartyType(v: THIRD_PARTY_TYPE) {
    thirdPartyType.value = v;
  }
  function setOpenMobileMenu(v: boolean) {
    isOpenMobileMenu.value = v;
  }

  return {
    isLoading,
    isOpenMobileMenu,
    thirdPartyType,
    isContentLoading,
    setContentLoading,
    setThirdPartyType,
    setOpenMobileMenu,
    setLoading,
  };
});
