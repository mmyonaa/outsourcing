<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import BasePagination from '@/components/common/BasePagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import ListRowSkeleton from '@/components/common/ListRowSkeleton.vue';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getApiClient } from '@/utils/apiClient';
import { getBoardList } from '@/api/board.api';
import dayjs from 'dayjs';
import { STATE_YN } from '@/types';
import { useAdminList } from '@/composables/useAdminList';

/**
 * 관리자 공지사항/보도자료 목록 공용 페이지.
 * AdminNews / AdminNotice 가 문구·타입만 다른 복붙이어서 통합.
 */
export default defineComponent({
  name: 'adminBoardListPage',
  components: { BasePagination, EmptyState, ErrorState, ListRowSkeleton },
  props: {
    /** TYPE_BOARD 값 (NORMAL/NEWS) */
    boardType: { type: String, required: true },
    /** 관리자 경로 prefix (예: '/admin/news') — 등록/상세 이동에 사용 */
    basePath: { type: String, required: true },
    /** h1 제목 (예: '보도자료') */
    title: { type: String, required: true },
    /** 등록 버튼 라벨 (예: '보도자료 등록') */
    registerLabel: { type: String, required: true },
    /** 빈 목록 문구 (예: '등록된 보도자료가 없습니다') */
    emptyMessage: { type: String, required: true },
  },
  setup(props) {
    const router = useRouter();
    const apiClient = getApiClient();

    const ROWS_PER_PAGE = 10;
    const {
      items: notices,
      totalPage,
      currentPage,
      searchKeyword,
      isLoading,
      error,
      load: loadBoardList,
      goFirstPageAndLoad: handleSearch,
    } = useAdminList<BoardEntity, SearchBoardDto>({
      rows: ROWS_PER_PAGE,
      buildParam: ({ page, rows, keyword }) => {
        const param = new SearchBoardDto();
        param.boardType = props.boardType;
        param.keyword = keyword;
        param.page = page;
        param.rows = rows;
        return param;
      },
      fetch: param => getBoardList(apiClient, param),
    });

    const assignNotice = () => {
      router.push(`${props.basePath}/assign`);
    };

    const goToDetail = (boardIdx: string | undefined) => {
      if (boardIdx) {
        router.push(`${props.basePath}/detail?id=${boardIdx}`);
      }
    };

    return {
      notices,
      totalPage,
      currentPage,
      ROWS_PER_PAGE,
      dayjs,
      STATE_YN,
      searchKeyword,
      isLoading,
      error,
      loadBoardList,
      handleSearch,
      assignNotice,
      goToDetail,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>{{ title }}</h1>

    <!-- 검색바와 등록 버튼 -->
    <div class="search-action-wrapper">
      <div class="search-bar-wrapper">
        <input v-model="searchKeyword" type="text" placeholder="제목으로 검색..." class="search-input" @keyup.enter="handleSearch" />
        <button class="search-button" @click="handleSearch">검색</button>
      </div>
      <button class="register-button" @click="assignNotice">{{ registerLabel }}</button>
    </div>

    <!-- 로딩 / 에러 상태 -->
    <div v-if="isLoading" class="notice-list">
      <list-row-skeleton v-for="n in 8" :key="n" />
    </div>
    <error-state v-else-if="error" @retry="loadBoardList" />

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
        <div class="row-content desktop-only clickable" :class="{ important: notice.bestYn === STATE_YN.Y }" tabindex="0" role="link" @click="goToDetail(notice.boardIdx)" @keydown.enter="goToDetail(notice.boardIdx)">
          <div class="col important">
            <img v-if="notice.bestYn === STATE_YN.Y" src="/assets/images/board/important.png" />
            <div v-else></div>
          </div>
          <div class="col index">{{ (currentPage - 1) * ROWS_PER_PAGE + index + 1 }}</div>

          <div class="col title">{{ notice.title }}</div>
          <div class="col views">{{ notice.views }}</div>
          <div class="col author">{{ notice.author }}</div>
          <div class="col date">{{ dayjs(notice.modDt).format('YY.MM.DD') }}</div>
        </div>

        <!-- 모바일 카드 -->
        <div class="mobile-only mobile-card clickable" :class="{ important: notice.bestYn === STATE_YN.Y }" tabindex="0" role="link" @click="goToDetail(notice.boardIdx)" @keydown.enter="goToDetail(notice.boardIdx)">
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
    <empty-state v-else :message="emptyMessage" />
    <section class="pagination-section">
      <base-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>

<style scoped>
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
