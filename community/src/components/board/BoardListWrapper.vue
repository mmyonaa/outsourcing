<script lang="ts">
import { getBoardListV2 } from '@/api/board.api';
import { BoardEntityDto, SearchBoardDto } from '@/api/dto/board.dto';
import { CategoryEntityV2, ICategory } from '@/api/dto/category.dto';
import BoardListCardItem from '@/components/board/BoardListCardItem.vue';
import BoardListItem from '@/components/board/BoardListItem.vue';
import ApocButton from '@/components/common/ApocButton.vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import BoardListSkeleton from '@/components/common/BoardListSkeleton.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { MAIN_TAB_TYPE, ORDER_TYPE, SAVE_STATE, STATE_YN, SUB_TAB_TYPE, VIEW_MODE_TYPE } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { decodeHTMLEntities, getBoardSrcImg, loadLocalData, ssoLogin } from '@/utils/common-util';
import { type PropType, computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'BoardListWrapper',
  components: { ApocButton, BoardListSkeleton, ApocPagination, BoardListCardItem, ApocImageSet, BoardListItem },
  props: {
    curMainTabInfo: {
      type: Object as PropType<CategoryEntityV2>,
    },
  },
  setup(props) {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const router = useRouter();
    const route = useRoute();
    const curSubTabInfo = ref<ICategory>(); // 현재 페이지 서브탭
    const curTagQuery = computed(() => (route.query.tag ? route.query.tag : undefined)); // 현제 페이지 활성 탭
    const boardDataList = ref<BoardEntityDto[]>([]); // 데이터 리스트
    const boardHeaderEl = ref<HTMLElement | null>(null); //board 헤더 태그
    const totalPage = ref<number>(0); // 총 페이지
    const pagesPerGroup = ref(AppConfig.KEYS.PAGING_ROW); // 한 묶음당 노출할 페이지 수 기본 20
    const isLoading = computed(() => storeManager.stateStore.isLoading);
    const viewMode = computed(() =>
      props.curMainTabInfo && props.curMainTabInfo?.categoryCode !== MAIN_TAB_TYPE.TUTORIAL ? VIEW_MODE_TYPE.LIST : VIEW_MODE_TYPE.CARD,
    );
    const boardSrc = ref<string>('');

    // tag 스크롤 관련 변수
    const tagContainer = ref<HTMLElement | null>(null);
    const isClickTag = ref(false);
    const tagStartX = ref(0);
    const tagScrollLeft = ref(0);
    const isCheckUser = ref<boolean>(false);
    const lang = ref<string>('');

    /**
     * Function
     */
    // 게시글 가져오기
    const getBoardDataList = async () => {
      // 스크롤 초기화
      // window.scrollTo(0, 0);
      storeManager.stateStore.setLoading(true);
      const param = new SearchBoardDto();
      settingParameter(param);
      param.orderType = ORDER_TYPE.NEW;
      await getBoardListV2(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          console.error(res.resultMsg);
        } else {
          if (res.data) {
            boardDataList.value = res.data;
            removeHTMLtag(boardDataList.value);
            totalPage.value = Math.ceil(res.totalCount / pagesPerGroup.value);
          }
        }
        storeManager.stateStore.setLoading(false);
      });
    };

    const settingParameter = (param: SearchBoardDto) => {
      param.openYn = STATE_YN.Y;
      param.saveState = SAVE_STATE.SAVE;
      param.page = route.query.pageNo ? Number(route.query.pageNo) : 1;
      param.rows = pagesPerGroup.value;
      if (curSubTabInfo.value && curSubTabInfo.value?.categoryCode) param.subTabCode = curSubTabInfo.value?.categoryCode;
      if (typeof curTagQuery.value === 'string') param.tagCode = curTagQuery.value;

      // 마이페이지일 경우
      if ((route.name as string).toUpperCase() === MAIN_TAB_TYPE.MYPAGE) {
        if (route.query.type === SUB_TAB_TYPE.MY_CONTENTS) {
          param.myContents = STATE_YN.Y;
        } else if (route.query.type === SUB_TAB_TYPE.LIKE_CONTENTS) {
          param.likeContents = STATE_YN.Y;
        }
        param.subTabCode = undefined;
        param.tagCode = undefined;
      }
    };

    // HTML 태그 제거
    const removeHTMLtag = (item: BoardEntityDto[]) => {
      item.forEach((i: BoardEntityDto) => {
        if (!i.body) return;
        // 이미지태그 제거 및 모든 태그를 p태그 처리
        i.body = i.body.replace(/<[^>]*>?/g, ' ');
        i.body = `<p>${i.body}</p>`;
        i.body = decodeHTMLEntities(i.body);
      });
    };

    // 현재 탭에 대한 정보를 가져옵니다
    const getCategoryInfo = async () => {
      if (route.params && route.query.type && props.curMainTabInfo) {
        // 사이드바 값 받아오기
        curSubTabInfo.value = props.curMainTabInfo.subTab?.find(v => v.categoryCode === (route.query.type as string));
        // 게시판 타입별 row 다름
        pagesPerGroup.value = viewMode.value === VIEW_MODE_TYPE.LIST ? 10 : 12;
        // 게시판 이미지 가져오기
        boardSrc.value = getBoardSrcImg(curSubTabInfo.value?.categoryCode as SUB_TAB_TYPE);
      }
    };

    // 스크롤 동작에 따른 화면 애니메이션
    const handleScroll = () => {
      if (!(boardHeaderEl.value instanceof HTMLElement)) return;
      if (typeof Window === 'undefined') return;
      const scrollPosition = window.scrollY || window.document.documentElement.scrollTop;
      if (scrollPosition > 0) {
        if (!boardHeaderEl.value.classList.contains('scroll')) {
          boardHeaderEl.value.classList.add('scroll');
          // window.scrollTo({ top: 25 }); // 상단의 경우 이미지 사이즈 - 스크롤 동작시 이미지 사이즈 + 1
        }
      } else {
        boardHeaderEl.value.classList.remove('scroll');
      }
    };

    // 태그가 클릭되는 경우
    const onClickTag = (tagInfo?: ICategory) => {
      if (!tagInfo) {
        // All인 경우 tag 쿼리 삭제
        const { tag, ...filterQuery } = route.query;
        router.replace({ query: { ...filterQuery, pageNo: 1 } });
      } else {
        // 이외의 경우 tag 쿼리 추가
        router.replace({ query: { ...route.query, tag: tagInfo.categoryCode, pageNo: 1 } });
      }
    };
    // 해당 태그가 활성화 되었는지
    const isTagActive = (tag: string) => {
      tag = tag.toUpperCase().replace(' ', '_');
      return route.query.tag === tag;
    };

    const onClickBoard = (boardIdx: string) => {
      router.push({
        name: 'BoardDetail',
        params: { ...route.params, boardIdx: boardIdx },
        query: { ...route.query },
      });
    };

    const onClickWriteBtn = () => {
      if (!isCheckUser.value) {
        alert(t('msg.RESULT_LOGIN_REQUIRED'));
        ssoLogin();
      } else {
        storeManager.dataStore.setBeforePageCategory(curSubTabInfo.value as ICategory);
        router.push({ name: 'Write' });
      }
    };
    const tagMouseDown = (e: MouseEvent) => {
      if (tagContainer.value instanceof HTMLElement) {
        isClickTag.value = true;
        tagStartX.value = e.pageX - tagContainer.value.offsetLeft;
        tagScrollLeft.value = tagContainer.value.scrollLeft;
        tagContainer.value.style.cursor = 'grabbing';
      }
    };

    const tagMouseLeave = () => {
      if (tagContainer.value instanceof HTMLElement) {
        isClickTag.value = false;
        tagContainer.value.style.cursor = 'grab';
      }
    };

    const tagMouseUp = () => {
      if (tagContainer.value instanceof HTMLElement) {
        isClickTag.value = false;
        tagContainer.value.style.cursor = 'grab';
      }
    };

    const tagMouseMove = (e: MouseEvent) => {
      if (!isClickTag.value) return;
      if (tagContainer.value instanceof HTMLElement) {
        e.preventDefault();
        const x = e.pageX - tagContainer.value.offsetLeft;
        const walk = (x - tagStartX.value) * 2; // scroll-fast
        tagContainer.value.scrollLeft = tagScrollLeft.value - walk;
      }
    };

    const checkUserInfo = () => {
      const token = loadLocalData(AppConfig.KEYS.LOGIN_TOKEN);
      if (token) {
        isCheckUser.value = true;
      } else {
        isCheckUser.value = false;
      }
    };
    /**
     * Watch
     */
    // 메인탭과 쿼리 변경시 데이터 새로 수집
    watch(
      () => [route.query.type, props.curMainTabInfo],
      () => {
        getCategoryInfo();
        getBoardDataList();
        checkUserInfo();
      },
    );

    /**
     * Lifecycle Hooks
     */
    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('touchmove', handleScroll, { passive: true });
      lang.value = loadLocalData(AppConfig.KEYS.LANG) as string;
      // getCategoryInfo();
      // getBoardDataList();
    });
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    });
    return {
      t,
      curSubTabInfo,
      boardDataList,
      boardHeaderEl,
      totalPage,
      isLoading,
      viewMode,
      boardSrc,
      lang,
      onClickTag,
      isTagActive,
      onClickBoard,
      onClickWriteBtn,
      tagMouseDown,
      tagMouseLeave,
      tagMouseUp,
      tagMouseMove,
      tagContainer,
    };
  },
  computed: {
    MAIN_TAB_TYPE() {
      return MAIN_TAB_TYPE;
    },
    VIEW_MODE_TYPE() {
      return VIEW_MODE_TYPE;
    },
  },
});
</script>

