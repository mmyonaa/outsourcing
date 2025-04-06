<script lang="ts">
import { BoardEntityDto } from '@/api/dto/board.dto';
import { MAIN_TAB_TYPE, SUB_TAB_TYPE } from '@/types';
import { getBoardCategoryV2 } from '@/utils/common-util';
import moment from 'moment';
import { type PropType, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NoticeCard',
  props: {
    // 게시글 요소 정보
    board: {
      type: Object as PropType<BoardEntityDto>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const category = getBoardCategoryV2(props.board as BoardEntityDto);

    const onClickCard = () => {
      router.push({
        name: 'BoardDetail',
        params: { mainTab: MAIN_TAB_TYPE.NOTICE, boardIdx: props.board.boardIdx },
        query: {
          type: SUB_TAB_TYPE.NOTICE,
        },
      });
    };

    return {
      category,
      moment,
      onClickCard,
    };
  },
});
</script>

<template>
  <div class="notice-el" @click="onClickCard">
    <div class="notice-title">
      <span class="title">
        <span class="a-tag">{{ board.title !== undefined ? board.title : '-' }}</span></span
      >
    </div>
    <div class="notice-date">
      {{ moment(board.regDt as Date).format('YYYY.MM.DD') }}
    </div>
  </div>
</template>
