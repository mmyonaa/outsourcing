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
  `;
};

export const insertBoard = (sql: postgres.Sql, reqParam: BoardEntity): Promise<any> => {
  return sql`
    INSERT INTO board 
        ${sql(
        reqParam,
        'title',
        'body',
        'bestYn'
    )} RETURNING * 
  `;
};

export const updateBoard = (sql: postgres.Sql, reqParam: BoardEntity): Promise<any> => {
  return sql`
    UPDATE INTO board 
    SET mod_dt = CURRENT_TIMESTAMP
        ${sql(
        reqParam,
        'title',
        'body',
        'bestYn'
    )} RETURNING * 
  `;
};
