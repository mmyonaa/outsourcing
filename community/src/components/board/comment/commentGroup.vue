<script lang="ts">
import { getBoardCommentList, insertBoardComment } from '@/api/boardComment.api';
import { BoardCommentEntity, BoardCommentResultDto, SearchBoardCommentDto } from '@/api/dto/boardComment.dto';
import CommentItem from '@/components/board/comment/CommentItem.vue';
import ApocButton from '@/components/common/ApocButton.vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { ORDER_TYPE } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { loadLocalData, ssoLogin } from '@/utils/common-util';
import { type PropType, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'commentGroup',
  components: { ApocImageSet, ApocButton, CommentItem },
  props: {
    comment: {
      type: Object as PropType<BoardCommentResultDto>,
    },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const router = useRouter();
    const route = useRoute();
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const subCommentList = ref<BoardCommentResultDto[]>([]);
    const isOpenSubComment = ref<boolean>(false);
    const isOpenAddSubComment = ref<boolean>(false);
    const subCommentBody = ref<string>();
    const subCommentTextarea = ref<HTMLTextAreaElement | null>(null);
    const subCommentAreaRef = ref<HTMLElement | null>(null);

    const getSubCommentList = async () => {
      const param = new SearchBoardCommentDto();
      param.boardIdx = route.params.boardIdx as string;
      param.hirankBoardCommentIdx = props.comment?.commentIdx;
      param.orderType = ORDER_TYPE.NEW;

      await getBoardCommentList(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          console.error(res.resultMsg);
        } else {
          if (res.data) {
            subCommentList.value = res.data;
          }
        }
      });
    };

    const onClickOpenSubComment = () => {
      isOpenSubComment.value = !isOpenSubComment.value;
      isOpenAddSubComment.value = false;
    };

    const onClickAddSubCommentBtn = () => {
      isOpenAddSubComment.value = !isOpenAddSubComment.value;
      isOpenSubComment.value = true;
    };

    const inputHandler = () => {
      if (subCommentTextarea.value) {
        subCommentTextarea.value.style.height = 'auto';
        subCommentTextarea.value.style.height = `${subCommentTextarea.value.scrollHeight}px`;
      }
    };

    const clearInput = () => {
      subCommentBody.value = '';
      if (subCommentTextarea.value) {
        subCommentTextarea.value.style.height = 'auto';
      }
    };

    const insertSubComment = async () => {
      // 로그인하지 않은 유저가 댓글을 등록하는 경우 튕기기
      const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      if (!user) {
        alert(t('msg.RESULT_LOGIN_REQUIRED'));
        ssoLogin();
        return;
      }
      const param = new BoardCommentEntity();
      param.boardIdx = route.params.boardIdx as string;
      param.commentBody = subCommentBody.value;
      param.hirankBoardCommentIdx = props.comment?.commentIdx;

      await insertBoardComment(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          console.error(res.resultMsg);
        } else {
          window.alert(t('msg.RESULT_COMMENT_REGISTER'));
          clearInput();
          window.dispatchEvent(new CustomEvent('COMMENT_LIST_UPDATE'));
          getSubCommentList();
        }
      });
    };

    const handleClickOutSide = (e: Event) => {
      if ((isOpenSubComment.value || isOpenAddSubComment.value) && subCommentAreaRef.value) {
        if (!subCommentAreaRef.value.contains(e.target as Node)) {
          isOpenAddSubComment.value = false;
        }
      }
    };

    const onFocusComment = () => {
      const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      if (!user) {
        alert(t('msg.RESULT_LOGIN_REQUIRED'));
        ssoLogin();
        return;
      }
    };

    onMounted(() => {
      getSubCommentList();
      document.addEventListener('click', handleClickOutSide);
    });
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutSide);
    });
    return {
      t,
      subCommentList,
      isOpenSubComment,
      isOpenAddSubComment,
      subCommentBody,
      subCommentTextarea,
      subCommentAreaRef,
      onClickOpenSubComment,
      inputHandler,
      insertSubComment,
      onClickAddSubCommentBtn,
      getSubCommentList,
      onFocusComment,
    };
  },
});
</script>

<template>
  <div class="comment-group">
    <div class="top-comment-wrapper">
      <comment-item :comment="comment" @onClickAddSubCommentBtn="onClickAddSubCommentBtn" />
    </div>
    <apoc-button
      v-if="subCommentList.length > 0"
      class="sub-comment-list-open"
      :class="{ 'is-open': isOpenSubComment }"
      @click="onClickOpenSubComment">
      <apoc-image-set src="/assets/images/common/icons/arrow-up-primary-color-icon.webp" :img-sets="3" />댓글
      {{ subCommentList.length }}개</apoc-button
    >
    <!-- 대댓글 영역 -->
    <div v-if="(isOpenSubComment && subCommentList.length > 0) || isOpenAddSubComment" class="low-comment-wrapper" ref="subCommentAreaRef">
      <div
        v-if="isOpenAddSubComment"
        class="add-sub-comment-area"
        :class="{ 'is-show': isOpenAddSubComment }"
        v-click-away="
          () => {
            if (subCommentList.length < 1) {
              isOpenAddSubComment = false;
              isOpenSubComment = false;
            }
          }
        ">
        <textarea
          ref="subCommentTextarea"
          @input="inputHandler"
          v-model="subCommentBody"
          @focus="onFocusComment"
          :placeholder="t('placeholder.comment')"
          rows="1"></textarea>
        <apoc-button class="submit-btn" @click="insertSubComment">{{ t('registration') }}</apoc-button>
      </div>
      <comment-item
        v-for="subComment in subCommentList"
        :key="subComment.commentIdx"
        :comment="subComment"
        @get-sub-comment-list="getSubCommentList" />
    </div>
  </div>
</template>
