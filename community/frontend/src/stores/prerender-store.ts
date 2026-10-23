import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 프리렌더(SSR) 단계에서 받아 둔 상세 데이터를 클라이언트 첫 렌더까지 넘기는 저장소.
 *
 * 상세 페이지는 데이터를 onMounted(클라이언트 전용)에서 받으므로, 그대로 두면
 * 프리렌더된 정적 HTML 의 본문이 비어 있다(제목 칸 공백, 본문 칸에 "undefined").
 * 검색엔진이 받는 첫 HTML 에 본문이 없고, 사용자도 로딩 순간 그게 보인다.
 *
 * 그래서 onServerPrefetch 로 빌드 시점에 받아 두고, 그 값을 여기에 담는다.
 * vite-ssg 가 이 pinia 상태를 `window.__INITIAL_STATE__` 로 직렬화하므로
 * 클라이언트는 같은 데이터로 첫 렌더를 해 하이드레이션 불일치가 생기지 않는다.
 *
 * 경로를 키로 쓴다 — 프리렌더는 라우트 하나당 HTML 하나를 만드므로 항목도 하나뿐이다.
 */
export const usePrerenderStore = defineStore('prerender', () => {
  const entries = ref<Record<string, unknown>>({});

  function set(path: string, data: unknown) {
    entries.value[path] = data;
  }

  /**
   * 담아 둔 값을 꺼내면서 비운다.
   * 비우지 않으면 SPA 로 다른 상세로 이동했을 때 옛 글이 잠깐 보인다.
   */
  function take<T>(path: string): T | undefined {
    const data = entries.value[path] as T | undefined;
    delete entries.value[path];
    return data;
  }

  return { entries, set, take };
});
