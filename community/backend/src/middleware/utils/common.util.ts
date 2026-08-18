import {keys} from 'lodash'

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