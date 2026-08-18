import {keys} from 'lodash'

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
      targetEntity[key] = obj[key];
      applied.push(key);
    }
  }
  return applied;
};