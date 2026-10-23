<script lang="ts">
import { computed, defineComponent, onMounted, onServerPrefetch, onUnmounted, ref, watch } from 'vue';
import BaseShareButton from '@/components/common/BaseShareButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getBoardList, increaseBoardViews } from '@/api/board.api';
import { ApiError } from '@/api/request.util';
import dayjs from 'dayjs';
import { getApiClient } from '@/utils/apiClient';
import {
  setMetaTags,
  setJsonLd,
  removeJsonLd,
  toPlainText,
  setRobotsMeta,
  pageSeoConfig,
  ROBOTS_INDEX,
  ROBOTS_NOINDEX,
  SITE_URL,
} from '@/utils/seo.util';
import { setupFileDownloadLinks } from '@/utils/file-download';
import { usePrerenderStore } from '@/stores/prerender-store';
import { TYPE_BOARD } from '@/types';

// 글 종류별 정식 경로. 글은 id 로만 조회되므로 /notice/<보도자료 id> 처럼
// 다른 종류의 경로로도 열린다 — 그대로 두면 같은 글이 두 주소로 노출돼
// 검색엔진이 중복 페이지로 본다.
const PATH_BY_BOARD_TYPE: Record<string, string> = {
  [TYPE_BOARD.NORMAL]: '/notice',
  [TYPE_BOARD.NEWS]: '/news',
};

/**
 * 공지사항/보도자료 상세 공용 페이지.
 * NewsDetail.vue / NoticeDetail.vue 가 문구·경로만 다른 복붙이어서 하나로 합치고,
 * 각 뷰는 props 만 주입하는 얇은 래퍼로 남긴다.
 */
