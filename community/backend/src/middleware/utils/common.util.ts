import {keys} from 'lodash'
import { CustomError } from './custom.error';
import { RESULT_CODE } from '../../types';

/**
 * LIKE/ILIKE 패턴 특수문자(%, _, \)를 이스케이프한다.
 * 파라미터 바인딩으로 인젝션은 없지만, 검색어의 와일드카드가
 * 그대로 동작해 의도치 않은 매칭/전체 스캔이 되는 것을 방지.
 */
export const escapeLike = (keyword: string): string =>
  keyword.replace(/[\\%_]/g, (m) => `\\${m}`);

/**
 * targetEntity 에 포함된 key에 value 적용
 * @param targetEntity
 * @param obj
 * @return 실제로 값이 적용된 key 목록 — update 시 "클라이언트가 보낸 필드"만
 *         SET 하기 위해 사용한다 (미전송 필드가 엔티티 기본값/NULL로 덮이는 것 방지)
 */
export const setEntityParameters = (targetEntity: any, obj: any): string[] => {
  const applied: string[] = [];
  const keyList = keys(targetEntity);
  for (const key of keyList) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 반복된 쿼리 파라미터(?a=1&a=2)는 배열로 들어오므로 첫 값만 사용
      const value = obj[key];
      targetEntity[key] = Array.isArray(value) ? value[0] : value;
      applied.push(key);
    }
  }
  return applied;
};

/**
 * repository 호출 공통 래퍼 — CustomError 는 그대로 전달하고,
 * 그 외(DB 오류 등)는 DB_ERROR 로 감싼다.
 */
export const withDbError = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (e: any) {
    if (e instanceof CustomError) throw e;
    console.error(e);
    throw new CustomError(
      RESULT_CODE.DB_ERROR.code,
      RESULT_CODE.DB_ERROR.msg,
      e,
    );
  }
};