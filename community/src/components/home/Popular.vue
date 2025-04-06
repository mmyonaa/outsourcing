<script lang="ts">
import { getBoardListV2 } from '@/api/board.api';
import { BoardEntityDto, SearchBoardDto } from '@/api/dto/board.dto';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import PopularCard from '@/components/home/PopularCard.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { ORDER_TYPE, SAVE_STATE, STATE_YN } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'Popular',
  components: { ApocImageSet, PopularCard },
  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const router = useRouter();
    const route = useRoute();
    const boardDataList = ref<BoardEntityDto[]>([]); // 데이터 리스트
    const totalPage = ref<number>(0); // 총 페이지
    const pagesPerGroup = 6; // 6개 노출

    // 게시글 가져오기
    const getBoardDataList = async () => {
      // 스크롤 초기화
      const param = new SearchBoardDto();
      param.openYn = STATE_YN.Y;
      param.saveState = SAVE_STATE.SAVE;
      param.rows = pagesPerGroup;
      param.orderType = ORDER_TYPE.READ_COUNT_DESC;
      await getBoardListV2(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          console.error(res.resultMsg);
        } else {
          if (res.data) {
            boardDataList.value = res.data;
            totalPage.value = Math.ceil(res.totalCount / pagesPerGroup);
          }
        }
      });
    };

    onMounted(() => {
      getBoardDataList();
    });
    return {
      boardDataList,
    };
  },
});
</script>

<template>
  <div class="popular-component">
    <!-- 인기 게시글 제목 영역 -->
    <section class="popular-text-section">
      <apoc-image-set :img-sets="3" class="icon" src="/assets/images/home/icon/home-icon-speaker.webp" />
			<span class="title"><span class="text-gradient-color-1">{{ 'popular' }}</span> {{ 'post' }}</span>
    </section>
    <!-- 인기 게시글 제목 카드 -->
    <section class="popular-card-section grid">
      <popular-card v-for="item in boardDataList" :key="item.boardIdx" :board="item" />
    </section>
		<div class="home-bg-purple-stain"></div>
		<div class="home-bg-purple-stain-center"></div>
		<div class="home-bg-pink-stain"></div>
  </div>
  <div class="popular-background-logo-pattern">
    <apoc-image-set src="/assets/images/home/background/home-bg-logo-pattern.webp" :img-sets="3" />
  </div>
  <div class="popular-background"></div>
</template>
