<script lang="ts">
import { getBoardListV2 } from '@/api/board.api';
import { BoardEntityDto, SearchBoardDto } from '@/api/dto/board.dto';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import NoticeCard from '@/components/home/NoticeCard.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { MAIN_TAB_TYPE, ORDER_TYPE, SAVE_STATE, STATE_YN, SUB_TAB_TYPE } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import moment from 'moment';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Notice',
  components: { NoticeCard, ApocImageSet },
  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const router = useRouter();
    const boardDataList = ref<BoardEntityDto[]>([]);

    const onClickMore = () => {
      router.push({ name: 'Board', params: { mainTab: MAIN_TAB_TYPE.NOTICE.toLowerCase() }, query: { type: SUB_TAB_TYPE.NOTICE } });
    };
    const getBoardDataList = async () => {
      storeManager.stateStore.setLoading(true);
      const param = new SearchBoardDto();
      param.openYn = STATE_YN.Y;
      param.saveState = SAVE_STATE.SAVE;
      param.mainTabCode = MAIN_TAB_TYPE.NOTICE;
      param.subTabCode = SUB_TAB_TYPE.NOTICE;
      param.orderType = ORDER_TYPE.NEW;
      param.rows = 3;
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
      moment,
      onClickMore,
    };
  },
});
</script>

<template>
  <div class="notice-component">
    <!-- 공지 제목 영역 -->
    <section class="notice-text-section">
      <div class="notice-title">
        <apoc-image-set :img-sets="3" class="icon" src="/assets/images/home/icon/home-icon-ring.webp " />
				<span class="title"><span class="text-gradient-color-1">{{'notice' }}</span>{{ 'notice2' }}</span>
      </div>
      <span class="notice-more" @click="onClickMore">+{{ 'more' }}</span>
    </section>
    <!-- 공지 카드 영역 -->
    <section class="notice-card-section">
      <div class="notice-el-wrapper">
        <notice-card :board="item" v-for="item in boardDataList" :key="item.boardIdx" />
      </div>
    </section>
		<div class="tutorial-background-twist-ring">
			<apoc-image-set src="/assets/images/home/background/home-bg-twisted-ring.webp" :img-sets="3" />
		</div>
  </div>
  <!-- 공지 전체 배경 영역 -->
  <div class="notice-background"></div>

</template>
