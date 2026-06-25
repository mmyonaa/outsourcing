import { ORDER_TYPE } from "../../../types";

export class BasicListDto {
  //키워드 검색
  keyword: string | undefined = undefined;
  //정렬 타입
  orderType: ORDER_TYPE | undefined = undefined;
  //페이지
  page = 1;
  //로우 카운트
  rows: number | undefined = undefined;
}

// 페이지네이션 상한 (DoS 방지)
export const DEFAULT_ROWS = 10;
export const MAX_ROWS = 100;

/**
 * 클라이언트가 보낸 page/rows 값을 안전한 범위로 보정한다.
 * - rows: 1 ~ MAX_ROWS 로 제한 (과도한 요청으로 인한 DB 리소스 고갈 방지)
 * - page: 1 이상으로 보정 (음수 offset 방지)
 */
export const getSafePagination = (reqParam: BasicListDto) => {
  const page = Math.max(1, Number(reqParam.page) || 1);
  const rows = Math.min(
    Math.max(1, Number(reqParam.rows) || DEFAULT_ROWS),
    MAX_ROWS,
  );
  const offset = (page - 1) * rows;
  return { page, rows, offset };
};
