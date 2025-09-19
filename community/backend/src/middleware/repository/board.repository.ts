import postgres from "postgres";
import { BoardEntity, SearchBoardDto } from "./dto/board.dto";

export const getBoardList = (sql: postgres.Sql, reqParam: SearchBoardDto) => {
  return sql<BoardEntity[]>`
      SELECT *
      FROM public.board
      WHERE 1 = 1
        AND del_yn = 'N' 
          ${reqParam.boardIdx
      ? sql` AND board_idx =${reqParam.boardIdx}`
      : sql``
    }
    ORDER BY best_yn DESC, reg_dt DESC
  `;
};

export const insertBoard = (sql: postgres.Sql, reqParam: BoardEntity): Promise<any> => {
  return sql`
    INSERT INTO public.board 
        ${sql(
        reqParam,
        'title',
        'body',
        'bestYn'
    )} RETURNING * 
  `;
};

export const updateBoard = (
  sql: postgres.Sql,
  reqParam: BoardEntity,
): Promise<any> => {
  return sql`
    UPDATE public.board SET
      ${sql(reqParam, 'title', 'body', 'bestYn')},
      mod_dt = CURRENT_TIMESTAMP
    WHERE board_idx = ${reqParam.boardIdx}
    RETURNING *
  `;
};

export const deleteBoard = (
  sql: postgres.Sql,
  boardIdx: number,
): Promise<BoardEntity[]> => {
  return sql<BoardEntity[]>`
    UPDATE public.board
    SET del_yn = 'Y',
        mod_dt = CURRENT_TIMESTAMP
    WHERE board_idx = ${boardIdx}
    RETURNING *
  `;
};

