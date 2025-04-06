<script lang="ts">
import { deleteBoardComment, getBoardComment, updateBoardComment } from '@/api/boardComment.api';
import { BoardCommentEntity, BoardCommentResultDto, SearchBoardCommentDto } from '@/api/dto/boardComment.dto';
import { EvaluationEntity } from '@/api/dto/eval.dto';
import type { UserInfoEntityDto } from '@/api/dto/user.dto';
import { updateEvaluation } from '@/api/evaluation.api';
import ApocButton from '@/components/common/ApocButton.vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { EVAL_TARGET_TYPE, EVAL_TYPE, POPUP_TYPE } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { loadLocalData, ssoLogin } from '@/utils/common-util';
import moment from 'moment';
import { type PropType, defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CommentItem',
  components: { ApocButton, ApocImageSet },
  props: {
    comment: {
      type: Object as PropType<BoardCommentResultDto>,
    },
  },
  emits: ['onClickAddSubCommentBtn', 'getSubCommentList'],
  setup(props, ctx) {
    const { t } = useI18n({ useScope: 'global' });
    const router = useRouter();
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const commentTextarea = ref<HTMLTextAreaElement | null>(null);
    const isLike = ref<boolean>(props.comment ? props.comment.isLike : false);
    const likeCount = ref<number>(props.comment && props.comment.likeCount ? props.comment.likeCount : 0);
    const { emit } = ctx;
    const loginUser = ref<UserInfoEntityDto>();
    const commentBody = ref<string>(props.comment?.commentBody as string);
    const isCommentEdit = ref<boolean>(false);
    const commentData = ref<BoardCommentResultDto>(props.comment as BoardCommentResultDto);

    const onClickCommentLikeBtn = async () => {
      // 로그인하지 않은 유저가 댓글을 등록하는 경우 튕기기
      const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      if (!user) {
        alert(t('msg.RESULT_LOGIN_REQUIRED'));
        ssoLogin();
        return;
      }
      if (!commentData.value || !commentData.value.commentIdx) return;
      const param = new EvaluationEntity();
      param.targetIdx = commentData.value.commentIdx as string;
      param.targetType = EVAL_TARGET_TYPE.BOARD;
      param.evalCode = EVAL_TYPE.LIKE;
      await updateEvaluation(apiClient, param).then(res => {
        if (res.resultCode === 0) {
          // 화면에 보이는 좋아요 수정 따로 데이터 로드는 하지 않음
          if (isLike.value) {
            likeCount.value = Number(likeCount.value) - 1;
          } else {
            likeCount.value = Number(likeCount.value) + 1;
          }
          isLike.value = !isLike.value;
        } else {
          alert(t('msg.RESULT_ERROR_OCCURRED_AGAIN'));
        }
      });
    };

    const onClickReportBtn = () => {
      // 로그인하지 않은 유저가 댓글을 등록하는 경우 튕기기
      const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      if (!user) {
        alert(t('msg.RESULT_LOGIN_REQUIRED'));
        ssoLogin();
        return;
      }
      if (commentData.value) {
        storeManager.stateStore.setPopupMode({
          type: POPUP_TYPE.REPORT_POPUP,
          detail: { targetIdx: commentData.value?.commentIdx, targetType: 'COMMENT' },
        });
      }
    };

    /**
     * 대댓글 작성기 창 열기
     */
    const onClickAddSubCommentBtn = (e: Event) => {
      e.stopPropagation();
      emit('onClickAddSubCommentBtn');
    };

    /**
     * 로그인 유저 가져오기
     */
    const getUserInfo = () => {
      const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      if (user) {
        loginUser.value = JSON.parse(user);
      }
    };

    const onClickDeleteCommentBtn = async () => {
      const deleteOk = window.confirm(t('msg.RESULT_CONFIRM_COMMENT_DELETE'));
      if (!deleteOk) {
        return;
      }
      const param = new BoardCommentEntity();
      param.commentIdx = commentData.value?.commentIdx;
      await deleteBoardComment(apiClient, param).then(res => {
        if (res.resultCode === 0) {
          window.alert(t('msg.RESULT_COMMENT_DELETE'));
          window.dispatchEvent(new CustomEvent('COMMENT_LIST_UPDATE'));
          emit('getSubCommentList');
        } else {
          console.log(res.resultMsg);
        }
      });
    };

    const onClickUpdateComment = async () => {
      const param = new BoardCommentEntity();
      param.commentIdx = commentData.value?.commentIdx;
      param.commentBody = commentBody.value;
      await updateBoardComment(apiClient, param).then(res => {
        if (res.resultCode === 0) {
          getCommentDetail();
          window.alert(t('msg.RESULT_COMMENT_MODIFY'));
        } else {
          console.log(res.resultMsg);
        }
        isCommentEdit.value = false;
        clearInput();
      });
    };

    const getCommentDetail = async () => {
      const param = new SearchBoardCommentDto();
      param.commentIdx = commentData.value?.commentIdx;
      await getBoardComment(apiClient, param).then(res => {
        if (res.data && res.resultCode === 0) {
          commentData.value = res.data;
        } else {
          console.log(res.resultMsg);
        }
      });
    };

    const onClickUpdateCommentBtn = async () => {
      isCommentEdit.value = !isCommentEdit.value;
      clearInput();
      await nextTick();
      setTextareaHeight();
    };

    const setTextareaHeight = () => {
      if (commentTextarea.value) {
        commentTextarea.value.style.height = 'auto';
        commentTextarea.value.style.height = `${commentTextarea.value.scrollHeight}px`;
      }
    };

    const clearInput = () => {
      commentBody.value = commentData.value.commentBody as string;
      setTextareaHeight();
    };

    onMounted(() => {
      getUserInfo();
    });

    return {
      t,
      isLike,
      likeCount,
      loginUser,
      commentTextarea,
      commentBody,
      isCommentEdit,
      commentData,
      moment,
      onClickReportBtn,
      onClickAddSubCommentBtn,
      onClickUpdateComment,
      onClickCommentLikeBtn,
      onClickDeleteCommentBtn,
      onClickUpdateCommentBtn,
      setTextareaHeight,
    };
  },
});
</script>

