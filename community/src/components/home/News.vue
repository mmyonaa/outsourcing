<script lang="ts">
import { getBoardListV2 } from '@/api/board.api';
import { BoardEntityDto, SearchBoardDto } from '@/api/dto/board.dto';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import NewsCard from '@/components/home/NewsCard.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { MAIN_TAB_TYPE, ORDER_TYPE, SAVE_STATE, STATE_YN, SUB_TAB_TYPE } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'News',
  components: { ApocImageSet, NewsCard },
  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const router = useRouter();
    const boardDataList = ref<BoardEntityDto[]>([]);

    // 게시글 가져오기
    const getBoardDataList = async () => {
      storeManager.stateStore.setLoading(true);
      const param = new SearchBoardDto();
      param.openYn = STATE_YN.Y;
      param.saveState = SAVE_STATE.SAVE;
      param.mainTabCode = MAIN_TAB_TYPE.NEWS;
      param.subTabCode = SUB_TAB_TYPE.NOW;
      param.orderType = ORDER_TYPE.NEW;
      param.rows = 2;
      await getBoardListV2(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          console.error(res.resultMsg);
        } else {
          if (res.data) {
            boardDataList.value = res.data;
          }
        }
        storeManager.stateStore.setLoading(false);
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
  <div class="news-component">
    <section class="news-text-section">
      <apoc-image-set :img-sets="3" class="icon" src="/assets/images/home/icon/home-icon-ribbon-bell.webp" />
			<span class="title"><span class="text-gradient-color-1">whats</span> new </span>
    </section>
    <section class="news-card-section grid">
      <news-card v-for="item in boardDataList" :key="item.boardIdx" :board="item" />
      <news-card :isLast="true" />
    </section>
  </div>
  <div class="news-background"></div>
</template>
