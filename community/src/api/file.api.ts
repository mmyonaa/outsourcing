import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';

export function uploadFileImg(client: AxiosInstance, param: any): Promise<ResponseDto<any>> {
  const promiseFn = (fnResolve: (value: ResponseDto<any>) => void, fnReject: (reason?: any) => void) => {
    client
      .post('/file/uploadFileImg', param, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<any>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}
