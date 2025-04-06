<script lang="ts">
import { getBoardListV2 } from '@/api/board.api';
import { BoardEntityDto, SearchBoardDto } from '@/api/dto/board.dto';
import BoardListCardItem from '@/components/board/BoardListCardItem.vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import BoardListSkeleton from '@/components/common/BoardListSkeleton.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { MAIN_TAB_TYPE, ORDER_TYPE, SAVE_STATE, STATE_YN, SUB_TAB_TYPE, VIEW_MODE_TYPE } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { decodeHTMLEntities } from '@/utils/common-util';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Tutorial',
  components: { BoardListSkeleton, ApocImageSet, BoardListCardItem },

  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const router = useRouter();

    const boardDataList = ref<BoardEntityDto[]>([]);
    const isLoading = computed(() => storeManager.stateStore.isLoading);
    const { t } = useI18n({ useScope: 'global' });
    /**
     * function
     */
    // 게시글 가져오기
    const getBoardDataList = async () => {
      // 정상적으로 데이터가 넘어오지 않은 경우
      storeManager.stateStore.setLoading(true);
      const param = new SearchBoardDto();
      param.openYn = STATE_YN.Y;
      param.saveState = SAVE_STATE.SAVE;
      param.mainTabCode = MAIN_TAB_TYPE.TUTORIAL;
      param.rows = 4;
      param.orderType = ORDER_TYPE.NEW;
      await getBoardListV2(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          console.error(res.resultMsg);
        } else {
          if (res.data) {
            boardDataList.value = res.data;
            removeHTMLtag(boardDataList.value);
            storeManager.stateStore.setLoading(false);
          }
        }
      });
    };

    const removeHTMLtag = (item: BoardEntityDto[]) => {
      // console.clear();
      item.forEach((i: BoardEntityDto) => {
        if (!i.body) return;
        // 이미지태그 제거 및 모든 태그를 p태그 처리
        i.body = i.body.replace(/<[^>]*>?/g, ' ');
        i.body = `<p>${i.body}</p>`;
        i.body = decodeHTMLEntities(i.body);
      });
    };

    const onClickMore = () => {
      router.push({ name: 'Board', params: { mainTab: MAIN_TAB_TYPE.TUTORIAL.toLowerCase() }, query: { type: SUB_TAB_TYPE.USE_STUDIO } });
    };

    onMounted(() => {
      getBoardDataList();
    });
    return {
      t,
      boardDataList,
      isLoading,
      VIEW_MODE_TYPE,
      onClickMore,
    };
  },
});
</script>

<template>
  <div class="tutorial-component">
    <section class="tutorial-text-section">
      <div class="tutorial-title">
        <apoc-image-set :img-sets="3" class="icon" src="/assets/images/home/icon/home-icon-brush-pen.webp" />
				<span class="title">APOC <span class="text-gradient-color-1">{{ t('home.online') }} {{ t('home.tutor') }}</span></span>
      </div>
      <span class="tutorial-more" @click="onClickMore">+{{ t('more') }}</span>
    </section>
    <board-list-skeleton v-if="isLoading" :view-mode="VIEW_MODE_TYPE.CARD" :view-count="4" />
    <section v-else class="tutorial-card-section grid">
      <board-list-card-item v-for="item in boardDataList" :key="item.boardIdx" :board="item" />
    </section>
		<!-- 튜토리얼 얼룩 -->
		<div class="tutorial-background-twist">
			<apoc-image-set src="/assets/images/home/background/home-bg-cylinder-twist.webp" :img-sets="3" />
		</div>
		<div class="home-bg-purple-stain"></div>
		<div class="tutorial-background-twist-ring">
			<apoc-image-set src="/assets/images/home/background/home-bg-twisted-ring.webp" :img-sets="3" />
		</div>
		<div class="home-bg-pink-stain"></div>
  </div>
</template>
