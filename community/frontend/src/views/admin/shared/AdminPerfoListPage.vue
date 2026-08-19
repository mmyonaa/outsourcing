<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import BasePagination from '@/components/common/BasePagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import ListRowSkeleton from '@/components/common/ListRowSkeleton.vue';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getApiClient } from '@/utils/apiClient';
import { getPerfoList } from '@/api/perfo.api';
import { handleImageError } from '@/utils/common-util';
import { getCategoryLabel } from '@/utils/perfo-util';
import dayjs from 'dayjs';
import { STATE_YN, TYPE_PERFO_CATEGORY } from '@/types';
import { useAdminList } from '@/composables/useAdminList';

/**
 * 관리자 자체/대관 프로그램 목록 공용 페이지.
 * AdminPerformance / AdminPerformanceNext 가 문구·타입만 다른 복붙이어서 통합.
 */
export default defineComponent({
  name: 'adminPerfoListPage',
  components: { BasePagination, EmptyState, ErrorState, ListRowSkeleton },
  props: {
    /** TYPE_PERFO 값 (NORMAL/NEXT) */
    perType: { type: String, required: true },
    /** 관리자 경로 prefix (예: '/admin/performance') — 등록/상세 이동에 사용 */
    basePath: { type: String, required: true },
    /** h1 제목 (예: '자체 프로그램 관리') */
    title: { type: String, required: true },
  },
  setup(props) {
    const router = useRouter();
    const apiClient = getApiClient();
    const selectedCategory = ref<string>('');

    const ROWS_PER_PAGE = 8;
    const {
      items: perfos,
      totalPage,
      currentPage,
      searchKeyword,
      isLoading,
      error,
      load: loadPerfoList,
      goFirstPageAndLoad,
    } = useAdminList<PerfoEntity, SearchPerfoDto>({
      rows: ROWS_PER_PAGE,
      buildParam: ({ page, rows, keyword }) => {
        const param = new SearchPerfoDto();
        param.perType = props.perType;
        param.keyword = keyword;
        param.category = selectedCategory.value || undefined;
        param.page = page;
        param.rows = rows;
        return param;
      },
      fetch: param => getPerfoList(apiClient, param),
    });

    const handleSearch = goFirstPageAndLoad;

    const filterByCategory = (category: string) => {
      selectedCategory.value = selectedCategory.value === category ? '' : category;
      goFirstPageAndLoad();
    };

    const assignPerfo = () => {
      router.push(`${props.basePath}/assign`);
    };

    const resetFilters = () => {
      searchKeyword.value = '';
      selectedCategory.value = '';
      goFirstPageAndLoad();
    };

    const goToDetail = (perIdx: string | undefined) => {
      if (perIdx) {
        router.push(`${props.basePath}/detail?id=${perIdx}`);
      }
    };

    return {
      perfos,
      totalPage,
      currentPage,
      ROWS_PER_PAGE,
      dayjs,
      STATE_YN,
      searchKeyword,
      selectedCategory,
      isLoading,
      error,
      assignPerfo,
      loadPerfoList,
      handleSearch,
      filterByCategory,
      getCategoryLabel,
      resetFilters,
      handleImageError,
      goToDetail,
      TYPE_PERFO_CATEGORY,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>{{ title }}</h1>

    <!-- 검색바와 카테고리 필터 -->
    <div class="search-category-container">
      <!-- 카테고리 필터 버튼 (공개 목록과 동일한 칩 디자인) -->
      <div class="category-filter-wrapper">
        <div class="category-chips">
          <button
            class="category-filter-btn category-perfo"
            :class="{ active: selectedCategory === TYPE_PERFO_CATEGORY.PERFO }"
            @click="filterByCategory(TYPE_PERFO_CATEGORY.PERFO)">
            공연
          </button>
          <button
            class="category-filter-btn category-edu"
            :class="{ active: selectedCategory === TYPE_PERFO_CATEGORY.EDU }"
            @click="filterByCategory(TYPE_PERFO_CATEGORY.EDU)">
            교육
          </button>
          <button
            class="category-filter-btn category-event"
            :class="{ active: selectedCategory === TYPE_PERFO_CATEGORY.EVENT }"
            @click="filterByCategory(TYPE_PERFO_CATEGORY.EVENT)">
            행사
          </button>
        </div>
        <button class="reset-filter-btn" @click="resetFilters">
          <span class="reset-icon">↻</span>
          <span class="reset-text">초기화</span>
        </button>
      </div>

      <!-- 검색바와 등록 버튼 -->
      <div class="search-action-wrapper">
        <div class="search-bar-wrapper">
          <input v-model="searchKeyword" type="text" placeholder="제목으로 검색..." class="search-input" @keyup.enter="handleSearch" />
          <button class="search-button" @click="handleSearch">검색</button>
        </div>
        <button class="register-button" @click="assignPerfo">프로그램 등록</button>
      </div>
    </div>

    <!-- 로딩 / 에러 상태 -->
    <div v-if="isLoading" class="notice-list">
      <list-row-skeleton v-for="n in 8" :key="n" />
    </div>
    <error-state v-else-if="error" @retry="loadPerfoList" />

    <!-- 결과가 있을 때 -->
    <div v-else-if="perfos.length > 0" class="notice-list">
      <!-- 데스크탑용 테이블 -->
      <div class="notice-header desktop-only">
        <div class="col index">#</div>
        <div class="col thumbnail">썸네일</div>
        <div class="col title">제목</div>
        <div class="col type">카테고리</div>
        <div class="col author">작성자</div>
        <div class="col views">조회수</div>
        <div class="col date">등록일</div>
      </div>

      <div class="notice-row" v-for="(perfo, index) in perfos" :key="perfo.perIdx">
        <!-- 데스크탑 행 -->
        <div class="row-content desktop-only clickable" tabindex="0" role="link" @click="goToDetail(perfo.perIdx)" @keydown.enter="goToDetail(perfo.perIdx)">
          <div class="col index">{{ (currentPage - 1) * ROWS_PER_PAGE + index + 1 }}</div>

          <div class="col thumbnail">
            <img loading="lazy" :src="perfo.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="perfo.title" class="thumbnail-img" @error="handleImageError" />
          </div>

          <div class="col title">{{ perfo.title }}</div>
          <div class="col type">{{ getCategoryLabel(perfo.category) }}</div>
          <div class="col author">{{ perfo.author }}</div>
          <div class="col views">{{ perfo.views }}</div>
          <div class="col date">{{ dayjs(perfo.modDt).format('YY.MM.DD') }}</div>
        </div>

        <!-- 모바일 카드 -->
        <div class="mobile-only mobile-card clickable" tabindex="0" role="link" @click="goToDetail(perfo.perIdx)" @keydown.enter="goToDetail(perfo.perIdx)">
          <div class="title">
            {{ perfo.title }}
          </div>
          <div class="meta">
            <span>{{ getCategoryLabel(perfo.category) }}</span> · <span>{{ dayjs(perfo.modDt).format('YY.MM.DD') }}</span> ·
            <span>조회수 {{ perfo.views }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 결과가 없을 때 -->
    <empty-state v-else message="등록된 프로그램이 없습니다" />
    <section class="pagination-section">
      <base-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>

<style scoped>
/* 검색바와 카테고리 컨테이너 */
.search-category-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 3rem auto 3rem;
  padding: 0 1rem;
}

/* 검색바와 등록 버튼을 감싸는 래퍼 */
.search-action-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 검색바 스타일 오버라이드 */
.search-category-container .search-bar-wrapper {
  max-width: 600px;
  flex: 0 1 600px;
  margin: 0;
}

/* 프로그램 등록 버튼 */
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

/* 카테고리 필터 영역: 칩 그룹 + 초기화 — 공개 목록(PerfoListPage)과 동일한 디자인 */
.category-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.category-chips {
  display: flex;
  gap: 0.75rem;
}

/* 카테고리 필터 버튼 - 알약(pill) + 카테고리 색상 도트 */
.category-filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.35rem;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  background: #fff;
  border: 1.5px solid #e6e6e6;
  color: #555;
}

/* 카테고리 색상 도트 */
.category-filter-btn::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background 0.18s ease;
}

.category-filter-btn.category-perfo::before {
  background: #736e92;
}
.category-filter-btn.category-edu::before {
  background: #a72f47;
}
.category-filter-btn.category-event::before {
  background: #585440;
}

/* 호버(비활성): 해당 카테고리 색으로 테두리 + 연한 배경 */
.category-filter-btn:hover {
  transform: translateY(-1px);
}
.category-filter-btn.category-perfo:hover {
  border-color: #736e92;
  background: rgba(115, 110, 146, 0.07);
}
.category-filter-btn.category-edu:hover {
  border-color: #a72f47;
  background: rgba(167, 47, 71, 0.07);
}
.category-filter-btn.category-event:hover {
  border-color: #585440;
  background: rgba(88, 84, 64, 0.07);
}

.category-filter-btn:active {
  transform: translateY(0);
}

/* 활성 필터: 해당 카테고리 색으로 채우고 색 그림자로 강조, 도트는 흰색 */
.category-filter-btn.active {
  color: #fff;
}
.category-filter-btn.active::before {
  background: #fff;
}
.category-filter-btn.active.category-perfo {
  background: #736e92;
  border-color: #736e92;
  box-shadow: 0 4px 14px rgba(115, 110, 146, 0.4);
}
.category-filter-btn.active.category-edu {
  background: #a72f47;
  border-color: #a72f47;
  box-shadow: 0 4px 14px rgba(167, 47, 71, 0.4);
}
.category-filter-btn.active.category-event {
  background: #585440;
  border-color: #585440;
  box-shadow: 0 4px 14px rgba(88, 84, 64, 0.4);
}

/* 초기화 버튼 - 고스트 알약 */
.reset-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.85rem 1.1rem;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  background: transparent;
  color: #999;
  border: none;
}

.reset-filter-btn .reset-icon {
  font-size: 18px;
  transition: transform 0.4s ease;
}

.reset-filter-btn:hover {
  color: #a72f47;
  background: rgba(167, 47, 71, 0.08);
}

.reset-filter-btn:hover .reset-icon {
  transform: rotate(-180deg);
}

.reset-filter-btn:active {
  transform: scale(0.95);
}

/* 그리드 레이아웃 오버라이드 (썸네일 추가로 7컬럼) */
.notice-list .notice-header,
.notice-list .row-content {
  grid-template-columns: 30px 80px 1fr 100px 100px 80px 120px;
}

/* 썸네일 스타일 */
.col.thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

/* 반응형 */
@media (max-width: 768px) {
  .search-category-container {
    flex-direction: column;
    gap: 1.5rem;
  }

  .search-action-wrapper {
    flex-direction: column;
    width: 100%;
  }

  .search-category-container .search-bar-wrapper {
    flex: 1;
    max-width: 100%;
    width: 100%;
  }

  .register-button {
    width: 100%;
  }

  .category-filter-wrapper {
    justify-content: center;
  }

  .category-filter-btn {
    padding: 1rem 1.5rem;
    font-size: 14px;
  }
}

@media (max-width: 600px) {
  .category-filter-wrapper {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .category-filter-btn {
    flex: 1;
    min-width: 0;
  }
}
</style>
