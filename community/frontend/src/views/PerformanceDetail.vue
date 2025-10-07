<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { useRoute, useRouter } from 'vue-router';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getPerfoList, updatePerfo } from '@/api/perfo.api';
import moment from 'moment';
import { getApiClient } from '@/utils/apiClient';
import { TYPE_PERFO_CATEGORY } from '@/types';

export default defineComponent({
  name: 'performanceDetail',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0);
    const route = useRoute();
    const router = useRouter();
    const perfoIdx = route.query.id;
    const performance = ref<PerfoEntity>(new PerfoEntity());
    const apiClient = getApiClient();

    const goBack = () => {
      router.push('/performance');
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

    const loadPerfoDetail = async () => {
      const param = new SearchPerfoDto();
      param.perIdx = String(perfoIdx);

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          performance.value = res.data[0];
        }
      });
    };

    const updateViews = async () => {
      performance.value.perIdx = String(perfoIdx);
      performance.value.views++;
      await updatePerfo(apiClient, performance.value);
    };

    onMounted(async () => {
      await loadPerfoDetail();
      await updateViews();
    });

    return {
      performance,
      totalPage,
      moment,
      goBack,
      getCategoryLabel,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>역대 공연 상세</h1>
    <div class="notice-detail">
      <div class="performance-detail-container">
        <!-- 좌측: 썸네일 + 카테고리 + 제목 -->
        <div class="left-section">
          <div class="thumbnail-wrapper">
            <img :src="performance.imgUrl || '/assets/images/theater/main.jpeg'" :alt="performance.title" class="thumbnail-image" />
          </div>

          <div v-if="performance.category" class="category-tag-wrapper">
            <span class="category-tag" :class="`category-${performance.category.toLowerCase()}`">
              {{ getCategoryLabel(performance.category) }}
            </span>
          </div>

          <div class="notice-title"># {{ performance.title }}</div>
        </div>

        <!-- 우측: titleSec, titleThird, 메타정보, 본문 -->
        <div class="right-section">
          <div v-if="performance.titleSec" class="subtitle">{{ performance.titleSec }}</div>
          <div v-if="performance.titleThird" class="subtitle-small">{{ performance.titleThird }}</div>

          <div class="notice-meta">
            <span>작성일: {{ moment(performance.regDt).format('YY.MM.DD') }}</span>
            <span>조회수: {{ performance.views }}</span>
          </div>

          <div class="notice-content" v-html="performance.body"></div>
        </div>
      </div>

      <div class="back-button-wrapper">
        <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notice-detail {
  font-family: 'Pretendard', sans-serif;
}

.performance-detail-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.thumbnail-wrapper {
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #f5f5f5;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.left-section .category-tag-wrapper {
  margin-bottom: 0;
}

.left-section .notice-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-tag-wrapper {
  margin-bottom: 0.5rem;
}

.category-tag {
  display: inline-block;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
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

.subtitle {
  font-size: 15px;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.3rem;
}

.subtitle-small {
  font-size: 14px;
  font-weight: 400;
  color: #777;
  margin-bottom: 0.5rem;
}

@media (max-width: 900px) {
  .performance-detail-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .left-section {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .subtitle {
    font-size: 14px;
  }

  .subtitle-small {
    font-size: 13px;
  }
}
</style>
