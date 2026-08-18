import { onMounted, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { ResponseDto } from '@/api/dto/response.dto';
import { useAsyncData } from '@/composables/useAsyncData';

interface AdminListOptions<T, P> {
  /** 한 페이지당 행 수 */
  rows: number;
  /** 페이지/행수/키워드를 받아 검색 파라미터(DTO)를 생성한다. 카테고리 등 뷰별 필터는 클로저로 주입 */
  buildParam: (ctx: { page: number; rows: number; keyword?: string }) => P;
  /** 생성된 파라미터로 목록을 조회한다 */
  fetch: (param: P) => Promise<ResponseDto<T[]>>;
}

/**
 * 관리자 목록 화면의 공통 로직(검색·페이지네이션·로딩/에러·라우트 동기화)을 표준화한다.
 *
 * 뷰별로 다른 부분(DTO 종류, boardType/perType/category 등)은 buildParam/fetch로 주입하고,
 * 템플릿은 각 뷰가 그대로 유지한다.
 */
export function useAdminList<T, P>(options: AdminListOptions<T, P>) {
  const route = useRoute();
  const router = useRouter();
  const items = ref<T[]>([]) as Ref<T[]>;
  const totalPage = ref<number>(0);
  const searchKeyword = ref<string>('');
  const { isLoading, error, run } = useAsyncData();

  const load = () =>
    run(async () => {
      const page = route.query.pageNo ? Number(route.query.pageNo) : 1;
      const param = options.buildParam({
        page,
        rows: options.rows,
        keyword: searchKeyword.value || undefined,
      });
      const res = await options.fetch(param);
      if (res.resultCode === 0 && res.data) {
        items.value = res.data;
        totalPage.value = res.totalCount ? Math.ceil(res.totalCount / options.rows) : 0;
      }
    });

  /** 1페이지로 이동 후 재조회 (검색/필터 변경 시) */
  const goFirstPageAndLoad = () => {
    const currentPage = route.query.pageNo ? Number(route.query.pageNo) : 1;
    if (currentPage === 1) {
      // 이미 1페이지면 push가 no-op이라 watch가 울리지 않으므로 직접 로드
      load();
    } else {
      // 로드는 pageNo watch 한 곳에서만 트리거한다.
      // (push 직후 동기 load()는 아직 갱신 전인 이전 pageNo로 요청을 만들어
      //  중복 fetch + 응답 순서에 따라 이전 페이지가 표시되는 레이스가 있었다)
      router.push({ query: { ...route.query, pageNo: 1 } });
    }
  };

  // 페이지 번호 변경 감지
  watch(
    () => route.query.pageNo,
    () => load(),
  );

  onMounted(() => load());

  return { items, totalPage, searchKeyword, isLoading, error, load, goFirstPageAndLoad };
}
