<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { setMetaTags, setRobotsMeta, pageSeoConfig, ROBOTS_INDEX, ROBOTS_NOINDEX, SITE_URL } from '@/utils/seo.util';

/**
 * 어느 라우트에도 맞지 않는 주소를 받는 페이지.
 *
 * 서버(vite preview)는 매칭되지 않는 경로에도 index.html 을 200 으로 돌려주므로,
 * 이 라우트가 없으면 없는 주소가 "홈페이지 사본"으로 보인다
 * (Search Console 의 soft 404 · 중복 페이지로 쌓인다).
 * 여기서 noindex 를 걸어 색인에서 빼고, canonical 도 홈을 가리키지 않게 치운다.
 */
export default defineComponent({
  name: 'notFound',
  setup() {
    const router = useRouter();

    const goHome = () => {
      router.push('/');
    };

    onMounted(() => {
      // canonical 이 남아 있으면 구글이 이 주소를 홈의 대체 페이지로 묶으므로
      // 자기 자신을 가리키게 해 두고 noindex 로 색인만 막는다
      setMetaTags({ ...pageSeoConfig.notFound, canonical: SITE_URL + window.location.pathname });
      setRobotsMeta(ROBOTS_NOINDEX);
    });

    onUnmounted(() => {
      // SPA 라 head 가 그대로 남는다 — 다른 페이지로 나갈 때 색인 허용으로 되돌린다
      setRobotsMeta(ROBOTS_INDEX);
    });

    return { goHome };
  },
});
</script>

<template>
  <div class="page-common not-found-page">
    <h1>페이지를 찾을 수 없습니다</h1>
    <div class="detail-not-found">
      <p>
        요청하신 주소에 해당하는 페이지가 없습니다.<br />
        주소가 바뀌었거나 삭제된 페이지일 수 있습니다.
      </p>
      <button class="back-button" @click="goHome">← 홈으로 돌아가기</button>
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
</style>
