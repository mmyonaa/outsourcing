import * as perfoRepo from '../repository/performance.repository'
import { PerfoEntity, SearchPerfoDto } from '../repository/dto/perfo.dto';
import { sql } from '../provider/database.provider'
import { withDbError } from '../utils/common.util';

/**
 * 글 조회
 */
export const getPerfoList = (
  reqParam: SearchPerfoDto,
): Promise<PerfoEntity[]> =>
  withDbError(() => perfoRepo.getPerfoList(sql, reqParam));

export const getPerfoListCount = (
  reqParam: SearchPerfoDto,
): Promise<number> =>
  withDbError(async () => {
    const data = await perfoRepo.getPerfoListCount(sql, reqParam);
    return data.length > 0 ? Number(data[0].totalCount) : 0;
  });

/**
 * 글 등록
 */
export const insertPerfo = (
  reqParam: PerfoEntity,
): Promise<PerfoEntity[]> =>
  withDbError(() => perfoRepo.insertPerfo(sql, reqParam));

/**
 * 글 수정 — columns: 실제 SET 할 컬럼(클라이언트가 보낸 필드)
 */
export const updatePerfo = (
  reqParam: PerfoEntity,
  columns?: (keyof PerfoEntity)[],
): Promise<PerfoEntity[]> =>
  withDbError(() => perfoRepo.updatePerfo(sql, reqParam, columns));

/**
 * 조회수 증가 (원자적 +1) — 갱신된 행 반환 (없으면 빈 배열)
 */
export const increasePerfoViews = (
  perIdx: string,
): Promise<PerfoEntity[]> =>
  withDbError(() => perfoRepo.increasePerfoViews(sql, perIdx));

/**
 * 글 삭제 (소프트 삭제) — 삭제된 행 반환 (없으면 빈 배열)
 */
export const deletePerfo = (
  perIdx: string,
): Promise<PerfoEntity[]> =>
  withDbError(() => perfoRepo.deletePerfo(sql, perIdx));
