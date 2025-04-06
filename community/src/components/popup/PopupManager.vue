<script lang="ts">
import CopyToastPopup from '@/components/popup/CopyToastPopup.vue';
import ReportPopup from '@/components/popup/ReportPopup.vue';
import { initStore } from '@/stores/store-manager';
import { POPUP_TYPE } from '@/types';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'PopupManager',
  components: { CopyToastPopup, ReportPopup },
  setup() {
    const storeManager = initStore();
    const popupMode = computed(() => storeManager.stateStore.popupMode);

    return {
      popupMode,
      POPUP_TYPE,
    };
  },
});
</script>

<template>
  <section class="popup-manager">
    <report-popup
      v-if="popupMode?.type === POPUP_TYPE.REPORT_POPUP"
      :target-idx="popupMode.detail.targetIdx"
      :target-type="popupMode.detail.targetType" />
    <transition name="toast">
      <copy-toast-popup v-if="popupMode?.type === POPUP_TYPE.COPY_TOAST" />
    </transition>
  </section>
</template>
