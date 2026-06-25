<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ApocPagination from '@/components/common/ApocPagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getApiClient } from '@/utils/apiClient';
import { getBoardList } from '@/api/board.api';
import dayjs from 'dayjs';
import { STATE_YN, TYPE_BOARD } from '@/types';
import { useAsyncData } from '@/composables/useAsyncData';

export default defineComponent({
  name: 'adminNotice',
  components: { ApocPagination, EmptyState },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const totalPage = ref<number>(0); // 총 페이지
    const apiClient = getApiClient();
    const notices = ref<BoardEntity[]>([]);
    const searchKeyword = ref<string>('');
    const ROWS_PER_PAGE = 10; // 한 페이지당 10개
    const { isLoading, error, run } = useAsyncData();

    const loadBoardLit = () =>
      run(async () => {
        const currentPage = route.query.pageNo ? Number(route.query.pageNo) : 1;
        const param = new SearchBoardDto();
        param.boardType = TYPE_BOARD.NORMAL;
        param.keyword = searchKeyword.value || undefined;
        param.page = currentPage;
        param.rows = ROWS_PER_PAGE;

        const res = await getBoardList(apiClient, param);
        if (res.resultCode === 0 && res.data) {
          notices.value = res.data;
          // totalCount를 사용하여 totalPage 계산
          totalPage.value = res.totalCount ? Math.ceil(res.totalCount / ROWS_PER_PAGE) : 0;
        }
      });

    const handleSearch = () => {
      // 검색 시 1페이지로 이동하고 데이터 로드
      router.push({ query: { ...route.query, pageNo: 1 } });
      loadBoardLit();
    };

    const assignNotice = () => {
      router.push('/admin/notice/assign');
    };

    const goToDetail = (boardIdx: string | undefined) => {
      if (boardIdx) {
        router.push(`/admin/notice/detail?id=${boardIdx}`);
      }
    };

    // 페이지 번호 변경 감지
    watch(
      () => route.query.pageNo,
      () => {
        loadBoardLit();
      }
    );

    onMounted(() => {
      loadBoardLit();
    });
    return {
      notices,
      totalPage,
      dayjs,
      STATE_YN,
      searchKeyword,
      isLoading,
      error,
      loadBoardLit,
      handleSearch,
      assignNotice,
      goToDetail,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>공지사항</h1>

    <!-- 검색바와 등록 버튼 -->
    <div class="search-action-wrapper">
      <div class="search-bar-wrapper">
        <input v-model="searchKeyword" type="text" placeholder="제목으로 검색..." class="search-input" @keyup.enter="handleSearch" />
        <button class="search-button" @click="handleSearch">검색</button>
      </div>
      <button class="register-button" @click="assignNotice">공지사항 등록</button>
    </div>

    <!-- 로딩 / 에러 상태 -->
    <div v-if="isLoading" class="list-status">불러오는 중…</div>
    <div v-else-if="error" class="list-status list-status--error">
      {{ error }}
      <button class="retry-button" @click="loadBoardLit">다시 시도</button>
    </div>

    <!-- 결과가 있을 때 -->
    <div v-else-if="notices.length > 0" class="notice-list">
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
        <div class="row-content desktop-only clickable" :class="{ important: notice.bestYn === STATE_YN.Y }" @click="goToDetail(notice.boardIdx)">
          <div class="col important">
            <img v-if="notice.bestYn === STATE_YN.Y" src="/assets/images/board/important.png" />
            <div v-else></div>
          </div>
          <div class="col index">{{ index + 1 }}</div>

          <div class="col title">{{ notice.title }}</div>
          <div class="col views">{{ notice.views }}</div>
          <div class="col author">{{ notice.author }}</div>
          <div class="col date">{{ dayjs(notice.modDt).format('YY.MM.DD') }}</div>
        </div>

        <!-- 모바일 카드 -->
        <div class="mobile-only mobile-card clickable" :class="{ important: notice.bestYn === STATE_YN.Y }" @click="goToDetail(notice.boardIdx)">
          <div class="title">
            <img class="impor-icon" v-if="notice.bestYn === STATE_YN.Y" src="/assets/images/board/important.png" />
            {{ notice.title }}
          </div>
          <div class="meta">
            <span>{{ notice.author }}</span> · <span>{{ dayjs(notice.modDt).format('YY.MM.DD') }}</span> ·
            <span>조회수 {{ notice.views }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 결과가 없을 때 -->
    <empty-state v-else message="등록된 공지사항이 없습니다" />
    <section class="pagination-section">
      <apoc-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>

<style scoped>
/* 로딩/에러 상태 표시 */
.list-status {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  font-size: 15px;
}

.list-status--error {
  color: #c0392b;
}

.retry-button {
  display: inline-block;
  margin-left: 0.75rem;
  padding: 0.4rem 1rem;
  border: 1px solid #c0392b;
  border-radius: 6px;
  background: #fff;
  color: #c0392b;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background: #c0392b;
  color: #fff;
}

/* 검색바와 등록 버튼을 감싸는 래퍼 */
.search-action-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem auto 3rem;
  padding: 0 1rem;
}

.search-bar-wrapper {
  max-width: 600px;
  flex: 0 1 600px;
  margin: 0;
}

/* 등록 버튼 */
.register-button {
  padding: 1.2rem 2rem;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  background: #736e92;
  color: white;
  border: none;
}

.register-button:hover {
  background: #5f5a7a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(115, 110, 146, 0.3);
}

.register-button:active {
  transform: translateY(0);
}

/* 반응형 */
@media (max-width: 768px) {
  .search-action-wrapper {
    flex-direction: column;
    width: 100%;
  }

  .search-bar-wrapper {
    flex: 1;
    max-width: 100%;
    width: 100%;
  }

  .register-button {
    width: 100%;
  }
}
</style>
