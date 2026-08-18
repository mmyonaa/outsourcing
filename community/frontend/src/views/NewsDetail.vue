<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import BaseShareButton from '@/components/common/BaseShareButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getBoardList, increaseBoardViews } from '@/api/board.api';
import dayjs from 'dayjs';
import { getApiClient } from '@/utils/apiClient';
import { setMetaTags, setJsonLd, removeJsonLd, toPlainText } from '@/utils/seo.util';
import { TYPE_BOARD } from '@/types';

export default defineComponent({
  name: 'newsDetail',
  components: { BaseShareButton },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const noticeIdx = computed(() => String(route.params.id));
    const notice = ref<BoardEntity>(new BoardEntity());
    const notFound = ref(false);
    const prevPost = ref<BoardEntity | null>(null); // 이전 글 (더 오래된)
    const nextPost = ref<BoardEntity | null>(null); // 다음 글 (더 최신)
    const apiClient = getApiClient();

    const goBack = () => {
      router.push('/news'); // 공지 목록 페이지 경로
    };

    const loadBoardDetail = async () => {
      const param = new SearchBoardDto();
      param.boardIdx = noticeIdx.value;

      // 삭제된 글·잘못된 id 는 빈 배열로 오므로 length 까지 확인해야
      // undefined 대입 → 이후 접근에서 크래시가 나지 않는다
      await getBoardList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data && res.data.length > 0) {
            notice.value = res.data[0];
          } else {
            notFound.value = true;
          }
        })
        .catch(() => {
          notFound.value = true;
        });
    };

    // 작성일 최신순 기준 이전(더 오래된)/다음(더 최신) 글.
    // API 목록 순서는 정렬이 보장되지 않아 클라이언트에서 정렬한다.
    const loadAdjacentPosts = async () => {
      const param = new SearchBoardDto();
      param.boardType = TYPE_BOARD.NEWS;
      param.rows = 1000;

      await getBoardList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data) {
            const sorted = [...res.data].sort((a, b) => dayjs(b.regDt).valueOf() - dayjs(a.regDt).valueOf());
            const idx = sorted.findIndex(b => b.boardIdx === noticeIdx.value);
            prevPost.value = idx >= 0 ? sorted[idx + 1] || null : null;
            nextPost.value = idx > 0 ? sorted[idx - 1] : null;
          }
        })
        .catch(() => {
          prevPost.value = null;
          nextPost.value = null;
        });
    };

    const updateViews = async () => {
      // 조회수는 서버가 원자적으로 +1 한다.
      // (전체 엔티티를 update API로 보내던 방식은 경합·본문 덮어쓰기 위험이 있었음)
      await increaseBoardViews(apiClient, noticeIdx.value).catch(() => {});
      notice.value.views++;
    };

    // 로드된 글 내용으로 메타/OG/JSON-LD 갱신
    const applySeo = () => {
      if (!notice.value.title) return;
      const description = toPlainText(notice.value.body);
      setMetaTags({
        title: `${notice.value.title} | 보광극장`,
        description,
        ogTitle: `${notice.value.title} | 보광극장`,
        ogDescription: description,
      });
      setJsonLd('article', {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: notice.value.title,
        description,
        datePublished: notice.value.regDt,
        dateModified: notice.value.modDt,
        author: { '@type': 'Organization', name: notice.value.author || '보광극장' },
        publisher: {
          '@type': 'Organization',
          name: '보광극장',
          logo: { '@type': 'ImageObject', url: 'https://bktheater.com/assets/og-image.jpg' },
        },
        mainEntityOfPage: window.location.href,
      });
    };

    const setupFileDownloadLinks = async () => {
      // 본문(v-html)이 실제 DOM에 반영된 다음 틱에 링크를 찾는다 (setTimeout 타이밍 의존 제거)
      await nextTick();
      {
        const fileLinks = document.querySelectorAll<HTMLAnchorElement>(
          '.notice-content a[href*="amazonaws.com"], .notice-content a[href*="/uploads/"], .notice-content a[href*="/files/"]',
        );

        fileLinks.forEach(link => {
          const url = link.href;
          // 링크 텍스트를 파일명으로 사용 (Quill에서 원본 파일명으로 링크를 생성했으므로)
          const fileName = link.textContent?.trim() || url.split('/').pop()?.split('?')[0] || 'download';

          // download 속성 추가
          link.setAttribute('download', fileName);

          // 클릭 이벤트로 강제 다운로드
          link.addEventListener('click', async e => {
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
      }
    };

    const init = async () => {
      notFound.value = false;
      await loadBoardDetail();
      if (notFound.value) return;
      applySeo();
      await updateViews();
      setupFileDownloadLinks();
      loadAdjacentPosts();
    };

    onMounted(init);

    // 이전/다음 글 이동 시 같은 컴포넌트가 재사용되므로 param 변경을 감지해 다시 로드
    watch(
      () => route.params.id,
      async (id, oldId) => {
        if (!id || id === oldId || !route.path.startsWith('/news/')) return;
        await init();
        window.scrollTo({ top: 0 });
      },
    );

    onUnmounted(() => {
      removeJsonLd('article');
    });

    return {
      notice,
      prevPost,
      nextPost,
      notFound,
      dayjs,
      goBack,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>보도자료 상세</h1>

    <!-- 삭제되었거나 존재하지 않는 id 로 진입한 경우 -->
    <div v-if="notFound" class="detail-not-found">
      <p>요청하신 글을 찾을 수 없습니다.<br />삭제되었거나 잘못된 주소일 수 있습니다.</p>
      <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
    </div>

    <div v-else class="notice-detail">
      <div class="notice-title-row">
        <div class="notice-title">{{ notice.title }}</div>
        <base-share-button :title="notice.title" />
      </div>

      <div class="notice-meta">
        <span>작성자: {{ notice.author }}</span>
        <span>작성일: {{ dayjs(notice.regDt).format('YY.MM.DD') }}</span>
        <span>조회수: {{ notice.views }}</span>
      </div>
      <div class="notice-content" v-html="notice.body"></div>

      <!-- 이전/다음 글 -->
      <nav v-if="prevPost || nextPost" class="post-nav" aria-label="이전 다음 글">
        <router-link v-if="nextPost" :to="`/news/${nextPost.boardIdx}`" class="post-nav-item">
          <span class="post-nav-label">↑ 다음 글</span>
          <span class="post-nav-title">{{ nextPost.title }}</span>
        </router-link>
        <router-link v-if="prevPost" :to="`/news/${prevPost.boardIdx}`" class="post-nav-item">
          <span class="post-nav-label">↓ 이전 글</span>
          <span class="post-nav-title">{{ prevPost.title }}</span>
        </router-link>
      </nav>

      <!-- 🔽 돌아가기 버튼 -->
      <div class="back-button-wrapper">
        <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
      </div>
    </div>
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

.notice-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
}

.notice-content :deep(a) {
  color: #0066cc;
  text-decoration: underline;
  word-break: break-all;
}

.notice-content {
  overflow-wrap: break-word;
  word-break: break-word;
}

/* 이전/다음 글 내비게이션 */
.post-nav {
  margin-top: 3rem;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.post-nav-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 0.5rem;
  border-bottom: 1px solid #eee;
  text-decoration: none;
  color: inherit;
  font-family: 'Pretendard', sans-serif;
}

.post-nav-item:hover .post-nav-title {
  color: #e34363;
}

.post-nav-label {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: #999;
}

.post-nav-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.18s ease;
}
</style>