<template>
  <div class="partition">
    <section ref="boardHeaderEl" class="board-header-section">
      <div class="board-header-wrapper">
        <apoc-image-set class="icon" :src="boardSrc" :img-sets="3" />
        <!--        <apoc-image-set class="icon" :src="boardSrc" />-->
        <div class="board-title-area">
          <div class="title">
            <span>{{ lang === 'ko' ? curSubTabInfo?.categoryKrName : curSubTabInfo?.categoryEnName }}</span>
          </div>
          <div v-if="curMainTabInfo?.categoryCode === MAIN_TAB_TYPE.BOARD" class="write-btn" @click="onClickWriteBtn">
            <apoc-button>{{ t('write') }}</apoc-button>
          </div>
        </div>
      </div>
    </section>
    <!-- 게시판 header 타이틀 -->
    <section class="board-main-section">
      <!-- 게시판 태그 셀렉터 -->
      <section
        v-if="curSubTabInfo?.tag"
        class="board-tag-section"
        @mousedown="tagMouseDown"
        @mouseleave="tagMouseLeave"
        @mouseup="tagMouseUp"
        @mousemove="tagMouseMove"
        ref="tagContainer">
        <div class="tag" :class="{ active: !$route.query.tag }" @click="onClickTag()">
          <span>ALL</span>
        </div>
        <div
          v-for="item in curSubTabInfo?.tag"
          :key="item.categoryCode"
          class="tag"
          :class="{ active: isTagActive(item?.categoryCode) }"
          @click="onClickTag(item)">
          <span>{{ lang === 'ko' ? item?.categoryKrName : item?.categoryEnName }}</span>
        </div>
      </section>
      <section class="empty-section" v-if="!isLoading && boardDataList.length === 0">
        <div class="empty">
          <div>{{ t('noPosts') }}</div>
        </div>
      </section>
      <!-- 게시판 리스트 영역 어떤 타입으로 노출 할것 인지-->
      <section v-if="viewMode === VIEW_MODE_TYPE.LIST" class="board-list-section" :class="{'tag-exist':curSubTabInfo?.tag}">
        <board-list-skeleton v-if="isLoading" :view-mode="VIEW_MODE_TYPE.LIST" :view-count="10" />
        <div v-else class="board-list-area">
          <board-list-item
            v-for="item in boardDataList"
            :key="item.boardIdx"
            :board="item"
            :is-like="true"
            :is-comment="curMainTabInfo?.categoryCode === MAIN_TAB_TYPE.BOARD"
            :is-regr-user="true"
            :is-reg-dt="true"
            @click="onClickBoard(item.boardIdx as string)" />
        </div>
      </section>
      <section v-else-if="viewMode === VIEW_MODE_TYPE.CARD" class="board-card-list-section" :class="{'tag-exist':curSubTabInfo?.tag}">
        <board-list-skeleton v-if="isLoading" :view-mode="VIEW_MODE_TYPE.CARD" :view-count="8" />
        <div v-else class="board-card-list-area">
          <board-list-card-item v-for="item in boardDataList" :key="item.boardIdx" :board="item" @click="onClickBoard(item.boardIdx as string)" />
        </div>
      </section>
      <section class="pagination-section">
        <apoc-pagination :total-page-num="totalPage" />
      </section>
    </section>
  </div>
</template>
