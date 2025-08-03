import { IResultCode, RESULT_CODE } from "../../../types";

export class ResponseDto<T> {
  resultCode = 0;
  resultMsg: string = "";
  data: T | undefined;
  totalCount = 0;

  constructor(data?: any) {
    this.resultCode = RESULT_CODE.FAILED.code;
    this.resultMsg = RESULT_CODE.FAILED.msg;
    if (data) this.data = data;
    this.totalCount = 0;
  }

  setResultCode(r: IResultCode) {
    this.resultCode = r.code;
    this.resultMsg = r.msg;
  }

  setErrorObject(e: any) {
    if (e.errorMessage) this.resultMsg = e.errorMessage;
    if (e.errorCode) this.resultCode = e.errorCode;
  }
}