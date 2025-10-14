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

    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      target.src = '/assets/images/common/default-thumbnail.svg';
    };

    const setupFileDownloadLinks = () => {
      // 파일 다운로드 링크에 download 속성 추가 및 클릭 이벤트 처리
      setTimeout(() => {
        const fileLinks = document.querySelectorAll<HTMLAnchorElement>(
          '.notice-content a[href*="amazonaws.com"], .notice-content a[href*="/uploads/"], .notice-content a[href*="/files/"]'
        );

        fileLinks.forEach(link => {
          // 파일명 추출
          const url = link.href;
          const fileName = url.split('/').pop()?.split('?')[0] || 'download';

          // download 속성 추가
          link.setAttribute('download', decodeURIComponent(fileName));

          // 클릭 이벤트로 강제 다운로드
          link.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
              const response = await fetch(url);
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = decodeURIComponent(fileName);
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(downloadUrl);
            } catch (error) {
              console.error('파일 다운로드 오류:', error);
              // 다운로드 실패 시 새 탭에서 열기
              window.open(url, '_blank');
            }
          });
        });
      }, 300);
    };

    onMounted(async () => {
      await loadPerfoDetail();
      await updateViews();
      setupFileDownloadLinks();
    });

    return {
      performance,
      totalPage,
      moment,
      goBack,
      getCategoryLabel,
      handleImageError,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>자체 프로그램 상세</h1>
    <div class="performance-detail-container">
      <!-- 좌측: 썸네일 + 카테고리 + 제목 (border 없음) -->
      <div class="left-section">
        <div class="thumbnail-wrapper">
          <img :src="performance.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="performance.title" class="thumbnail-image" @error="handleImageError" />
        </div>

        <div v-if="performance.category" class="category-tag-wrapper">
          <span class="category-tag" :class="`category-${performance.category.toLowerCase()}`">
            {{ getCategoryLabel(performance.category) }}
          </span>
        </div>

        <div class="notice-title"># {{ performance.title }}</div>
      </div>

      <!-- 우측: titleSec, titleThird, 메타정보, 본문 (border 있음) -->
      <div class="right-section">
        <div class="notice-detail">
          <div v-if="performance.titleSec" class="subtitle">{{ performance.titleSec }}</div>
          <div v-if="performance.titleThird" class="subtitle-small">{{ performance.titleThird }}</div>

          <div class="notice-meta">
            <span>작성자: {{ performance.author }}</span>
            <span>작성일: {{ moment(performance.regDt).format('YY.MM.DD') }}</span>
            <span>조회수: {{ performance.views }}</span>
          </div>

          <div class="notice-content" v-html="performance.body"></div>
        </div>
      </div>
    </div>

    <div class="back-button-wrapper">
      <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.performance-detail-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 3rem;
  margin: 2rem auto;
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
}

.right-section .notice-detail {
  margin: 0;
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
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.8rem;
  padding-top: 0.5rem;
  line-height: 1.5;
}

.subtitle-small {
  font-size: 15px;
  font-weight: 500;
  color: #555;
  margin-bottom: 1rem;
  line-height: 1.5;
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

  .right-section .notice-detail {
    margin: 0;
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
