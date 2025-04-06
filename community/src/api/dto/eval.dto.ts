import { STATE_YN } from '@/types';
import { EVAL_TARGET_TYPE, EVAL_TYPE } from '@/types';

export class EvaluationEntity {
  // 대상고유번호 필수 param
  targetIdx: string | undefined = undefined;
  // 유저고유번호
  userIdx: string | undefined = undefined;
  // 대상타입 필수 param
  targetType: EVAL_TARGET_TYPE = EVAL_TARGET_TYPE.BOARD;
  // 평가타입코드 필수 param
  evalCode: EVAL_TYPE = EVAL_TYPE.LIKE;
  // 등록자회원고유번호
  regrUserIdx: string | undefined = undefined;
  // 등록일시
  regDt: Date | undefined = undefined;
  // 수정자고유번호
  modrUserIdx: string | undefined = undefined;
  // 수정일시
  modDt: Date | undefined = undefined;
  // 삭제여부
  delYn: STATE_YN = STATE_YN.N;
}
