/**
 * 반환용 DTO
 */
export class ResponseDto<T> {
  resultCode = 0;
  resultMsg = '';
  data?: T;
  totalCount = 0;

  constructor(data?: any) {
    // 서버가 빈 body/null 을 반환하는 경우 방어. falsy 체크(if (data.x))는
    // 정당한 0/'' 값을 기본값으로 대체하므로 undefined 만 걸러낸다.
    if (!data) return;
    if (data.resultCode !== undefined) this.resultCode = data.resultCode;
    if (data.resultMsg !== undefined) this.resultMsg = data.resultMsg;
    if (data.data !== undefined) this.data = data.data;
    if (data.totalCount !== undefined) this.totalCount = data.totalCount;
  }
}
