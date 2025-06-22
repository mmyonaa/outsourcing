import { POPUP_TYPE } from '@/types';
import { scrollAble, scrollDisable } from '@/utils/common-util';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface PopupMode {
  type: POPUP_TYPE;
  detail?: any;
}
export const useStateStore = defineStore('state', () => {
  const popupMode = ref<PopupMode>(); // 로그인 인증 토큰
  const isLoading = ref<boolean>(false);
  const isOpenSearchBar = ref<boolean>(false);

  function setPopupMode(v: PopupMode) {
    popupMode.value = v;
    if (typeof Window === 'undefined') return;
    if (popupMode.value.type !== POPUP_TYPE.NONE && popupMode.value.type !== POPUP_TYPE.COPY_TOAST) {
      scrollDisable();
    } else {
      scrollAble();
    }
  }

  function setLoading(v: boolean) {
    isLoading.value = v;
  }
  function setIsOpenSearchBar(v: boolean) {
    isOpenSearchBar.value = v;
  }

  return {
    popupMode,
    isLoading,
    isOpenSearchBar,
    setPopupMode,
    setLoading,
    setIsOpenSearchBar,
  };
});
