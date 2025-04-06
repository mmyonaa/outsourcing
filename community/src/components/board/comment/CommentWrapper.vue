<script lang="ts">
import { insertBoardComment } from '@/api/boardComment.api';
import { BoardCommentEntity, BoardCommentResultDto } from '@/api/dto/boardComment.dto';
import CommentGroup from '@/components/board/comment/commentGroup.vue';
import ApocButton from '@/components/common/ApocButton.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { getApiClient } from '@/utils/apiClient';
import { loadLocalData, ssoLogin } from '@/utils/common-util';
import { type PropType, computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'CommentWrapper',
  components: { ApocButton, CommentGroup },
  props: {
    commentList: {
      type: Object as PropType<BoardCommentResultDto[]>,
    },
    commentTotalCount: {
      type: Number as PropType<number>,
    },
    topCommentTotalCount: {
      type: Number as PropType<number>,
    },
  },
  emits: ['onClickGoListBtn'],
  setup(props, ctx) {
    const { t } = useI18n({ useScope: 'global' });
    const router = useRouter();
    const route = useRoute();
    const commentBody = ref<string>();
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const commentTextarea = ref<HTMLTextAreaElement | null>(null);
    const { emit } = ctx;
    const commentPage = ref<number>(1);
    const commentPageCount = computed(() => Math.ceil(props.topCommentTotalCount ? props.topCommentTotalCount / 10 : 0));

    const insertComment = async () => {
      // 로그인하지 않은 유저가 댓글을 등록하는 경우 튕기기
      const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      if (!user) {
        alert(t('msg.RESULT_LOGIN_REQUIRED'));
        ssoLogin();
        return;
      }
      const param = new BoardCommentEntity();
      param.boardIdx = route.params.boardIdx as string;
      param.commentBody = commentBody.value;

      await insertBoardComment(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          console.error(res.resultMsg);
        } else {
          window.alert(t('msg.RESULT_COMMENT_REGISTER'));
          clearInput();
          commentPage.value = 1;
          window.dispatchEvent(new CustomEvent('COMMENT_LIST_UPDATE'));
        }
      });
    };

    const inputHandler = () => {
      if (commentTextarea.value) {
        commentTextarea.value.style.height = 'auto';
        commentTextarea.value.style.height = commentTextarea.value.scrollHeight + 'px';
      }
    };

    const clearInput = () => {
      commentBody.value = '';
      if (commentTextarea.value) {
        commentTextarea.value.style.height = 'auto';
      }
    };

    const onClickGoListBtn = () => {
      emit('onClickGoListBtn');
    };

    const onClickMoreBtn = () => {
      window.dispatchEvent(new CustomEvent('COMMENT_LIST_UPDATE', { detail: { page: ++commentPage.value } }));
    };
    const onFocusComment = () => {
      const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      if (!user) {
        alert(t('msg.RESULT_LOGIN_REQUIRED'));
        ssoLogin();
        return;
      }
    };
    return {
      t,
      commentBody,
      commentTextarea,
      commentPage,
      commentPageCount,
      inputHandler,
      insertComment,
      onClickGoListBtn,
      onClickMoreBtn,
      onFocusComment,
    };
  },
});
</script>

<template>
  <div class="board-comment-wrapper">
    <section class="comment-section">
      <div class="add-comment-wrapper">
        <textarea
          ref="commentTextarea"
          @input="inputHandler"
          v-model="commentBody"
          @focus="onFocusComment"
          :placeholder="t('placeholder.comment')"
          rows="1"></textarea>
        <apoc-button class="submit-btn" @click="insertComment">{{ t('registration') }}</apoc-button>
      </div>
      <div class="comment-list-wrapper">
        <comment-group v-for="comment in commentList" :key="comment.commentIdx" :comment="comment" @insert-comment="insertComment" />
      </div>
      <div class="more-btn-area" v-if="commentPageCount > commentPage">
        <apoc-button class="more-btn" @click="onClickMoreBtn">{{ t('more') }}</apoc-button>
      </div>
    </section>
  </div>
</template>
