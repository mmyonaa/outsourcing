import postgres from "postgres";
import {
  BoardEntity,
  SearchBoardDto,
  UPDATABLE_BOARD_COLUMNS,
} from "./dto/board.dto";
import { getSafePagination } from "./dto/basic.dto";
import { escapeLike } from "../utils/common.util";

export const getBoardList = (sql: postgres.Sql, reqParam: SearchBoardDto) => {
  const { rows, offset } = getSafePagination(reqParam);

  return sql<BoardEntity[]>`
      SELECT *
      FROM public.board
      WHERE 1 = 1
        AND del_yn = 'N'
          ${
            reqParam.boardIdx
              ? sql` AND board_idx =${reqParam.boardIdx}`
              : sql``
          }
          ${
            reqParam.boardType
              ? sql` AND board_type =${reqParam.boardType}`
              : sql``
          }
          ${
            reqParam.keyword
              ? sql` AND title ILIKE ${'%' + escapeLike(reqParam.keyword) + '%'}`
              : sql``
          }
    ORDER BY best_yn DESC, mod_dt DESC
    LIMIT ${rows} OFFSET ${offset}
  `;
};

export const getBoardListCount = (
  sql: postgres.Sql,
  reqParam: SearchBoardDto
) => {
  return sql<BoardEntity[]>`
    SELECT COUNT(*) as total_count
      FROM public.board
      WHERE 1 = 1
        AND del_yn = 'N'
          ${
            reqParam.boardIdx
              ? sql` AND board_idx =${reqParam.boardIdx}`
              : sql``
          }
          ${
            reqParam.boardType
              ? sql` AND board_type =${reqParam.boardType}`
              : sql``
          }
          ${
            reqParam.keyword
              ? sql` AND title ILIKE ${'%' + escapeLike(reqParam.keyword) + '%'}`
              : sql``
          }
  `;
};

export const insertBoard = (
  sql: postgres.Sql,
  reqParam: BoardEntity
): Promise<any> => {
  return sql`
    INSERT INTO public.board 
        ${sql(
          reqParam,
          "title",
          "body",
          "bestYn",
          "author",
          "boardType"
        )} RETURNING * 
  `;
};

export const updateBoard = (
  sql: postgres.Sql,
  reqParam: BoardEntity,
  columns: (keyof BoardEntity)[] = UPDATABLE_BOARD_COLUMNS
): Promise<any> => {
  // 허용 목록과 교집합만 SET — 미전송 필드가 NULL/기본값으로 덮이는 것 방지
  const cols = columns.filter((c) => UPDATABLE_BOARD_COLUMNS.includes(c));
  if (cols.length === 0) {
    // sql(reqParam) 에 컬럼이 하나도 없으면 전체 키가 SET 되므로 반드시 차단
    throw new Error("업데이트할 컬럼이 없습니다.");
  }
  return sql`
    UPDATE public.board SET
      ${sql(reqParam, ...cols)},
      mod_dt = CURRENT_TIMESTAMP
    WHERE board_idx = ${reqParam.boardIdx}
    RETURNING *
  `;
};

export const increaseBoardViews = (
  sql: postgres.Sql,
  boardIdx: string
): Promise<BoardEntity[]> => {
  // 서버에서 원자적으로 +1 — 클라이언트가 보낸 값을 저장하는 방식의
  // 경합(증가분 유실)/조작 문제가 없다. mod_dt는 건드리지 않는다
  // (목록이 mod_dt 정렬이라 조회만으로 순서가 바뀌면 안 됨)
  return sql<BoardEntity[]>`
    UPDATE public.board SET
      views = views + 1
    WHERE board_idx = ${boardIdx}
      AND del_yn = 'N'
    RETURNING *
  `;
};

export const deleteBoard = (
  sql: postgres.Sql,
  boardIdx: string
): Promise<BoardEntity[]> => {
  // 단일 UPDATE로 소프트 삭제 — SELECT 후 전체 컬럼을 되쓰는 방식의
  // 동시 수정 유실(read-modify-write) 없이 존재 확인까지 한 번에 처리
  return sql<BoardEntity[]>`
    UPDATE public.board SET
      del_yn = 'Y',
      mod_dt = CURRENT_TIMESTAMP
    WHERE board_idx = ${boardIdx}
      AND del_yn = 'N'
    RETURNING *
  `;
};
