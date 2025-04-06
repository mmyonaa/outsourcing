<script lang="ts">
import { deleteBoard, getBoardDetail, getBoardListV2, getBoardPrevNextIdx, updateBoardShareCount } from '@/api/board.api';
import { getBoardCommentList } from '@/api/boardComment.api';
import { BoardEntity, BoardEntityDto, SearchBoardDto, updateBoardStaticsDto } from '@/api/dto/board.dto';
import { BoardCommentResultDto, SearchBoardCommentDto } from '@/api/dto/boardComment.dto';
import { EvaluationEntity } from '@/api/dto/eval.dto';
import { UserFollowRecEntity, UserInfoEntityDto } from '@/api/dto/user.dto';
import { updateEvaluation } from '@/api/evaluation.api';
import { updateFollowUser } from '@/api/user.api';
import BoardListCardItem from '@/components/board/BoardListCardItem.vue';
import CommentWrapper from '@/components/board/comment/CommentWrapper.vue';
import ApocButton from '@/components/common/ApocButton.vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import BoardDetailSkeleton from '@/components/common/BoardDetailSkeleton.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { EVAL_TARGET_TYPE, EVAL_TYPE, MAIN_TAB_TYPE, ORDER_TYPE, POPUP_TYPE, SAVE_STATE, STATE_YN } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { getFirstImageSrc, loadLocalData, setOpenGraph, setSeoMeta, ssoLogin } from '@/utils/common-util';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'BoardDetail',
  components: { BoardDetailSkeleton, BoardListCardItem, CommentWrapper, ApocButton, ApocImageSet },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const router = useRouter();
    const route = useRoute();
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const boardDetail = ref<BoardEntityDto>();
    const commentList = ref<BoardCommentResultDto[]>([]);
    const tutorialDataList = ref<BoardEntityDto[]>([]);
    const mainTab = computed(() => (route.params.mainTab as string)?.toUpperCase());
    const subTabCode = ref<string>('');
    const isAdminBoard = computed(() => {
      return mainTab.value === MAIN_TAB_TYPE.NEWS || mainTab.value === MAIN_TAB_TYPE.NOTICE;
    });
    const isFollow = ref<boolean>(false);
    const isLike = ref<boolean>(false);
    const openYn = ref(true);
    const likeCount = ref<number>(0);
    const commentTotalCount = ref<number>(0);
    const topCommentTotalCount = ref<number>(0);
    const loginUser = ref<UserInfoEntityDto>();
    const prevBoardIdx = ref<string>('');
    const nextBoardIdx = ref<string>('');
    const isLoading = computed(() => storeManager.stateStore.isLoading);

    /**
     * 로그인 유저 가져오기
     */
    const getUserInfo = () => {
      const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      if (user) {
        loginUser.value = JSON.parse(user);
      }
    };

    const getBoardDetailFunc = async () => {
      storeManager.stateStore.setLoading(true);
      const param = new BoardEntityDto();
      // param.boardIdx = route.query.boardIdx as string;
      param.boardIdx = route.params.boardIdx as string;
      await getBoardDetail(apiClient, param)
        .then(res => {
          if (res.resultCode !== 0) {
            console.error(res.resultMsg);
          } else {
            if (res.data) {
              // SEO 작업
              setSeoMeta(res.data.title, res.data.body);
              setOpenGraph(res.data.title, getFirstImageSrc(res.data.body));

              boardDetail.value = res.data;
              isFollow.value = res.data.isFollow;
              isLike.value = res.data.isLike;
              likeCount.value = res.data.likeCount;
              openYn.value = res.data.openYn === STATE_YN.Y;
              storeManager.stateStore.setLoading(false);
            } else {
              alert(t('msg.RESULT_POST_NOT_EXIST'));
              router.back();
            }
          }
        })
        .then(() => {
          if (!openYn.value) {
            if (loginUser.value && loginUser.value.userTypeCode === 'ADMIN') return;
            if (loginUser.value && boardDetail.value?.userIdx === loginUser.value.userIdx) return;
            alert(t('msg.RESULT_PRIVATE_POST'));
            router.back();
          }
        })
        .catch(e => {
          alert(t('msg.RESULT_POST_NOT_EXIST'));
          router.back();
        });
    };

    // 게시글 가져오기
    const getBoardDataList = async () => {
      const param = new SearchBoardDto();
      param.openYn = STATE_YN.Y;
      param.saveState = SAVE_STATE.SAVE;
      param.mainTabCode = MAIN_TAB_TYPE.TUTORIAL;
      param.rows = 8;
      await getBoardListV2(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          console.error(res.resultMsg);
        } else {
          if (res.data) {
            tutorialDataList.value = res.data;
          }
        }
      });
    };

    const onClickGoListBtn = () => {
      router.push({
        name: 'Board',
        params: { mainTab: route.params.mainTab },
        query: {
          ...route.query,
        },
      });
    };

    const getCommentList = async (e?: Event) => {
      let page: number | undefined;
      if (e) {
        page = (e as CustomEvent).detail?.page;
      }
      const param = new SearchBoardCommentDto();
      param.boardIdx = route.params.boardIdx as string;
      param.isTopCommentSearchYn = STATE_YN.Y;
      param.orderType = ORDER_TYPE.NEW;
      param.rows = 10;
      param.page = page ? page : 1;

      await getBoardCommentList(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          console.error(res.resultMsg);
        } else {
          if (res.data) {
            if (!page) {
              commentList.value = [];
            }
            commentList.value = commentList.value.concat(res.data);
            commentTotalCount.value = res.totalCount;
            topCommentTotalCount.value = res.topCommentTotalCount;
          }
        }
      });
    };

    const getBoardPrevNextIdxFunc = async () => {
      const param = new SearchBoardDto();
      param.boardIdx = route.params.boardIdx as string;
      if (route.query.type) param.subTabCode = route.query.type as string;
      await getBoardPrevNextIdx(apiClient, param).then(res => {
        if (res.data && res.resultCode === 0) {
          prevBoardIdx.value = res.data.prevBoardIdx as string;
          nextBoardIdx.value = res.data.nextBoardIdx as string;
        }
      });
    };

    const onClickPrevNextBoardBtn = (boardIdx: string) => {
      router.push({
        name: 'BoardDetail',
        params: { ...route.params, boardIdx: boardIdx },
        query: { ...route.query },
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
      storeManager.stateStore.setPopupMode({
        type: POPUP_TYPE.REPORT_POPUP,
        detail: { targetIdx: boardDetail.value?.boardIdx, targetType: 'BOARD' },
      });
    };
    const onClickEditBtn = () => {
      router.push({
        name: 'Edit',
        params: { boardIdx: route.params.boardIdx },
      });
    };
    const onClickDeleteBtn = async () => {
      const isDelete = confirm(t('msg.RESULT_CONFIRM_DELETE'));
      if (!isDelete) {
        return;
      }
      const param = new BoardEntity();
      param.boardIdx = route.params.boardIdx as string;
      await deleteBoard(apiClient, param).then(res => {
        if (res.resultCode === 0) {
          alert(t('msg.RESULT_DELETE_COMPLETED'));
          router.back();
        } else {
          console.error(res.resultMsg);
        }
      });
    };
    // 좋아요 버튼 누른 경우
    const onClickBoardLikeBtn = async () => {
      // 로그인하지 않은 유저가 댓글을 등록하는 경우 튕기기
      const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      if (!user) {
        alert(t('msg.RESULT_LOGIN_REQUIRED'));
        ssoLogin();
        return;
      }
      const param = new EvaluationEntity();
      param.targetIdx = route.params.boardIdx as string;
      param.targetType = EVAL_TARGET_TYPE.BOARD;
      param.evalCode = EVAL_TYPE.LIKE;
      await updateEvaluation(apiClient, param).then(res => {
        if (res.resultCode === 0) {
          // 화면에 보이는 좋아요 수정 따로 데이터 로드는 하지 않음
          // 서버 로드 줄이기
          if (isLike.value) {
            likeCount.value = Number(likeCount.value) - 1;
          } else {
            likeCount.value = Number(likeCount.value) + 1;
          }
          isLike.value = !isLike.value;
        } else {
          console.error('like function error !');
        }
      });
    };

    const onClickFollowBtn = async () => {
      // 로그인하지 않은 유저가 댓글을 등록하는 경우 튕기기
      const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      if (!user) {
        alert(t('msg.RESULT_LOGIN_REQUIRED'));
        ssoLogin();
        return;
      }
      const param = new UserFollowRecEntity();
      param.targetUserIdx = boardDetail.value?.regrUserIdx;
      await updateFollowUser(apiClient, param).then(res => {
        if (res.resultCode === 0) {
          isFollow.value = !isFollow.value;
        } else {
          console.error('follow function error !');
        }
      });
    };

    // 공유시 카운트 증가
    const addShareCount = async () => {
      const param = new updateBoardStaticsDto();
      param.boardIdx = route.params.boardIdx as string;
      await updateBoardShareCount(apiClient, param).then(res => {
        if (res.resultCode === 0) {
        } else {
          console.error('share function error !');
        }
      });
    };

    const onClickShareBtn = () => {
      copy(AppConfig.FRONT_HOST + route.path);
      addShareCount();
      if (
        !storeManager.stateStore.popupMode ||
        !storeManager.stateStore.popupMode.type ||
        storeManager.stateStore.popupMode.type === POPUP_TYPE.NONE
      ) {
        storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.COPY_TOAST });
        const timer = setTimeout(() => {
          storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.NONE });
          clearTimeout(timer);
        }, 3000);
      }
    };

    // const getSubCategory = () => {
    //   const mainCategory = CATEGORY_INFO.find(category => category.type === mainTab.value);
    //   if (mainCategory) {
    //     const subItem = mainCategory.subItems?.find(subItem => subItem.type === route.query.type);
    //     if (subItem) {
    //       subTabCode.value = subItem.typeCode as string;
    //     }
    //   }
    // };

    onMounted(() => {
      getBoardDetailFunc();
      getCommentList();
      getBoardDataList();
      getUserInfo();
      getBoardPrevNextIdxFunc();
      window.addEventListener('COMMENT_LIST_UPDATE', getCommentList);
    });

    onUnmounted(() => {
      window.removeEventListener('COMMENT_LIST_UPDATE', getCommentList);
      // seo 관련 초기화
      setSeoMeta('APOC COMMUNITY', 'Interactive XR content platform that empowers world to bridge the experiential gap in Metaverse');
      setOpenGraph('APOC COMMUNITY', '');
    });

    return {
      t,
      boardDetail,
      commentList,
      tutorialDataList,
      isAdminBoard,
      isFollow,
      isLike,
      likeCount,
      commentTotalCount,
      topCommentTotalCount,
      loginUser,
      prevBoardIdx,
      nextBoardIdx,
      isLoading,
      moment,
      onClickGoListBtn,
      onClickPrevNextBoardBtn,
      getCommentList,
      onClickReportBtn,
      onClickBoardLikeBtn,
      onClickFollowBtn,
      onClickEditBtn,
      onClickDeleteBtn,
      onClickShareBtn,
    };
  },
});
</script>

