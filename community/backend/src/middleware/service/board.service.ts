import * as boardRepo from '../repository/board.repository'
import { BoardEntity, SearchBoardDto } from '../repository/dto/board.dto';
import { sql } from '../provider/database.provider'
import { withDbError } from '../utils/common.util';

/**
 * 글 조회
 */
export const getBoardList = (
  reqParam: SearchBoardDto,
): Promise<BoardEntity[]> =>
  withDbError(() => boardRepo.getBoardList(sql, reqParam));

export const getBoardListCount = (
  reqParam: SearchBoardDto,
): Promise<number> =>
  withDbError(async () => {
    const data = await boardRepo.getBoardListCount(sql, reqParam);
    return data.length > 0 ? Number(data[0].totalCount) : 0;
  });

/**
 * 글 등록
 */
export const insertBoard = (
  reqParam: BoardEntity,
): Promise<BoardEntity[]> =>
  withDbError(() => boardRepo.insertBoard(sql, reqParam));

/**
 * 글 수정 — columns: 실제 SET 할 컬럼(클라이언트가 보낸 필드)
 */
export const updateBoard = (
  reqParam: BoardEntity,
  columns?: (keyof BoardEntity)[],
): Promise<BoardEntity[]> =>
  withDbError(() => boardRepo.updateBoard(sql, reqParam, columns));

/**
 * 조회수 증가 (원자적 +1) — 갱신된 행 반환 (없으면 빈 배열)
 */
export const increaseBoardViews = (
  boardIdx: string,
): Promise<BoardEntity[]> =>
  withDbError(() => boardRepo.increaseBoardViews(sql, boardIdx));

/**
 * 글 삭제 (소프트 삭제) — 삭제된 행 반환 (없으면 빈 배열)
 */
export const deleteBoard = (
  boardIdx: string,
): Promise<BoardEntity[]> =>
  withDbError(() => boardRepo.deleteBoard(sql, boardIdx));
