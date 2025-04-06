<script lang="ts">
import { BoardEntityDto } from '@/api/dto/board.dto';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import AppConfig from '@/constants';
import { getBoardCategoryV2, loadLocalData } from '@/utils/common-util';
import { type PropType, defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'PopularCard',
  components: { ApocImageSet },
  props: {
    // 게시글 요소 정보
    board: {
      type: Object as PropType<BoardEntityDto>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const category = getBoardCategoryV2(props.board);
    const lang = ref<string>('');

    const onClickBoard = (boardIdx: string) => {
      if (!category || !category.mainTab || !category.subTab) return;
      router.push({
        name: 'BoardDetail',
        params: { mainTab: category?.mainTab.categoryCode?.toLowerCase(), boardIdx },
        query: {
          ...route.query,
          type: category?.subTab.categoryCode,
        },
      });
    };

    onMounted(() => {
      lang.value = loadLocalData(AppConfig.KEYS.LANG) as string;
    });
    return {
      onClickBoard,
      category,
      lang,
      AppConfig,
    };
  },
});
</script>

<template>
  <div class="popular-card-component" @click="onClickBoard(board?.boardIdx as string)">
    <section class="text-section">
      <span class="title">{{ board?.title }}</span>
      <section class="a-tag-section">
        <div class="a-tag">{{ category && category?.subTab ? lang === 'ko' ? category?.subTab.categoryKrName : category?.subTab.categoryEnName : '-' }}</div>
        <div class="icon">
          <apoc-image-set :img-sets="3" src="/assets/images/home/icon/home-icon-purple-right-arrow.webp" />
        </div>
      </section>
    </section>
    <div v-if="board && board.boardMainImg" class="img-section">
      <apoc-image-set :src="board.boardMainImg.includes('http')?board.boardMainImg:AppConfig.FILE_SERVER+board.boardMainImg" ></apoc-image-set>
    </div>
    <div v-else class="empty-img-section" />
  </div>
</template>
