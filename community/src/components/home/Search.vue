<script lang="ts">
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocInput from '@/components/common/ApocInput.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Search',
  components: { ApocInput, ApocImageSet },

});
</script>

<template>
  <div class="search-component">
    <!-- 검색 영역 위치 -->
    <section class="search-bar-section">
      <section class="search-input-section">
        <div class="img-section">
          <apoc-image-set src="/assets/images/common/icons/search-icon-white.webp" :img-sets="3" />
        </div>
      </section>
    </section>
      <div>search section</div>
    <video class="search-background pc" xloop autoplay muted playsinline>
    </video>
  </div>
</template>
