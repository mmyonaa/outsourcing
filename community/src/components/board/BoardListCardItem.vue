<script lang="ts">
import { BoardEntityDto } from '@/api/dto/board.dto';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import AppConfig from '@/constants';
import { convertSeconds, getBoardCategoryV2, loadLocalData } from '@/utils/common-util';
import { type PropType, computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'BoardListCardItem',
  computed: {
    AppConfig() {
      return AppConfig;
    },
  },
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
    const subTab = ref<string | undefined>(undefined);
    const tag = ref<string | undefined>(undefined);
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
      tag,
      subTab,
      category,
      lang,
      onClickBoard,
      convertSeconds,
    };
  },
});
</script>

<template>
  <div class="card-item-component" @click="onClickBoard(board?.boardIdx as string)">
    <div class="thumbnail-area">
      <!-- 썸네일 -->
      <apoc-image-set :src="AppConfig.FILE_SERVER+board.boardMainImg" class="thumbnail" />
    </div>
    <div class="body-wrapper">
      <section class="text-section">
        <div class="title">
          <span>{{ board?.title }}</span>
        </div>
				<div class="content"><span>{{ t('menu.mainMenu.tutorial') }} > </span>{{ category?.subTab ? lang === 'ko' ? category?.subTab.categoryKrName : category?.subTab.categoryEnName : '-' }}</div>
      </section>
      <section class="time-section">
        <apoc-image-set :img-sets="3" class="icon" src="/assets/images/home/icon/home-icon-time.webp" />
        <div class="time">{{ convertSeconds(board?.playTime) }} {{ t('quantity') }}</div>
      </section>
    </div>
  </div>
</template>
