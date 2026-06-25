import { ref } from 'vue';

/**
 * 비동기 데이터 로딩의 로딩/에러 상태를 표준화한다.
 *
 * - run(loader)로 로더를 감싸면 isLoading 토글과 에러 캐치를 자동 처리한다.
 * - loader가 던진 값이 문자열이든 Error든 모두 잡아 error(string)에 담는다.
 *   (현재 api 래퍼는 문자열로 reject하므로 둘 다 대응)
 */
export function useAsyncData() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const run = async <T>(loader: () => Promise<T>): Promise<T | undefined> => {
    isLoading.value = true;
    error.value = null;
    try {
      return await loader();
    } catch (e: unknown) {
      error.value =
        typeof e === 'string'
          ? e
          : e instanceof Error
            ? e.message
            : '요청을 처리하는 중 문제가 발생했습니다.';
      console.error(e);
      return undefined;
    } finally {
      isLoading.value = false;
    }
  };

  return { isLoading, error, run };
}
