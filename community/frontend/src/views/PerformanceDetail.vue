<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import BasePagination from '@/components/common/BasePagination.vue';
import BaseShareButton from '@/components/common/BaseShareButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getPerfoList, updatePerfo } from '@/api/perfo.api';
import dayjs from 'dayjs';
import { getApiClient } from '@/utils/apiClient';
import { TYPE_PERFO, TYPE_PERFO_CATEGORY } from '@/types';
import { setMetaTags, setJsonLd, removeJsonLd, toPlainText, extractEventDates } from '@/utils/seo.util';

export default defineComponent({
  name: 'performanceDetail',
  components: { BasePagination, BaseShareButton },
  setup() {
    const totalPage = ref<number>(0);
    const route = useRoute();
    const router = useRouter();
    const currentId = computed(() => String(route.params.id));
    const performance = ref<PerfoEntity>(new PerfoEntity());
    const relatedPerformances = ref<PerfoEntity[]>([]);
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
      param.perIdx = currentId.value;

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          performance.value = res.data[0];
        }
      });
    };

    // 현재 글과 같은 프로그램 유형(자체 밑엔 자체) 중 현재 글을 제외하고 최신순 한 줄(최대 6개)
    // 백엔드가 reg_dt DESC로 정렬하므로 별도 정렬 불필요
    const loadRelated = async () => {
      const param = new SearchPerfoDto();
      param.perType = performance.value.perType || TYPE_PERFO.NORMAL;
      param.page = 1;
      param.rows = 12;

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          relatedPerformances.value = res.data
            .filter(p => String(p.perIdx) !== currentId.value)
            .slice(0, 6);
        }
      });
    };

    const updateViews = async () => {
      performance.value.perIdx = currentId.value;
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
      // startDate 없는 Event 마크업은 Search Console 심각 오류가 되므로,
      // 텍스트에서 공연 기간을 찾은 경우에만 Event 스키마를 출력한다
      const dates = extractEventDates([
        performance.value.titleSec,
        performance.value.titleThird,
        performance.value.body,
      ]);
      if (dates) {
        setJsonLd('article', {
          '@context': 'https://schema.org',
          '@type': 'TheaterEvent',
          name: performance.value.title,
          description,
          ...(ogImage ? { image: ogImage } : {}),
          startDate: dates.startDate,
          endDate: dates.endDate,
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'PerformingArtsTheater',
            name: '보광극장',
            address: {
              '@type': 'PostalAddress',
              addressLocality: '서울 용산구',
              addressCountry: 'KR',
            },
          },
          organizer: {
            '@type': 'Organization',
            name: '보광극장',
            url: 'https://bktheater.com',
          },
          performer: {
            '@type': 'PerformingGroup',
            name: performance.value.title,
          },
          url: window.location.href,
        });
      } else {
        removeJsonLd('article');
      }
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

    const init = async () => {
      // 다른 상세로 이동 시 이전 데이터 잔상 제거 + 상단으로
      performance.value = new PerfoEntity();
      relatedPerformances.value = [];
      window.scrollTo({ top: 0 });
      await loadPerfoDetail();
      applySeo();
      await updateViews();
      await loadRelated();
      setupFileDownloadLinks();
    };

    onMounted(init);

    // 관련 공연 카드로 이동하면 라우트만 바뀌고 컴포넌트는 재사용되므로 id를 감시해 재로딩
    watch(currentId, () => {
      init();
    });

    onUnmounted(() => {
      removeJsonLd('article');
    });

    return {
      performance,
      relatedPerformances,
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
    <h1>자체 프로그램 상세</h1>
    <div class="performance-detail-container">
      <!-- 좌측: 포스터 -->
      <div class="left-section">
        <div class="thumbnail-wrapper">
          <img :src="performance.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="performance.title" class="thumbnail-image" @error="handleImageError" />
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

        <div class="back-button-wrapper">
          <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
        </div>
      </div>
    </div>

    <!-- 다른 공연 보기 -->
    <section v-if="relatedPerformances.length" class="related-section">
      <div class="related-header">
        <h2 class="related-heading">다른 공연 보기</h2>
        <router-link to="/performance" class="related-more">더보기 +</router-link>
      </div>
      <div class="related-grid">
        <router-link
          v-for="p in relatedPerformances"
          :key="p.perIdx"
          :to="`/performance/${p.perIdx}`"
          class="related-card">
          <div class="related-image">
            <img loading="lazy" :src="p.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="p.title" @error="handleImageError" />
          </div>
          <div class="related-body">
            <span v-if="p.category" class="related-tag" :class="`category-${p.category.toLowerCase()}`">
              {{ getCategoryLabel(p.category) }}
            </span>
            <h3 class="related-title">{{ p.title }}</h3>
          </div>
        </router-link>
      </div>
    </section>
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

/* 다른 공연 보기 */
.related-section {
  margin-top: 3.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid #ececec;
}

.related-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.related-heading {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.related-more {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  color: #a72f47;
  text-decoration: none;
}

.related-more:hover {
  text-decoration: underline;
}

/* 한 줄 고정: 화면 폭에 맞는 개수만 노출(스크롤/줄바꿈 없음) */
.related-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.25rem;
}

.related-card:nth-child(n + 7) {
  display: none;
}

.related-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s ease;
}

.related-card:hover {
  transform: translateY(-4px);
}

.related-image {
  width: 100%;
  aspect-ratio: 5 / 8;
  overflow: hidden;
  border-radius: 12px;
  background: #f5f5f5;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.related-card:hover .related-image img {
  transform: scale(1.04);
}

.related-body {
  margin-top: 0.6rem;
}

.related-tag {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.related-tag.category-perfo {
  background: rgba(115, 110, 146, 0.12);
  color: #736e92;
}

.related-tag.category-edu {
  background: rgba(167, 47, 71, 0.12);
  color: #a72f47;
}

.related-tag.category-event {
  background: rgba(88, 84, 64, 0.12);
  color: #585440;
}

.related-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  margin: 0;
  word-break: keep-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .related-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .related-card:nth-child(n + 5) {
    display: none;
  }
}

@media (max-width: 700px) {
  .related-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .related-card:nth-child(n + 4) {
    display: none;
  }
}

@media (max-width: 480px) {
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.9rem;
  }
  .related-card:nth-child(n + 3) {
    display: none;
  }
}

/* Quill 에디터 콘텐츠 링크 스타일은 notice.scss에서 상속됨 */

:deep(.notice-content a) {
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
}

:deep(.notice-content a:hover) {
  color: #0052a3;
}
</style>
