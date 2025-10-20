import postgres from "postgres";
import { BoardEntity, SearchBoardDto } from "./dto/board.dto";

export const getBoardList = (sql: postgres.Sql, reqParam: SearchBoardDto) => {
  const page = reqParam.page || 1;
  const rows = reqParam.rows || 10;
  const offset = (page - 1) * rows;

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
              ? sql` AND title ILIKE ${'%' + reqParam.keyword + '%'}`
              : sql``
          }
    ORDER BY best_yn DESC, reg_dt DESC
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
              ? sql` AND title ILIKE ${'%' + reqParam.keyword + '%'}`
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
  reqParam: BoardEntity
): Promise<any> => {
  return sql`
    UPDATE public.board SET
      ${sql(reqParam, "title", "body", "bestYn", "delYn", "views")},
      mod_dt = CURRENT_TIMESTAMP
    WHERE board_idx = ${reqParam.boardIdx}
    RETURNING *
  `;
};
