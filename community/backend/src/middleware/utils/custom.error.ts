/**
 * 사용자 정의 Error
 * code : 오류 코드
 * message : 오류 메시지
 * traceString : 오류 발생 지점 상세 내용을 출력 (db 오류등..)
 * traceString이 존재하는 경우 stack이 출력된 후 errorTrace가 추가로 출력 된다 logger.ts > myFormat 참고
 */
export class CustomError extends Error {
  private errorCode: number;
  private errorMessage: string;
  private errorTrace: string;

  constructor(code: number, message: string, traceString?: Error) {
    super(message);
    this.errorCode = code;
    this.errorMessage = message;
    this.errorTrace = traceString&&traceString.stack ? traceString.stack : '';
  }
}
