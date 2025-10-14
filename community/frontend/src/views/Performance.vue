<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getApiClient } from '@/utils/apiClient';
import { getPerfoList } from '@/api/perfo.api';
import moment from 'moment';
import { TYPE_PERFO, TYPE_PERFO_CATEGORY } from '@/types';

export default defineComponent({
  name: 'performance',
  components: { ApocPagination, EmptyState },
  setup() {
    const totalPage = ref<number>(0);
    const apiClient = getApiClient();
    const performances = ref<PerfoEntity[]>([]);
    const searchKeyword = ref<string>('');
    const selectedCategory = ref<string>('');

    const loadPerfoList = async () => {
      const param = new SearchPerfoDto();
      param.perType = TYPE_PERFO.NORMAL;
      param.keyword = searchKeyword.value || undefined;
      param.category = selectedCategory.value || undefined;

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          performances.value = res.data;
        }
      });
    };

    const handleSearch = () => {
      loadPerfoList();
    };

    const filterByCategory = (category: string) => {
      if (selectedCategory.value === category) {
        selectedCategory.value = '';
      } else {
        selectedCategory.value = category;
      }
      loadPerfoList();
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
      loadPerfoList();
    };

    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      target.src = '/assets/images/common/default-thumbnail.svg';
    };

    onMounted(() => {
      loadPerfoList();
    });

    return {
      performances,
      totalPage,
      moment,
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

      <!-- 검색바 -->
      <div class="search-bar-wrapper">
        <input v-model="searchKeyword" type="text" placeholder="제목으로 검색..." class="search-input" @keyup.enter="handleSearch" />
        <button class="search-button" @click="handleSearch">검색</button>
      </div>
    </div>

    <!-- 결과가 있을 때 -->
    <div v-if="performances.length > 0" class="performance-grid">
      <div class="performance-card" v-for="(performance, index) in performances" :key="performance.perIdx">
        <router-link :to="`/performance/detail?id=${performance.perIdx}`" class="card-link">
          <div class="card-image">
            <img :src="performance.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="performance.title" @error="handleImageError" />
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
    <empty-state v-else message="등록된 프로그램이 없습니다" />

    <section class="pagination-section">
      <apoc-pagination :total-page-num="totalPage" />
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
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 3rem auto 3rem;
  padding: 0 1rem;
}

/* 검색바 스타일 오버라이드 */
.search-category-container .search-bar-wrapper {
  max-width: 600px;
  flex: 0 1 600px;
  margin: 0;
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
  /* box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3); */
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.performance-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-image {
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #f5f5f5;
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
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.2rem;
}

.category-tag {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 18px;
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
  text-overflow: ellipsis;
  white-space: nowrap;
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

@media (max-width: 900px) {
  .performance-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .search-category-container {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .search-category-container .search-bar-wrapper {
    flex: 1;
    max-width: 100%;
    width: 100%;
  }

  .category-filter-wrapper {
    justify-content: flex-start;
    width: 100%;
    flex-wrap: nowrap;
  }

  .category-filter-btn {
    padding: 1rem 1.5rem;
    font-size: 14px;
  }

  .reset-filter-btn {
    padding: 1rem 1.2rem;
    font-size: 14px;
  }

  .card-content {
    padding: 1rem;
  }

  .card-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 600px) {
  .performance-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .category-filter-wrapper {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .performance-grid {
    grid-template-columns: 1fr;
  }

  .category-filter-btn {
    flex: 1;
    min-width: 0;
  }
}
</style>
