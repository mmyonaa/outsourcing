import { IResultCode, RESULT_CODE } from "../../types";
import { CustomError } from "../../utils/custom.error";

export class ResponseDto<T> {
  resultCode = RESULT_CODE.FAILED.code;
  resultMsg: string = RESULT_CODE.FAILED.msg;
  data: T | undefined;
  totalCount = 0;

  constructor(data?: T) {
    if (data !== undefined && data !== null) this.data = data;
  }

  setResultCode(r: IResultCode) {
    this.resultCode = r.code;
    this.resultMsg = r.msg;
  }

  setErrorObject(e: unknown) {
    if (e instanceof CustomError) {
      this.resultCode = e.errorCode;
      this.resultMsg = e.errorMessage;
    } else {
      this.resultCode = RESULT_CODE.FAILED.code;
      this.resultMsg = RESULT_CODE.FAILED.msg;
    }
  }
}
