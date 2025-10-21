<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ApocPagination from '@/components/common/ApocPagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getApiClient } from '@/utils/apiClient';
import { getPerfoList } from '@/api/perfo.api';
import moment from 'moment';
import { STATE_YN, TYPE_PERFO, TYPE_PERFO_CATEGORY } from '@/types';

export default defineComponent({
  name: 'adminPerformanceNext',
  components: { ApocPagination, EmptyState },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const totalPage = ref<number>(0); // 총 페이지
    const apiClient = getApiClient();
    const perfos = ref<PerfoEntity[]>([]);
    const searchKeyword = ref<string>('');
    const selectedCategory = ref<string>('');
    const ROWS_PER_PAGE = 8; // 한 페이지당 8개

    const loadPerfoList = async () => {
      const currentPage = route.query.pageNo ? Number(route.query.pageNo) : 1;
      const param = new SearchPerfoDto();
      param.perType = TYPE_PERFO.NEXT;
      param.keyword = searchKeyword.value || undefined;
      param.category = selectedCategory.value || undefined;
      param.page = currentPage;
      param.rows = ROWS_PER_PAGE;

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          perfos.value = res.data;
          // totalCount를 사용하여 totalPage 계산
          if (res.totalCount) {
            totalPage.value = Math.ceil(res.totalCount / ROWS_PER_PAGE);
          }
        }
      });
    };

    const handleSearch = () => {
      // 검색 시 1페이지로 이동하고 데이터 로드
      router.push({ query: { ...route.query, pageNo: 1 } });
      loadPerfoList();
    };

    const filterByCategory = (category: string) => {
      if (selectedCategory.value === category) {
        selectedCategory.value = '';
      } else {
        selectedCategory.value = category;
      }
      // 필터 변경 시 1페이지로 이동하고 데이터 로드
      router.push({ query: { ...route.query, pageNo: 1 } });
      loadPerfoList();
    };

    const assignPerfo = () => {
      router.push('/admin/performance/next/assign');
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
      // 초기화 시 1페이지로 이동하고 데이터 로드
      router.push({ query: { ...route.query, pageNo: 1 } });
      loadPerfoList();
    };

    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      target.src = '/assets/images/common/default-thumbnail.svg';
    };

    const goToDetail = (perIdx: string | undefined) => {
      if (perIdx) {
        router.push(`/admin/performance/next/detail?id=${perIdx}`);
      }
    };

    // 페이지 번호 변경 감지
    watch(
      () => route.query.pageNo,
      () => {
        loadPerfoList();
      }
    );

    onMounted(() => {
      loadPerfoList();
    });
    return {
      perfos,
      totalPage,
      moment,
      STATE_YN,
      searchKeyword,
      selectedCategory,
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
    <h1>대관 프로그램 관리</h1>

    <!-- 검색바와 카테고리 필터 -->
    <div class="search-category-container">
      <!-- 카테고리 필터 버튼 -->
      <div class="category-filter-wrapper">
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
        <button class="reset-filter-btn" @click="resetFilters">
          <span class="reset-icon">↻</span>
          초기화
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

    <!-- 결과가 있을 때 -->
    <div v-if="perfos.length > 0" class="notice-list">
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
        <div class="row-content desktop-only clickable" @click="goToDetail(perfo.perIdx)">
          <div class="col index">{{ index + 1 }}</div>

          <div class="col thumbnail">
            <img
              :src="perfo.imgUrl || '/assets/images/common/default-thumbnail.svg'"
              :alt="perfo.title"
              class="thumbnail-img"
              @error="handleImageError" />
          </div>

          <div class="col title">{{ perfo.title }}</div>
          <div class="col type">{{ getCategoryLabel(perfo.category) }}</div>
          <div class="col author">{{ perfo.author }}</div>
          <div class="col views">{{ perfo.views }}</div>
          <div class="col date">{{ moment(perfo.regDt).format('YY.MM.DD') }}</div>
        </div>

        <!-- 모바일 카드 -->
        <div class="mobile-only mobile-card clickable" @click="goToDetail(perfo.perIdx)">
          <div class="title">
            {{ perfo.title }}
          </div>
          <div class="meta">
            <span>{{ getCategoryLabel(perfo.category) }}</span> · <span>{{ moment(perfo.regDt).format('YY.MM.DD') }}</span> ·
            <span>조회수 {{ perfo.views }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 결과가 없을 때 -->
    <empty-state v-else message="등록된 프로그램이 없습니다" />
    <section class="pagination-section">
      <apoc-pagination :total-page-num="totalPage" />
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

/* 카테고리 필터 버튼 */
.category-filter-wrapper {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.category-filter-btn {
  padding: 1.2rem 1.8rem;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-filter-btn.category-perfo {
  background: rgba(115, 110, 146, 0.15);
  color: #736e92;
  border: 1.5px solid rgba(115, 110, 146, 0.3);
}

.category-filter-btn.category-edu {
  background: rgba(167, 47, 71, 0.15);
  color: #a72f47;
  border: 1.5px solid rgba(167, 47, 71, 0.3);
}

.category-filter-btn.category-event {
  background: rgba(88, 84, 64, 0.15);
  color: #585440;
  border: 1.5px solid rgba(88, 84, 64, 0.3);
}

.category-filter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.category-filter-btn:active {
  transform: translateY(0);
}

.category-filter-btn.active {
  transform: scale(1.05);
}

/* 초기화 버튼 */
.reset-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.2rem 1.5rem;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  background: transparent;
  color: #888;
  border: none;
}

.reset-filter-btn .reset-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.reset-filter-btn:hover {
  color: #555;
  background: rgba(0, 0, 0, 0.05);
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
