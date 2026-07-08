<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import BasePagination from '@/components/common/BasePagination.vue';
import BaseShareButton from '@/components/common/BaseShareButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getPerfoList, updatePerfo } from '@/api/perfo.api';
import dayjs from 'dayjs';
import { getApiClient } from '@/utils/apiClient';
import { TYPE_PERFO_CATEGORY } from '@/types';
import { setMetaTags, setJsonLd, removeJsonLd, toPlainText } from '@/utils/seo.util';

export default defineComponent({
  name: 'performanceNextDetail',
  components: { BasePagination, BaseShareButton },
  setup() {
    const totalPage = ref<number>(0);
    const route = useRoute();
    const router = useRouter();
    const perfoIdx = route.params.id;
    const performance = ref<PerfoEntity>(new PerfoEntity());
    const apiClient = getApiClient();

    const goBack = () => {
      router.push('/performance/next');
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

    // 로드된 공연 내용으로 메타/OG/JSON-LD 갱신
    const applySeo = () => {
      if (!performance.value.title) return;
      const description = toPlainText(performance.value.body);
      const ogImage = performance.value.imgUrl || undefined;
      setMetaTags({
        title: `${performance.value.title} | 보광극장`,
        description,
        ogTitle: `${performance.value.title} | 보광극장`,
        ogDescription: description,
        ...(ogImage ? { ogImage } : {}),
      });
      setJsonLd('article', {
        '@context': 'https://schema.org',
        '@type': 'TheaterEvent',
        name: performance.value.title,
        description,
        ...(ogImage ? { image: ogImage } : {}),
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'PerformingArtsTheater',
          name: '보광극장',
          address: {
            '@type': 'PostalAddress',
            addressLocality: '서울 용산구',
            addressCountry: 'KR',
          },
        },
        organizer: { '@type': 'Organization', name: '보광극장' },
        url: window.location.href,
      });
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
          const url = link.href;
          // 링크 텍스트를 파일명으로 사용 (Quill에서 원본 파일명으로 링크를 생성했으므로)
          const fileName = link.textContent?.trim() || url.split('/').pop()?.split('?')[0] || 'download';

          // download 속성 추가
          link.setAttribute('download', fileName);

          // 클릭 이벤트로 강제 다운로드
          link.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
              const response = await fetch(url);
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = fileName;
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
      applySeo();
      await updateViews();
      setupFileDownloadLinks();
    });

    onUnmounted(() => {
      removeJsonLd('article');
    });

    return {
      performance,
      totalPage,
      dayjs,
      goBack,
      getCategoryLabel,
      handleImageError,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>대관 프로그램 상세</h1>
    <div class="performance-detail-container">
      <!-- 좌측: 포스터 -->
      <div class="left-section">
        <div class="thumbnail-wrapper">
          <img
            :src="performance.imgUrl || '/assets/images/common/default-thumbnail.svg'"
            :alt="performance.title"
            class="thumbnail-image"
            @error="handleImageError" />
        </div>
      </div>

      <!-- 우측: 카테고리 + 제목 + 부제 + 메타 + 본문 -->
      <div class="right-section">
        <div class="info-panel">
          <div v-if="performance.category" class="category-tag-wrapper">
            <span class="category-tag" :class="`category-${performance.category.toLowerCase()}`">
              {{ getCategoryLabel(performance.category) }}
            </span>
          </div>

          <div class="title-row">
            <h2 class="perfo-title">{{ performance.title }}</h2>
            <base-share-button :title="performance.title" :text="performance.titleSec" />
          </div>

          <p v-if="performance.titleSec" class="subtitle">{{ performance.titleSec }}</p>
          <p v-if="performance.titleThird" class="subtitle-small">{{ performance.titleThird }}</p>

          <div class="notice-meta">
            <span>작성자: {{ performance.author }}</span>
            <span class="meta-divider">·</span>
            <span>작성일: {{ dayjs(performance.modDt).format('YY.MM.DD') }}</span>
            <span class="meta-divider">·</span>
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
  grid-template-columns: 360px 1fr;
  gap: 2.5rem;
  margin: 2rem auto;
  align-items: start;
}

/* 좌측 포스터 (스크롤 시 따라옴) */
.left-section {
  position: sticky;
  top: 2rem;
}

.thumbnail-wrapper {
  width: 100%;
  aspect-ratio: 5 / 8;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  background: #f5f5f5;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.thumbnail-wrapper:hover .thumbnail-image {
  transform: scale(1.03);
}

/* 우측 정보 패널 */
.info-panel {
  border: 1px solid #ececec;
  border-radius: 16px;
  background: #fff;
  padding: 2.25rem 2.25rem 2.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.category-tag-wrapper {
  margin-bottom: 1rem;
}

.category-tag {
  display: inline-block;
  padding: 0.4rem 0.95rem;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.category-tag.category-perfo {
  background: rgba(115, 110, 146, 0.12);
  color: #736e92;
  border: 1px solid rgba(115, 110, 146, 0.28);
}

.category-tag.category-edu {
  background: rgba(167, 47, 71, 0.12);
  color: #a72f47;
  border: 1px solid rgba(167, 47, 71, 0.28);
}

.category-tag.category-event {
  background: rgba(88, 84, 64, 0.12);
  color: #585440;
  border: 1px solid rgba(88, 84, 64, 0.28);
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.title-row :deep(.base-share-button) {
  flex-shrink: 0;
}

.perfo-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  margin: 0;
  flex: 1;
  min-width: 0;
  word-break: keep-all;
}

.subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem;
  line-height: 1.6;
}

.subtitle-small {
  font-size: 15px;
  font-weight: 500;
  color: #666;
  margin: 0 0 0.5rem;
  line-height: 1.6;
}

/* 메타 정보 (작성자 · 작성일 · 조회수) */
.right-section .notice-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  color: #999;
  margin: 1.25rem 0;
  padding: 0.9rem 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.meta-divider {
  color: #d8d8d8;
}

/* 본문 */
.right-section .notice-content {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  padding-top: 0.25rem;
}

@media (max-width: 900px) {
  .performance-detail-container {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  .left-section {
    position: static;
    max-width: 360px;
    margin: 0 auto;
    width: 100%;
  }

  .info-panel {
    padding: 1.75rem 1.5rem 2rem;
  }
}

@media (max-width: 768px) {
  .perfo-title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 15px;
  }

  .subtitle-small {
    font-size: 14px;
  }

  .right-section .notice-meta {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
