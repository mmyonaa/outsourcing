/**
 * response code
 */
export const RESULT_CODE = {
  SUCCESS: { code: 0, msg: 'RESULT_SUCCESS' },
  FAILED: { code: 99, msg: 'RESULT_FAILED' },
  BOARD_NOT_FOUND: { code: 98, msg: 'RESULT_BOARD_NOT_FOUND' },
  PERFO_NOT_FOUND: { code: 97, msg: 'RESULT_PERFO_NOT_FOUND' },
  INVALID_PARAMETER: { code: 96, msg: 'RESULT_INVALID_PARAM' },
  PASSWORD_NOT_MATCHED: { code: 95, msg: 'RESULT_PASSWORD_NOT_MATCHED' },
  PASSWORD_INCORRECT: { code: 94, msg: 'RESULT_PASSWORD_INCORRECT' },
  DELETED_CONTENT: { code: 93, msg: 'RESULT_DELETED_CONTENT' },
  NO_PERMISSION: { code: 91, msg: 'RESULT_NO_PERMISSION' },
  NEED_MORE_INFO: { code: 90, msg: 'NEED_MORE_INFO' },
  USER_EXIST: { code: 89, msg: 'USER_ALREADY_EXIST' },
  DB_ERROR: { code: 88, msg: 'RESULT_DB_ERROR' },
  AWS_ERROR: { code: 87, msg: 'RESULT_AWS_ERROR' },
  TOKEN_EXPIRED: { code: 86, msg: 'TOKEN_EXPIRED' },
};

/**
 * Result code interface
 */
export interface IResultCode {
  code: number;
  msg: string;
}

/**
 * YN 상태값
 */
export enum STATE_YN {
  Y = 'Y',
  N = 'N',
}
