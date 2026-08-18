<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BasePagination from '@/components/common/BasePagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import ListRowSkeleton from '@/components/common/ListRowSkeleton.vue';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getApiClient } from '@/utils/apiClient';
import { getBoardList } from '@/api/board.api';
import dayjs from 'dayjs';
import { STATE_YN } from '@/types';
import SectionTabs from '@/components/common/SectionTabs.vue';

/**
 * 공지사항/보도자료 목록 공용 페이지.
 * News.vue / Notice.vue 가 문구·타입만 다른 복붙이어서 하나로 합치고,
 * 각 뷰는 props 만 주입하는 얇은 래퍼로 남긴다.
 */
export default defineComponent({
  name: 'boardListPage',
  components: { BasePagination, EmptyState, ErrorState, ListRowSkeleton, SectionTabs },
  props: {
    /** TYPE_BOARD 값 (NORMAL/NEWS) */
    boardType: { type: String, required: true },
    /** 이 페이지의 라우트 name — 상세로 이탈할 때 pageNo watch 가드에 사용 */
    routeName: { type: String, required: true },
    /** 상세 경로 prefix (예: '/news') */
    detailPathPrefix: { type: String, required: true },
    /** h1 제목 (예: '보도자료') */
    title: { type: String, required: true },
    /** 빈 목록/검색 결과 문구에 쓰는 항목 명칭 (예: '보도자료') */
    itemLabel: { type: String, required: true },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const totalPage = ref<number>(0); // 총 페이지
    const totalCount = ref<number>(0); // 전체 결과 수 (결과 카운트 표시용)
    const appliedKeyword = ref<string>(''); // 실제 조회에 사용된 검색어
    const apiClient = getApiClient();
    const notices = ref<BoardEntity[]>([]);
    const loading = ref<boolean>(true);
    const error = ref<boolean>(false);
    const searchKeyword = ref<string>('');
    const ROWS_PER_PAGE = 10; // 한 페이지당 10개
    const currentPage = computed(() => (route.query.pageNo ? Number(route.query.pageNo) : 1));

    const loadBoardList = async () => {
      const param = new SearchBoardDto();
      param.boardType = props.boardType;
      param.keyword = searchKeyword.value || undefined;
      param.page = currentPage.value;
      param.rows = ROWS_PER_PAGE;
      appliedKeyword.value = searchKeyword.value;

      loading.value = true;
      error.value = false; // 재시도 시 에러 화면이 영영 남지 않도록 리셋
      await getBoardList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data) {
            notices.value = res.data;
            // totalCount를 사용하여 totalPage 계산
            totalCount.value = res.totalCount || 0;
            totalPage.value = Math.ceil(totalCount.value / ROWS_PER_PAGE);
          }
        })
        .catch(e => {
          console.error(e);
          error.value = true;
        })
        .finally(() => {
          loading.value = false;
        });
    };

    // 1페이지로 이동 후 재조회. 로드는 pageNo watch 한 곳에서만 트리거한다.
    // (push + 직접 load() 를 같이 하면 같은 요청이 2번 나가고, 응답 순서에 따라
    //  이전 페이지 결과가 화면을 덮는 레이스가 있었다)
    const goFirstPageAndLoad = () => {
      if (currentPage.value === 1) loadBoardList();
      else router.push({ query: { ...route.query, pageNo: 1 } });
    };

    const handleSearch = () => {
      goFirstPageAndLoad();
    };

    const resetSearch = () => {
      searchKeyword.value = '';
      goFirstPageAndLoad();
    };

    const goToDetail = (boardIdx: string | undefined) => {
      if (boardIdx) {
        router.push(`${props.detailPathPrefix}/${boardIdx}`);
      }
    };

    // 페이지 번호 변경 감지
    watch(
      () => route.query.pageNo,
      () => {
        // 상세로 이탈할 때도 pageNo가 사라지며 watch가 발동하므로, 이 페이지일 때만 로드
        if (route.name !== props.routeName) return;
        loadBoardList();
      },
    );

    onMounted(() => {
      loadBoardList();
    });
    return {
      notices,
      loading,
      error,
      loadBoardList,
      currentPage,
      ROWS_PER_PAGE,
      totalPage,
      totalCount,
      appliedKeyword,
      dayjs,
      STATE_YN,
      searchKeyword,
      handleSearch,
      resetSearch,
      goToDetail,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>{{ title }}</h1>
    <section-tabs />

    <!-- 검색바 -->
    <div class="search-bar-wrapper">
      <input v-model="searchKeyword" type="text" placeholder="제목으로 검색..." class="search-input" @keyup.enter="handleSearch" />
      <button class="search-button" @click="handleSearch">검색</button>
      <button class="reset-button" @click="resetSearch">
        <span class="reset-icon">↻</span>
        초기화
      </button>
    </div>

    <!-- 결과 카운트 -->
    <div v-if="!loading && !error" class="results-meta">
      총 <strong>{{ totalCount }}</strong>개
      <span v-if="appliedKeyword" class="meta-chip">‘{{ appliedKeyword }}’ 검색</span>
    </div>

    <!-- 로딩 중 -->
    <div v-if="loading" class="notice-list">
      <list-row-skeleton v-for="n in 8" :key="`sk-${n}`" />
    </div>

    <!-- 불러오기 실패 -->
    <error-state v-else-if="error" @retry="loadBoardList" />

    <!-- 결과가 있을 때 -->
    <div v-reveal v-else-if="notices.length > 0" class="notice-list">
      <!-- 데스크탑용 테이블 -->
      <div class="notice-header desktop-only">
        <div class="col important"></div>
        <div class="col index">#</div>
        <div class="col title">제목</div>
        <div class="col views">조회수</div>
        <div class="col author">작성자</div>
        <div class="col date">작성일</div>
      </div>

      <div class="notice-row" v-for="(notice, index) in notices" :key="notice.boardIdx">
        <!-- 데스크탑 행 -->
        <div class="row-content desktop-only clickable" :class="{ important: notice.bestYn === STATE_YN.Y }" tabindex="0" role="link" @click="goToDetail(notice.boardIdx)" @keydown.enter="goToDetail(notice.boardIdx)">
          <div class="col important">
            <img v-if="notice.bestYn === STATE_YN.Y" src="/assets/images/board/important.png" />
            <div v-else></div>
          </div>
          <div class="col index">{{ (currentPage - 1) * ROWS_PER_PAGE + index + 1 }}</div>

          <div class="col title">{{ notice.title }}</div>
          <div class="col views">{{ notice.views }}</div>
          <div class="col author">{{ notice.author }}</div>
          <div class="col date">{{ dayjs(notice.regDt).format('YY.MM.DD') }}</div>
        </div>

        <!-- 모바일 카드 -->
        <div class="mobile-only mobile-card clickable" :class="{ important: notice.bestYn === STATE_YN.Y }" tabindex="0" role="link" @click="goToDetail(notice.boardIdx)" @keydown.enter="goToDetail(notice.boardIdx)">
          <div class="title">
            <img class="impor-icon" v-if="notice.bestYn === STATE_YN.Y" src="/assets/images/board/important.png" />
            {{ notice.title }}
          </div>
          <div class="meta">
            <span>{{ notice.author }}</span> · <span>{{ dayjs(notice.regDt).format('YY.MM.DD') }}</span> ·
            <span>조회수 {{ notice.views }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 결과가 없을 때 -->
    <empty-state
      v-else
      :message="appliedKeyword ? `'${appliedKeyword}'에 대한 검색 결과가 없습니다` : `등록된 ${itemLabel} 없습니다`"
      :action-label="appliedKeyword ? '검색 초기화' : ''"
      @action="resetSearch" />
    <section class="pagination-section">
      <base-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>
