<script lang="ts">
import { PopularSearchEntity } from '@/api/dto/popularSearch.dto';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocInput from '@/components/common/ApocInput.vue';
import { initStore } from '@/stores/store-manager';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Search',
  components: { ApocInput, ApocImageSet },
  setup() {
    const popularKeywordList = ref<PopularSearchEntity[]>([]);
    const videoSrcPc = ref<string>('/assets/videos/search_background_video_v2.mp4');
    const videoSrcTablet = ref<string>('/assets/videos/search_background_video_v2_tablet.mp4');
    const { t } = useI18n({ useScope: 'global' });
    
    return {
      t,
      videoSrcPc,
      videoSrcTablet,
      popularKeywordList,
    };
  },
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
    <!-- 인기 검색어 영역 위치 검색 결과 화면 나온 후 작업 -->
<!--    <section class="popular-keyword-section">-->
<!--      <div class="title">인기 검색어</div>-->
<!--      <div class="content">-->
<!--        <span @click="upComingTask(item.popularSearchKrName)" v-for="item in popularKeywordList" :key="item.popularSearchIdx">-->
<!--          {{ item.popularSearchKrName }}-->
<!--        </span>-->
<!--      </div>-->
<!--    </section>-->
    <video class="search-background pc" v-if="videoSrcPc" loop autoplay muted playsinline>
      <source :src="videoSrcPc" type="video/mp4" />
    </video>
		<video class="search-background tablet" v-if="videoSrcTablet" loop autoplay muted playsinline>
      <source :src="videoSrcTablet" type="video/mp4" />
    </video>
  </div>
</template>
