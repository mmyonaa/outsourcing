<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'CopyToastPopup',
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="toast-wrapper">
    <div class="toast">링크가 복사되었습니다.</div>
  </div>
</template>

<style scoped></style>
