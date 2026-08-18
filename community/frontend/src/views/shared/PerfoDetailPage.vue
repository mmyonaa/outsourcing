<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import BaseShareButton from '@/components/common/BaseShareButton.vue';
import ImageLightbox from '@/components/common/ImageLightbox.vue';
import { useRoute, useRouter } from 'vue-router';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getPerfoList, increasePerfoViews } from '@/api/perfo.api';
import dayjs from 'dayjs';
import { getApiClient } from '@/utils/apiClient';
import { handleImageError } from '@/utils/common-util';
import { getCategoryLabel } from '@/utils/perfo-util';
import { setupFileDownloadLinks } from '@/utils/file-download';
import { setMetaTags, setJsonLd, removeJsonLd, toPlainText, extractEventDates } from '@/utils/seo.util';

/**
 * 자체/대관 프로그램 상세 공용 페이지.
 * PerformanceDetail.vue / PerformanceNextDetail.vue 가 타입·경로·문구만 다른 복붙이어서
 * 하나로 합치고, 각 뷰는 props 만 주입하는 얇은 래퍼로 남긴다.
 */
export default defineComponent({
  name: 'perfoDetailPage',
  components: { BaseShareButton, ImageLightbox },
  props: {
    /** TYPE_PERFO 값 (NORMAL/NEXT) — 관련 공연 조회의 기본 타입 */
    perType: { type: String, required: true },
    /** 목록/상세 경로 prefix (예: '/performance') */
    listPath: { type: String, required: true },
    /** h1 제목 (예: '자체 프로그램 상세') */
    title: { type: String, required: true },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const currentId = computed(() => String(route.params.id));
    const performance = ref<PerfoEntity>(new PerfoEntity());
    const relatedPerformances = ref<PerfoEntity[]>([]);
    const notFound = ref(false);
    const apiClient = getApiClient();

    const goBack = () => {
      router.push(props.listPath);
    };

    const loadPerfoDetail = async () => {
      const param = new SearchPerfoDto();
      param.perIdx = currentId.value;

      // 삭제된 글·잘못된 id 는 빈 배열로 오므로 length 까지 확인해야
      // undefined 대입 → 이후 접근에서 크래시가 나지 않는다
      await getPerfoList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data && res.data.length > 0) {
            performance.value = res.data[0];
          } else {
            notFound.value = true;
          }
        })
        .catch(() => {
          notFound.value = true;
        });
    };

    // 현재 글과 같은 프로그램 유형 중 현재 글을 제외하고 최신순 한 줄(최대 6개)
    // 백엔드가 reg_dt DESC로 정렬하므로 별도 정렬 불필요
    const loadRelated = async () => {
      const param = new SearchPerfoDto();
      param.perType = performance.value.perType || props.perType;
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
      // 조회수는 서버가 원자적으로 +1 한다.
      // (전체 엔티티를 update API로 보내던 방식은 경합·본문 덮어쓰기 위험이 있었음)
      await increasePerfoViews(apiClient, currentId.value).catch(() => {});
      performance.value.views++;
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

    const init = async () => {
      // 다른 상세로 이동 시 이전 데이터 잔상 제거 + 상단으로
      performance.value = new PerfoEntity();
      relatedPerformances.value = [];
      notFound.value = false;
      window.scrollTo({ top: 0 });
      await loadPerfoDetail();
      if (notFound.value) return;
      applySeo();
      await updateViews();
      await loadRelated();
      setupFileDownloadLinks();
    };

    onMounted(init);

    // 관련 공연 카드로 이동하면 라우트만 바뀌고 컴포넌트는 재사용되므로 id를 감시해 재로딩
    watch(currentId, () => {
      // 목록으로 이탈할 때도 watch가 발동하는데, 그때 params.id 가 사라져
      // "undefined" id 로 API 를 호출하게 되므로 가드한다
      if (!route.params.id) return;
      init();
    });

    onUnmounted(() => {
      removeJsonLd('article');
    });

    return {
      performance,
      relatedPerformances,
      notFound,
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
    <h1>{{ title }}</h1>

    <!-- 삭제되었거나 존재하지 않는 id 로 진입한 경우 -->
    <div v-if="notFound" class="detail-not-found">
      <p>요청하신 공연을 찾을 수 없습니다.<br />삭제되었거나 잘못된 주소일 수 있습니다.</p>
      <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
    </div>

    <div v-else class="performance-detail-container">
      <!-- 좌측: 포스터 -->
      <div class="left-section">
        <div class="thumbnail-wrapper">
          <image-lightbox :src="performance.imgUrl" :alt="performance.title">
          <img :src="performance.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="performance.title" class="thumbnail-image" @error="handleImageError" />
          </image-lightbox>
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
            <span>작성일: {{ dayjs(performance.regDt).format('YY.MM.DD') }}</span>
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
        <router-link :to="listPath" class="related-more">더보기 +</router-link>
      </div>
      <div class="related-grid">
        <router-link
          v-for="p in relatedPerformances"
          :key="p.perIdx"
          :to="`${listPath}/${p.perIdx}`"
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
.detail-not-found {
  text-align: center;
  padding: 5rem 1rem;
  color: #666;
  font-size: 15px;
  line-height: 1.8;
}

.detail-not-found .back-button {
  margin-top: 1.5rem;
}

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
  position: relative;
}

/* 흰 배경 포스터 경계선 오버레이 */
.thumbnail-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
  pointer-events: none;
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
  position: relative;
}

/* 흰 배경 포스터 경계선 오버레이 */
.related-image::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
  pointer-events: none;
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
