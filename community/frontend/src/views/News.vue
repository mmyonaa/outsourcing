<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BasePagination from '@/components/common/BasePagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import ListRowSkeleton from '@/components/common/ListRowSkeleton.vue';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getApiClient } from '@/utils/apiClient';
import { getBoardList, updateBoard } from '@/api/board.api';
import dayjs from 'dayjs';
import { STATE_YN, TYPE_BOARD } from '@/types';

export default defineComponent({
  name: 'news',
  components: { BasePagination, EmptyState, ErrorState, ListRowSkeleton },
  setup() {
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

    const loadBoardLit = async () => {
      const currentPage = route.query.pageNo ? Number(route.query.pageNo) : 1;
      const param = new SearchBoardDto();
      param.boardType = TYPE_BOARD.NEWS;
      param.keyword = searchKeyword.value || undefined;
      param.page = currentPage;
      param.rows = ROWS_PER_PAGE;
      appliedKeyword.value = searchKeyword.value;

      loading.value = true;
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

    const handleSearch = () => {
      // 검색 시 1페이지로 이동하고 데이터 로드
      router.push({ query: { ...route.query, pageNo: 1 } });
      loadBoardLit();
    };

    const resetSearch = () => {
      searchKeyword.value = '';
      // 초기화 시 1페이지로 이동하고 데이터 로드
      router.push({ query: { ...route.query, pageNo: 1 } });
      loadBoardLit();
    };

    const goToDetail = (boardIdx: string | undefined) => {
      if (boardIdx) {
        router.push(`/news/${boardIdx}`);
      }
    };

    // 페이지 번호 변경 감지
    watch(
      () => route.query.pageNo,
      () => {
        loadBoardLit();
      },
    );

    onMounted(() => {
      loadBoardLit();
    });
    return {
      notices,
      loading,
      error,
      loadBoardLit,
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
    <h1>보도자료</h1>

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
    <error-state v-else-if="error" @retry="loadBoardLit" />

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
          <div class="col index">{{ index + 1 }}</div>

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
      :message="appliedKeyword ? `'${appliedKeyword}'에 대한 검색 결과가 없습니다` : '등록된 보도자료가 없습니다'"
      :action-label="appliedKeyword ? '검색 초기화' : ''"
      @action="resetSearch" />
    <section class="pagination-section">
      <base-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>