<template>
  <div class="board-detail-wrapper">
    <board-detail-skeleton v-if="isLoading"></board-detail-skeleton>
    <section v-if="!isLoading" class="board-detail-header-section">
      <div class="board-detail-header">
        <apoc-button class="back-btn" @click="onClickGoListBtn">← {{ t('backList') }}</apoc-button>
        <div class="board-detail-title">{{ boardDetail?.title }}</div>
        <div class="board-detail-info-area">
          <div class="like info-item" @click="onClickBoardLikeBtn">
            <apoc-button>
              <apoc-image-set
                class="icon"
                :src="isLike ? '/assets/images/board/icon/board-icon-like-y.webp' : '/assets/images/board/icon/board-icon-like-n.webp'"
                :img-sets="3"
            /></apoc-button>
            <span>{{ likeCount }}</span>
          </div>
          <div v-if="!isAdminBoard" class="comment info-item">
            <apoc-image-set class="icon" :src="'/assets/images/board/icon/board-icon-comment.webp'" :img-sets="3" />
            <span>{{ commentTotalCount }}</span>
          </div>
          <div class="regr-user info-item">
            <span>by {{ boardDetail?.userNickname }}</span>
          </div>
          <div class="reg-dt info-item">
            <span>{{ boardDetail && boardDetail?.regDt ? moment(boardDetail?.regDt as Date).format('YY.MM.DD') : '-' }}</span>
          </div>
        </div>
      </div>
    </section>
    <section v-if="!isLoading" class="board-detail-bottom-section">
      <div class="board-detail-bottom">
        <div class="board-detail-body-area">
          <div class="board-detail-body ql-editor">
            <div v-html="boardDetail?.body"></div>
          </div>
        </div>
        <div class="board-user-info-area">
          <div class="board-user-info">
            <div class="user-info">
              <apoc-image-set class="user-profile"></apoc-image-set>
              <div class="user-name">{{ boardDetail?.userNickname }}</div>
            </div>
            <apoc-button v-if="loginUser?.userIdx !== boardDetail?.userIdx" class="follow-btn" :class="{ active: isFollow }" @click="onClickFollowBtn">{{ isFollow ?  t('following' ) : t('follow' ) }}</apoc-button>
          </div>
        </div>
        <div class="back-btn">
          <apoc-button @click="onClickGoListBtn">← {{ t('backList') }}</apoc-button>
        </div>
        <div class="board-detail-info-area">
          <div class="left-area">
            <div class="like info-item" @click="onClickBoardLikeBtn">
              <apoc-button>
                <apoc-image-set
                  class="icon"
                  :src="isLike ? '/assets/images/board/icon/board-icon-like-y.webp' : '/assets/images/board/icon/board-icon-like-n.webp'"
                  :img-sets="3"
              /></apoc-button>
              <span>{{ likeCount }}</span>
            </div>
            <div class="comment info-item" v-if="!isAdminBoard">
              <apoc-image-set class="icon" :src="'/assets/images/board/icon/board-icon-comment.webp'" :img-sets="3" />
              <span>{{ commentTotalCount }}</span>
            </div>
          </div>
          <div class="right-area">
            <apoc-button class="share-btn" @click="onClickShareBtn">{{ t('share') }}</apoc-button>
            <div class="dot">·</div>
            <apoc-button v-if="loginUser?.userIdx !== boardDetail?.userIdx" class="report-btn" @click="onClickReportBtn">{{ t('report') }}</apoc-button>
            <apoc-button v-if="loginUser?.userIdx === boardDetail?.userIdx" class="edit-btn" @click="onClickEditBtn">{{ t('edit') }}</apoc-button>
            <div v-if="loginUser?.userIdx === boardDetail?.userIdx" class="dot">·</div>
            <apoc-button v-if="loginUser?.userIdx === boardDetail?.userIdx" class="delete-btn" @click="onClickDeleteBtn">{{ t('delete') }}</apoc-button>
          </div>
        </div>
        <div v-if="isAdminBoard" class="before-after-btn-area">
          <div class="left-area">
            <apoc-button v-if="prevBoardIdx" class="before-btn before-after-btn" @click="onClickPrevNextBoardBtn(prevBoardIdx)">{{ t('before') }}</apoc-button>
          </div>
          <div class="right-area">
            <apoc-button v-if="nextBoardIdx" class="before-btn before-after-btn" @click="onClickPrevNextBoardBtn(nextBoardIdx)">{{ t('after') }}</apoc-button>
          </div>
        </div>

        <div class="comment-list">
          <comment-wrapper
            v-if="!isAdminBoard"
            :comment-list="commentList"
            :comment-total-count="commentTotalCount"
            :top-comment-total-count="topCommentTotalCount"
            @on-click-go-list-btn="onClickGoListBtn" />
        </div>
        <div v-if="!isAdminBoard" class="tutorial-card-list-section">
          <div class="tutorial-title">{{ t('board.howAboutContent') }}</div>
          <div class="tutorial-card-list">
            <board-list-card-item v-for="item in tutorialDataList" :key="item.boardIdx" :board="item" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
