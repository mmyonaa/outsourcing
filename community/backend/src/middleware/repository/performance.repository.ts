import postgres from "postgres";
import {
  PerfoEntity,
  SearchPerfoDto,
  UPDATABLE_PERFO_COLUMNS,
} from "./dto/perfo.dto";
import { getSafePagination } from "./dto/basic.dto";
import { escapeLike } from "../utils/common.util";

export const getPerfoList = (sql: postgres.Sql, reqParam: SearchPerfoDto) => {
  const { rows, offset } = getSafePagination(reqParam);

  return sql<PerfoEntity[]>`
      SELECT *
      FROM public.performance
      WHERE 1 = 1
        AND del_yn = 'N'
          ${reqParam.perIdx ? sql` AND per_idx =${reqParam.perIdx}` : sql``}
    ${reqParam.perType ? sql` AND per_type =${reqParam.perType}` : sql``}
    ${reqParam.category ? sql` AND category =${reqParam.category}` : sql``}
              ${
                reqParam.keyword
                  ? sql` AND title ILIKE ${"%" + escapeLike(reqParam.keyword) + "%"}`
                  : sql``
              }
    ORDER BY reg_dt DESC
    LIMIT ${rows} OFFSET ${offset}
  `;
};

export const getPerfoListCount = (
  sql: postgres.Sql,
  reqParam: SearchPerfoDto
) => {
  return sql<{ totalCount: string }[]>`
    SELECT COUNT(*) as total_count
      FROM public.performance
      WHERE 1 = 1
        AND del_yn = 'N' 
          ${reqParam.perIdx ? sql` AND per_idx =${reqParam.perIdx}` : sql``}
    ${reqParam.perType ? sql` AND per_type =${reqParam.perType}` : sql``}
    ${reqParam.category ? sql` AND category =${reqParam.category}` : sql``}
              ${
                reqParam.keyword
                  ? sql` AND title ILIKE ${"%" + escapeLike(reqParam.keyword) + "%"}`
                  : sql``
              }      
    `;
};

export const insertPerfo = (
  sql: postgres.Sql,
  reqParam: PerfoEntity
): Promise<PerfoEntity[]> => {
  const cols: (keyof PerfoEntity)[] = [
    "title",
    "titleSec",
    "titleThird",
    "body",
    "perType",
    "author",
    "imgUrl",
    "category",
  ];
  return sql<PerfoEntity[]>`
    INSERT INTO public.performance
        ${sql(reqParam, ...cols)} RETURNING *
  `;
};

export const updatePerfo = (
  sql: postgres.Sql,
  reqParam: PerfoEntity,
  columns: (keyof PerfoEntity)[] = UPDATABLE_PERFO_COLUMNS
): Promise<PerfoEntity[]> => {
  // 허용 목록과 교집합만 SET — 미전송 필드가 NULL/기본값으로 덮이는 것 방지.
  // imgUrl도 "보낸 경우에만" SET 되므로 별도 truthy 분기가 필요 없다
  // (빈 문자열을 보내면 이미지 제거도 가능).
  const cols = columns.filter((c) => UPDATABLE_PERFO_COLUMNS.includes(c));
  if (cols.length === 0) {
    // sql(reqParam) 에 컬럼이 하나도 없으면 전체 키가 SET 되므로 반드시 차단
    throw new Error("업데이트할 컬럼이 없습니다.");
  }
  return sql<PerfoEntity[]>`
    UPDATE public.performance SET
      ${sql(reqParam, ...cols)},
      mod_dt = CURRENT_TIMESTAMP
    WHERE per_idx = ${reqParam.perIdx}
    RETURNING *
  `;
};

export const increasePerfoViews = (
  sql: postgres.Sql,
  perIdx: string
): Promise<PerfoEntity[]> => {
  // 서버에서 원자적으로 +1 — 클라이언트가 보낸 값을 저장하는 방식의
  // 경합(증가분 유실)/조작 문제가 없다. mod_dt는 건드리지 않는다
  return sql<PerfoEntity[]>`
    UPDATE public.performance SET
      views = views + 1
    WHERE per_idx = ${perIdx}
      AND del_yn = 'N'
    RETURNING *
  `;
};

export const deletePerfo = (
  sql: postgres.Sql,
  perIdx: string
): Promise<PerfoEntity[]> => {
  // 단일 UPDATE로 소프트 삭제 — SELECT 후 전체 컬럼을 되쓰는 방식의
  // 동시 수정 유실(read-modify-write) 없이 존재 확인까지 한 번에 처리
  return sql<PerfoEntity[]>`
    UPDATE public.performance SET
      del_yn = 'Y',
      mod_dt = CURRENT_TIMESTAMP
    WHERE per_idx = ${perIdx}
      AND del_yn = 'N'
    RETURNING *
  `;
};
