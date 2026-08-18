<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BasePagination from '@/components/common/BasePagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getApiClient } from '@/utils/apiClient';
import { getPerfoList } from '@/api/perfo.api';
import dayjs from 'dayjs';
import { TYPE_PERFO, TYPE_PERFO_CATEGORY } from '@/types';
import SectionTabs from '@/components/common/SectionTabs.vue';

export default defineComponent({
  name: 'performance',
  components: { BasePagination, EmptyState, ErrorState, SectionTabs },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const totalPage = ref<number>(0);
    const totalCount = ref<number>(0); // 전체 결과 수 (결과 카운트 표시용)
    const appliedKeyword = ref<string>(''); // 실제 조회에 사용된 검색어
    const apiClient = getApiClient();
    const performances = ref<PerfoEntity[]>([]);
    const loading = ref<boolean>(true);
    const error = ref<boolean>(false);
    const searchKeyword = ref<string>('');
    const selectedCategory = ref<string>('');
    const ROWS_PER_PAGE = 8; // 한 페이지당 8개
    const currentPage = computed(() => (route.query.pageNo ? Number(route.query.pageNo) : 1));

    const loadPerfoList = async () => {
      const param = new SearchPerfoDto();
      param.perType = TYPE_PERFO.NORMAL;
      param.keyword = searchKeyword.value || undefined;
      param.category = selectedCategory.value || undefined;
      param.page = currentPage.value;
      param.rows = ROWS_PER_PAGE;
      appliedKeyword.value = searchKeyword.value;

      loading.value = true;
      error.value = false;
      await getPerfoList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data) {
            performances.value = res.data;
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
      if (currentPage.value === 1) loadPerfoList();
      else router.push({ query: { ...route.query, pageNo: 1 } });
    };

    const handleSearch = () => {
      goFirstPageAndLoad();
    };

    const filterByCategory = (category: string) => {
      if (selectedCategory.value === category) {
        selectedCategory.value = '';
      } else {
        selectedCategory.value = category;
      }
      goFirstPageAndLoad();
    };

    const getCategoryLabel = (category: string | undefined) => {
      switch (category) {
        case TYPE_PERFO_CATEGORY.PERFO:
          return '공연';
        case TYPE_PERFO_CATEGORY.EDU:
          return '교육';
        case TYPE_PERFO_CATEGORY.EVENT:
          return '행사';
        default:
          return '';
      }
    };

    const resetFilters = () => {
      searchKeyword.value = '';
      selectedCategory.value = '';
      goFirstPageAndLoad();
    };

    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      target.onerror = null; // 기본 썸네일마저 깨질 때 에러 루프 방지
      target.src = '/assets/images/common/default-thumbnail.svg';
    };

    // 페이지 번호 변경 감지
    watch(
      () => route.query.pageNo,
      () => {
        // 상세로 이탈할 때도 pageNo가 사라지며 watch가 발동하므로, 이 페이지일 때만 로드
        if (route.name !== 'performance') return;
        loadPerfoList();
      }
    );

    onMounted(() => {
      loadPerfoList();
    });

    return {
      performances,
      loading,
      error,
      loadPerfoList,
      totalPage,
      totalCount,
      appliedKeyword,
      dayjs,
      searchKeyword,
      selectedCategory,
      handleSearch,
      filterByCategory,
      getCategoryLabel,
      resetFilters,
      handleImageError,
      TYPE_PERFO_CATEGORY,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page performance-page">
    <h1>자체 프로그램</h1>
    <section-tabs />

    <!-- 검색바와 카테고리 필터 -->
    <div class="search-category-container">
      <!-- 카테고리 필터 버튼 -->
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
        <button v-if="selectedCategory || appliedKeyword" class="reset-filter-btn" @click="resetFilters">
          <span class="reset-icon">↻</span>
          <span class="reset-text">초기화</span>
        </button>
      </div>

      <!-- 검색바 -->
      <div class="search-bar-wrapper">
        <input v-model="searchKeyword" type="text" placeholder="제목으로 검색..." class="search-input" @keyup.enter="handleSearch" />
        <button class="search-button" @click="handleSearch">검색</button>
      </div>
    </div>

    <!-- 결과 카운트 -->
    <div v-if="!loading && !error" class="results-meta">
      총 <strong>{{ totalCount }}</strong>개
      <span v-if="selectedCategory" class="meta-chip">{{ getCategoryLabel(selectedCategory) }}</span>
      <span v-if="appliedKeyword" class="meta-chip">‘{{ appliedKeyword }}’ 검색</span>
    </div>

    <!-- 로딩 중 -->
    <div v-if="loading" class="performance-grid">
      <div v-for="n in 8" :key="`sk-${n}`" class="performance-card">
        <div class="card-image"><span class="skeleton" style="display:block;width:100%;height:100%"></span></div>
        <div class="card-content">
          <div class="category-title-wrapper">
            <span class="skeleton" style="width: 44px; height: 24px; border-radius: 999px; flex-shrink: 0"></span>
            <span class="skeleton" style="flex: 1; height: 16px; border-radius: 5px"></span>
          </div>
          <span class="skeleton" style="display: block; width: 70%; height: 14px; border-radius: 5px; margin-top: 0.4rem"></span>
        </div>
      </div>
    </div>

    <!-- 불러오기 실패 -->
    <error-state v-else-if="error" @retry="loadPerfoList" />

    <!-- 결과가 있을 때 -->
    <div v-else-if="performances.length > 0" class="performance-grid">
      <div v-reveal="Math.min(index * 60, 360)" class="performance-card" v-for="(performance, index) in performances" :key="performance.perIdx">
        <router-link :to="`/performance/${performance.perIdx}`" class="card-link">
          <div class="card-image">
            <img loading="lazy" :src="performance.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="performance.title" @error="handleImageError" />
          </div>
          <div class="card-content">
            <!-- 카테고리 태그와 제목을 한 줄에 -->
            <div class="category-title-wrapper">
              <span v-if="performance.category" class="category-tag" :class="`category-${performance.category.toLowerCase()}`">
                {{ getCategoryLabel(performance.category) }}
              </span>
              <h3 class="card-title">{{ performance.title }}</h3>
            </div>

            <!-- 부제목들 -->
            <div v-if="performance.titleSec" class="card-subtitle">{{ performance.titleSec }}</div>
            <div v-if="performance.titleThird" class="card-subtitle-small">{{ performance.titleThird }}</div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 결과가 없을 때 -->
    <empty-state
      v-else
      :message="
        appliedKeyword
          ? `'${appliedKeyword}'에 대한 검색 결과가 없습니다`
          : selectedCategory
          ? '해당 카테고리의 프로그램이 없습니다'
          : '등록된 프로그램이 없습니다'
      "
      :action-label="appliedKeyword || selectedCategory ? '검색 초기화' : ''"
      @action="resetFilters" />

    <section class="pagination-section">
      <base-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>

<style scoped>
.performance-page {
  max-width: 1200px;
  font-family: 'Pretendard', sans-serif;
}

/* 검색바와 카테고리 컨테이너 */
.search-category-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin: 3rem auto 3rem;
  padding: 0 1rem;
}

/* 검색바 스타일 오버라이드 */
.search-category-container .search-bar-wrapper {
  flex: 1 1 320px;
  max-width: 480px;
  margin: 0;
}

/* 카테고리 필터 영역: 칩 그룹 + 초기화 (한 줄 유지) */
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

/* 결과 카운트 위치 조정 (기본 스타일은 notice.scss 전역 정의) */
.results-meta {
  margin: -1rem 0 1.5rem;
  padding: 0;
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

/* 그리드 레이아웃 */
.performance-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

/* 카드 스타일 */
.performance-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.performance-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-image {
  width: 100%;
  aspect-ratio: 5 / 8;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
}

/* 흰 배경 포스터가 카드에 묻히지 않도록 얇은 경계선 오버레이 */
.card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
  pointer-events: none;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.performance-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-align: left;
}

/* 카테고리 태그와 제목을 한 줄에 배치 */
.category-title-wrapper {
  display: flex;
  align-items: flex-start; /* 제목 2줄일 때 태그를 첫 줄에 정렬 */
  gap: 0.8rem;
  margin-bottom: 0.2rem;
}

.category-tag {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.category-tag.category-perfo {
  background: rgba(115, 110, 146, 0.15);
  color: #736e92;
  border: 1.5px solid rgba(115, 110, 146, 0.3);
}

.category-tag.category-edu {
  background: rgba(167, 47, 71, 0.15);
  color: #a72f47;
  border: 1.5px solid rgba(167, 47, 71, 0.3);
}

.category-tag.category-event {
  background: rgba(88, 84, 64, 0.15);
  color: #585440;
  border: 1.5px solid rgba(88, 84, 64, 0.3);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  margin: 0;
  flex: 1;
  min-width: 0;
}

.card-subtitle {
  font-size: 15px;
  font-weight: 500;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  text-align: left;
}

.card-subtitle-small {
  font-size: 14px;
  font-weight: 400;
  color: #777;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  text-align: left;
}

/* 페이지네이션 */
.pagination-section {
  margin-top: 3rem;
}

/* 반응형 */
@media (max-width: 1200px) {
  .performance-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

/* 태블릿 이하: 필터/검색 세로 스택 (칩 가운데, 검색바 full-width) */
@media (max-width: 900px) {
  .performance-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .search-category-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1.25rem;
    padding: 0;
  }

  .category-filter-wrapper {
    justify-content: center;
  }

  .search-category-container .search-bar-wrapper {
    flex: 1 1 auto;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .category-filter-btn {
    padding: 0.75rem 1.2rem;
    font-size: 14px;
  }

  .card-content {
    padding: 1rem;
  }

  .card-title {
    font-size: 16px;
  }

  .card-subtitle {
    font-size: 15px;
  }

  .card-subtitle-small {
    font-size: 14px;
  }
}

@media (max-width: 600px) {
  .performance-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .category-chips {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .performance-grid {
    grid-template-columns: 1fr;
  }

  /* 좁은 화면: 칩이 폭을 균등 분할, 초기화는 아이콘만 */
  .category-chips {
    flex: 1;
  }

  .category-filter-btn {
    flex: 1;
    min-width: 0;
    padding: 0.9rem 0.5rem;
  }

  .reset-filter-btn {
    padding: 0.9rem;
  }

  .reset-text {
    display: none;
  }
}
</style>
