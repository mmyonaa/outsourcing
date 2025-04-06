<script lang="ts">
import { BoardEntityDto } from '@/api/dto/board.dto';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import AppConfig from '@/constants';
import { getBoardCategoryV2, loadLocalData } from '@/utils/common-util';
import moment from 'moment';
import { type PropType, defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'BoardListItem',
  components: { ApocImageSet },
  props: {
    // 게시글 요소 정보
    board: {
      type: Object as PropType<BoardEntityDto>,
      required: true,
    },
    // 좋아요 노출 여부
    isLike: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    // 댓글수 노출 여부
    isComment: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    // 작성자 노출 여부
    isRegrUser: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    // 작성 날짜 노출 여부
    isRegDt: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const tag = ref<string | undefined>(undefined);
    const category = getBoardCategoryV2(props.board);
    const lang = ref<string>('');

    onMounted(() => {
      lang.value = loadLocalData(AppConfig.KEYS.LANG) as string;
    });

    return {
      moment,
      tag,
      category,
      lang,
    };
  },
});
</script>

<template>
  <!-- 보더 리스트 요소 -->
  <div class="board-list-item-component">
    <!-- 상단부분 -->
    <section class="board-list-item-main-section">
      <div class="text-wrapper">
				<div class="text-area">
					<div class="tag-list" v-if="category?.tag && category?.tag.length > 0">
					</div>
					<div class="title">
						<span>{{ board?.title }}</span>
					</div>
					<div class="body">
						<span v-html="board?.body" />
					</div>
				</div>
				<section class="board-list-item-info-section">
					<div v-if="isLike" class="like">
						<apoc-image-set
							class="icon"
							:src="board && board.isLike ? '/assets/images/board/icon/board-icon-like-y.webp' : '/assets/images/board/icon/board-icon-like-n.webp'"
							:img-sets="3" />
						<span>{{ board && board.likeCount ? board.likeCount : 0 }}</span>
					</div>
					<div v-if="isComment" class="comment">
						<apoc-image-set class="icon" :src="'/assets/images/board/icon/board-icon-comment.webp'" :img-sets="3" />
						<span>{{ board && board.commentCount ? board.commentCount : 0 }}</span>
					</div>
					<div v-if="isRegrUser" class="regr-user">
						<span>{{ board && board.userNickname ? 'by ' + board.userNickname : '-' }}</span>
					</div>
					<div v-if="isRegDt" class="reg-dt">
						<span>{{ board && board.regDt ? moment(board.regDt as Date).format('YY.MM.DD') : '-' }}</span>
					</div>
				</section>
      </div>
      <!-- 썸네일 -->
      <apoc-image-set v-if="board?.boardMainImg" :src="''" class="thumbnail" />
    </section>
    <!-- 하단부분 -->

  </div>
</template>