export default defineComponent({
  name: 'boardDetailPage',
  components: { BaseShareButton },
  props: {
    /** TYPE_BOARD 값 (NORMAL/NEWS) — 이전/다음 글 조회에 사용 */
    boardType: { type: String, required: true },
    /** 목록/상세 경로 prefix (예: '/news') */
    listPath: { type: String, required: true },
    /** h1 제목 (예: '보도자료 상세') */
    title: { type: String, required: true },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const noticeIdx = computed(() => String(route.params.id));
    const prerender = usePrerenderStore();
    // 프리렌더가 담아 둔 글이 있으면 그걸로 첫 렌더를 한다. SSR 과 클라이언트 첫 렌더가
    // 같은 데이터를 쓰므로 하이드레이션 불일치도, 본문이 잠깐 비는 깜빡임도 없다.
    const prefetched = prerender.take<BoardEntity>(route.path);
    const notice = ref<BoardEntity>(Object.assign(new BoardEntity(), prefetched));
    const notFound = ref(false);
    // "서버가 글이 없다고 답했다" — 통신 실패와 구분한다. 통신 실패에 noindex 를 걸면
    // API 가 잠깐 끊긴 사이 크롤링된 멀쩡한 글이 색인에서 빠진다.
    const confirmedMissing = ref(false);
    const prevPost = ref<BoardEntity | null>(null); // 이전 글 (더 오래된)
    const nextPost = ref<BoardEntity | null>(null); // 다음 글 (더 최신)
    const apiClient = getApiClient();

    const goBack = () => {
      router.push(props.listPath);
    };

    /** @returns 글 종류가 달라 정식 경로로 이동시켰으면 true (이후 초기화를 중단해야 한다) */
    const loadBoardDetail = async (): Promise<boolean> => {
      const param = new SearchBoardDto();
      param.boardIdx = noticeIdx.value;

      // 삭제된 글·잘못된 id 는 빈 배열로 오므로 length 까지 확인해야
      // undefined 대입 → 이후 접근에서 크래시가 나지 않는다
      return await getBoardList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data && res.data.length > 0) {
            notice.value = res.data[0];
            const canonicalPath = PATH_BY_BOARD_TYPE[notice.value.boardType ?? ''];
            if (canonicalPath && canonicalPath !== props.listPath) {
              router.replace(`${canonicalPath}/${noticeIdx.value}`);
              return true;
            }
          } else {
            notFound.value = true;
            confirmedMissing.value = true;
          }
          return false;
        })
        .catch((err: unknown) => {
          notFound.value = true;
          // 서버가 resultCode 를 돌려줬다면(잘못된 id 로 조회 실패 등) 답을 받은 것이다.
          // resultCode 가 없으면 통신 자체가 실패한 것이므로 색인 상태를 건드리지 않는다.
          confirmedMissing.value = err instanceof ApiError && err.resultCode !== undefined;
          return false;
        });
    };

    // 작성일 최신순 기준 이전(더 오래된)/다음(더 최신) 글.
    // API 목록 순서는 정렬이 보장되지 않아 클라이언트에서 정렬한다.
    const loadAdjacentPosts = async () => {
      const param = new SearchBoardDto();
      param.boardType = props.boardType;
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
      // 두 번째 인자로 경로를 넘겨 canonical/og:url 을 쿼리스트링 없는 정식 주소로 만든다.
      // (window.location.href 를 쓰면 ?utm_source=... 가 붙은 채 들어온 방문이
      //  그 주소를 canonical 로 선언해 검색엔진이 별개 페이지로 본다)
      setMetaTags({
        title: `${notice.value.title} | 보광극장`,
        description,
        ogTitle: `${notice.value.title} | 보광극장`,
        ogDescription: description,
      }, route.path);
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
        mainEntityOfPage: SITE_URL + route.path,
      });
    };

    const init = async () => {
      notFound.value = false;
      confirmedMissing.value = false;
      const redirected = await loadBoardDetail();
      if (redirected) return;
      if (notFound.value) {
        // 서버는 없는 주소에도 홈 HTML 을 200 으로 준다. noindex 를 걸지 않으면
        // 검색엔진이 이 주소를 홈페이지 사본(soft 404)으로 색인한다.
        // 통신 실패일 때는 건드리지 않는다 — 글은 멀쩡한데 색인만 빠질 수 있다.
        if (confirmedMissing.value) {
          setMetaTags({ ...pageSeoConfig.notFound, canonical: SITE_URL + route.path });
          setRobotsMeta(ROBOTS_NOINDEX);
        }
        return;
      }
      applySeo();
      await updateViews();
      setupFileDownloadLinks();
      loadAdjacentPosts();
    };

    // 빌드(프리렌더) 시점에 본문을 받아 정적 HTML 에 담는다.
    // 조회수 증가·이전/다음 글 조회는 빌드 때 할 일이 아니므로 상세만 받는다.
    onServerPrefetch(async () => {
      await loadBoardDetail();
      if (notFound.value) {
        // 빌드 중 통신이 실패했을 뿐일 수 있다 — "찾을 수 없음" 을 정적 HTML 에 굽지 않는다
        notFound.value = false;
        return;
      }
      prerender.set(route.path, notice.value);
    });

    onMounted(init);

    // 이전/다음 글 이동 시 같은 컴포넌트가 재사용되므로 param 변경을 감지해 다시 로드
    watch(
      () => route.params.id,
      async (id, oldId) => {
        if (!id || id === oldId || !route.path.startsWith(`${props.listPath}/`)) return;
        notice.value = new BoardEntity();
        await init();
        window.scrollTo({ top: 0 });
      },
    );

    onUnmounted(() => {
      removeJsonLd('article');
      // SPA 라 head 가 그대로 남는다 — 없는 글에서 나갈 때 색인 허용으로 되돌린다
      setRobotsMeta(ROBOTS_INDEX);
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
    <h1>{{ title }}</h1>

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
      <!-- body 가 없는 동안 v-html 이 "undefined" 를 그대로 찍지 않도록 빈 문자열로 받는다 -->
      <div class="notice-content" v-html="notice.body || ''"></div>

      <!-- 이전/다음 글 -->
      <nav v-if="prevPost || nextPost" class="post-nav" aria-label="이전 다음 글">
        <router-link v-if="nextPost" :to="`${listPath}/${nextPost.boardIdx}`" class="post-nav-item">
          <span class="post-nav-label">↑ 다음 글</span>
          <span class="post-nav-title">{{ nextPost.title }}</span>
        </router-link>
        <router-link v-if="prevPost" :to="`${listPath}/${prevPost.boardIdx}`" class="post-nav-item">
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
