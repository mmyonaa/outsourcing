<script lang="ts">
import { BoardEntityDto } from '@/api/dto/board.dto';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import { MAIN_TAB_TYPE, SUB_TAB_TYPE } from '@/types';
import { type PropType, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'NewsCard',
  components: { ApocImageSet },
  props: {
    board: {
      type: Object as PropType<BoardEntityDto>,
      require: false,
    },
    isLast: {
      type: Boolean,
      require: false,
      default: false,
    },
  },

  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n({ useScope: 'global' });

    const onClickCard = () => {
      if (!props.board) {
        // 아폭 소식 더보기
        router.push({
          name: 'Board',
          params: { mainTab: MAIN_TAB_TYPE.NEWS },
          query: {
            ...route.query,
            type: SUB_TAB_TYPE.NOW,
          },
        });
      } else {
        router.push({
          name: 'BoardDetail',
          params: { mainTab: MAIN_TAB_TYPE.NEWS, boardIdx: props.board?.boardIdx },
          query: {
            ...route.query,
            type: SUB_TAB_TYPE.NOW,
          },
        });
      }
    };

    return {
      onClickCard,
      t,
    };
  },
});
</script>

<template>
  <div class="news-card-component" :class="{ last: isLast }" @click="onClickCard">
    <section class="text-section" :class="{ last: isLast }">
      {{ isLast ? '아폭의 더 많은 소식을 접해보세요!' : board?.title }}
    </section>
    <section class="a-tag-section" :class="{ last: isLast }">
      <div class="a-tag">{{ t('more') }}</div>
      <div class="icon" :class="{ last: isLast }">
        <apoc-image-set class="light" :img-sets="3" src="/assets/images/home/icon/home-icon-light-gray-right-arrow.webp" />
        <apoc-image-set class="purple" :img-sets="3" src="/assets/images/home/icon/home-icon-purple-right-arrow.webp" />
      </div>
    </section>
    <div class="img-section" v-if="isLast">
      <apoc-image-set :img-sets="3" src="/assets/images/home/icon/home-icon-search.webp"></apoc-image-set>
    </div>
  </div>
</template>
