<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'RentalInfo',
  setup() {
    onMounted(() => {
    });
    return {};
  },
});
</script>

<template>
  <div class="page-common rental-page">
    <h1>대관 신청 링크</h1>
    <div class="content-wrapper">
      <p class="description">
        아래 링크를 통해 극장 대관 신청서를 작성해 주세요.
      </p>
      <a
        class="rental-link"
        href="https://docs.google.com/forms/d/e/1FAIpQLScfMXsg6D2XDxpHAjClhDgyTfTvlMGMFSBuZ1zOTCOw4xRtxQ/viewform"
        target="_blank"
        rel="noopener noreferrer"
      >
        대관 신청 바로가기
      </a>
    </div>
  </div>
</template>