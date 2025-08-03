import {keys} from 'lodash'

/**
 * targetEntity 에 포함된 key에 value 적용
 * @param targetEntity
 * @param obj
 */
export const setEntityParameters = (targetEntity: any, obj: any) => {
  const keyList = keys(targetEntity);
  for (const key of keyList) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      targetEntity[key] = obj[key];
    }
  }
};