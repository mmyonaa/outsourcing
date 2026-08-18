/**
 * 사용자 정의 Error
 * errorCode : 오류 코드 (RESULT_CODE)
 * errorMessage : 오류 메시지
 * errorTrace : 오류 발생 지점 상세 스택 (DB 오류 등, 서버 로그용)
 */
export class CustomError extends Error {
  readonly errorCode: number;
  readonly errorMessage: string;
  readonly errorTrace: string;

  constructor(code: number, message: string, traceString?: Error) {
    super(message);
    this.errorCode = code;
    this.errorMessage = message;
    this.errorTrace = traceString&&traceString.stack ? traceString.stack : '';
  }
}
