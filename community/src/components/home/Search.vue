<script lang="ts">
import { PopularSearchEntity } from '@/api/dto/popularSearch.dto';
import { BasicListDto } from '@/api/dto/request.dto';
import { getPopularSearch } from '@/api/popularSearch.api';
import { ssoLogin, ssoUserCheck } from '@/api/sso.api';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocInput from '@/components/common/ApocInput.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { getApiClient, setApiToken } from '@/utils/apiClient';
import { saveLocalData } from '@/utils/common-util';
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Search',
  components: { ApocInput, ApocImageSet },
  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);

    const popularKeywordList = ref<PopularSearchEntity[]>([]);

    const videoSrcPc = ref<string>('/assets/videos/search_background_video_v2.mp4');
    const videoSrcTablet = ref<string>('/assets/videos/search_background_video_v2_tablet.mp4');
    const { t } = useI18n({ useScope: 'global' });

    const getPopularKeyword = async () => {
      const param = new BasicListDto();
      param.rows = 6;
      await getPopularSearch(apiClient, param).then(res => {
        if (res.resultCode === 0) {
          if (res.data) {
            popularKeywordList.value = res.data;
          }
        }
      });
    };
    const upComingTask = async (keyword: string | undefined) => {
      if (keyword) {
        console.log(keyword);
      }
      alert(t('RESULT_POST_SCHEDULED'));
    };
    onMounted(() => {
      getPopularKeyword();
    });
    return {
      t,
      videoSrcPc,
      videoSrcTablet,
      popularKeywordList,
      upComingTask,
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
        <!--디바이스별 placeHolder 변경-->
        <apoc-input
          class="pc"
          model-value=""
          type="text"
          :placeholder="t('placeholder.search')"
          @enter="upComingTask" />
        <apoc-input class="mobile" model-value="" type="text" placeholder="검색어를 입력해 보세요." @enter="upComingTask" />
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
