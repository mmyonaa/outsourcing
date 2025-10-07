<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getApiClient } from '@/utils/apiClient';
import { getPerfoList } from '@/api/perfo.api';
import moment from 'moment';
import { TYPE_PERFO, TYPE_PERFO_CATEGORY } from '@/types';

export default defineComponent({
  name: 'performance',
  components: { ApocPagination },
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
        case TYPE_PERFO_CATEGORY.A:
          return '카테고리 A';
        case TYPE_PERFO_CATEGORY.B:
          return '카테고리 B';
        case TYPE_PERFO_CATEGORY.C:
          return '카테고리 C';
        default:
          return '';
      }
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
      TYPE_PERFO_CATEGORY,
    };
  },
});
</script>

<template>
  <div class="page-common performance-page">
    <h1>역대 공연</h1>

    <!-- 검색바 및 필터 -->
    <div class="search-filter-section">
      <div class="search-bar-wrapper">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="제목으로 검색..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-button" @click="handleSearch">검색</button>
      </div>

      <!-- 카테고리 필터 버튼 -->
      <div class="category-filter-wrapper">
        <button
          class="category-filter-btn category-a"
          :class="{ active: selectedCategory === TYPE_PERFO_CATEGORY.A }"
          @click="filterByCategory(TYPE_PERFO_CATEGORY.A)"
        >
          카테고리 A
        </button>
        <button
          class="category-filter-btn category-b"
          :class="{ active: selectedCategory === TYPE_PERFO_CATEGORY.B }"
          @click="filterByCategory(TYPE_PERFO_CATEGORY.B)"
        >
          카테고리 B
        </button>
        <button
          class="category-filter-btn category-c"
          :class="{ active: selectedCategory === TYPE_PERFO_CATEGORY.C }"
          @click="filterByCategory(TYPE_PERFO_CATEGORY.C)"
        >
          카테고리 C
        </button>
      </div>
    </div>

    <div class="performance-grid">
      <div
        class="performance-card"
        v-for="(performance, index) in performances"
        :key="performance.perIdx"
      >
        <router-link :to="`/performance/detail?id=${performance.perIdx}`" class="card-link">
          <div class="card-image">
            <img
              :src="performance.imgUrl || '/assets/images/theater/main.jpeg'"
              :alt="performance.title"
            />
          </div>
          <div class="card-content">
            <!-- 카테고리 태그 -->
            <div v-if="performance.category" class="category-tag-wrapper">
              <span class="category-tag" :class="`category-${performance.category.toLowerCase()}`">
                {{ getCategoryLabel(performance.category) }}
              </span>
            </div>

            <!-- 제목 -->
            <h3 class="card-title">{{ performance.title }}</h3>

            <!-- 부제목들 -->
            <div v-if="performance.titleSec" class="card-subtitle">{{ performance.titleSec }}</div>
            <div v-if="performance.titleThird" class="card-subtitle-small">{{ performance.titleThird }}</div>

            <!-- 메타 정보 -->
            <div class="card-meta">
              <span>{{ moment(performance.regDt).format('YY.MM.DD') }}</span>
              <span>조회수 {{ performance.views }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <section class="pagination-section">
      <apoc-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>

<style scoped>
.performance-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 검색 및 필터 섹션 */
.search-filter-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem auto 3rem;
  max-width: 1400px;
  padding: 0 1rem;
  flex-wrap: wrap;
}

.search-bar-wrapper {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-width: 300px;
  max-width: 600px;
}

.search-input {
  flex: 1;
  padding: 1.2rem 1.5rem;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  font-family: 'Pretendard', sans-serif;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  border-color: var(--colorPrimary);
  box-shadow: 0 0 0 3px rgba(227, 67, 99, 0.1);
}

.search-button {
  padding: 1.2rem 2rem;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: var(--colorPrimary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.search-button:hover {
  background-color: #c13a5d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(227, 67, 99, 0.3);
}

.search-button:active {
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
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-filter-btn.category-a {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.category-filter-btn.category-b {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.category-filter-btn.category-c {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.category-filter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.category-filter-btn:active {
  transform: translateY(0);
}

.category-filter-btn.active {
  border-color: #333;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #333;
  transform: scale(1.05);
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
  gap: 0.5rem;
}

/* 카테고리 태그 */
.category-tag-wrapper {
  margin-bottom: 0.25rem;
}

.category-tag {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 18px;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.category-tag.category-a {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.category-tag.category-b {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.category-tag.category-c {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.card-subtitle {
  font-size: 0.95rem;
  font-weight: 500;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.3;
}

.card-subtitle-small {
  font-size: 0.85rem;
  font-weight: 400;
  color: #777;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.3;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #999;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid #f0f0f0;
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

  .search-filter-section {
    flex-direction: column;
    gap: 1.5rem;
  }

  .search-bar-wrapper {
    max-width: 100%;
  }

  .category-filter-wrapper {
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .performance-page {
    padding: 1rem;
  }

  .search-filter-section {
    margin: 2rem auto 2rem;
    gap: 1.2rem;
  }

  .search-input {
    padding: 1rem 1.2rem;
    font-size: 14px;
  }

  .search-button {
    padding: 1rem 1.5rem;
    font-size: 14px;
  }

  .category-filter-btn {
    padding: 1rem 1.5rem;
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

  .search-bar-wrapper {
    min-width: auto;
  }

  .category-filter-wrapper {
    width: 100%;
  }

  .category-filter-btn {
    flex: 1;
    min-width: 0;
  }
}
</style>