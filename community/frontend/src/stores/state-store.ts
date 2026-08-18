import { POPUP_TYPE } from '@/types';
import { scrollAble, scrollDisable } from '@/utils/common-util';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface PopupMode {
  type: POPUP_TYPE;
  detail?: any;
}
export const useStateStore = defineStore('state', () => {
  const popupMode = ref<PopupMode>(); // 현재 열린 팝업 종류

  function setPopupMode(v: PopupMode) {
    popupMode.value = v;
    if (typeof window === 'undefined') return;
    if (popupMode.value.type !== POPUP_TYPE.NONE && popupMode.value.type !== POPUP_TYPE.COPY_TOAST) {
      scrollDisable();
    } else {
      scrollAble();
    }
  }

  return {
    popupMode,
    setPopupMode,
  };
});