<template>
  <section class="comment-item-section">
    <div class="user-profile-area">
      <apoc-image-set class="user-profile"></apoc-image-set>
    </div>
    <div class="comment-info-wrapper" v-if="!isCommentEdit">
      <div class="comment-top-area">
        <div class="user-name">{{ commentData?.userNickname }}</div>
      </div>
      <div class="comment-body-area">
        <span class="comment-body" v-if="!isCommentEdit">
          {{ commentData?.commentBody }}
        </span>
      </div>
      <div class="comment-icon-area">
        <div class="like icon-item">
          <apoc-button @click="onClickCommentLikeBtn">
            <apoc-image-set
              class="icon"
              :src="isLike ? '/assets/images/board/icon/board-icon-like-y.webp' : '/assets/images/board/icon/board-icon-like-n.webp'"
              :img-sets="3"
          /></apoc-button>
          <span>{{ likeCount }}</span>
        </div>
        <div class="not-my-comment">
          <div class="add-comment icon-item">
            <apoc-button @click="onClickAddSubCommentBtn">{{ t('reply') }}</apoc-button>
          </div>
          <div class="report icon-item" v-if="loginUser?.userIdx !== commentData?.userIdx">
            <apoc-button @click="onClickReportBtn">{{ t('report') }}</apoc-button>
          </div>
        </div>
        <div v-if="loginUser?.userIdx === commentData?.userIdx" class="my-comment">
          <div class="update-comment icon-item">
            <apoc-button @click="onClickUpdateCommentBtn()">{{ t('edit') }}</apoc-button>
          </div>
          <div class="delete-comment icon-item">
            <apoc-button @click="onClickDeleteCommentBtn">{{ t('delete') }}</apoc-button>
          </div>
        </div>
        <div class="reg-dt icon-item">
          <span>{{ commentData && commentData.regDt ? moment(commentData.regDt as Date).format('YY.MM.DD') : '-' }}</span>
        </div>
      </div>
    </div>
    <div class="edit-comment-wrapper" v-else-if="isCommentEdit">
      <textarea ref="commentTextarea" @input="setTextareaHeight" v-model="commentBody" :placeholder="t('placeholder.comment')" rows="1"></textarea>
      <div class="edit-comment-btn-area">
      <apoc-button class="cancel-btn edit-btn" @click="onClickUpdateCommentBtn()">{{ t('cancel') }}</apoc-button>
      <apoc-button class="submit-btn edit-btn" @click="onClickUpdateComment">{{ t('registration') }}</apoc-button>
    </div>
    </div>
  </section>
</template>
