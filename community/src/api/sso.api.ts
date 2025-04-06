import { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';

export function ssoLogin(client: AxiosInstance, param: any): Promise<ResponseDto<any>> {
  const promiseFn = (fnResolve: (value: ResponseDto<any>) => void, fnReject: (reason?: any) => void) => {
    client
      .get('/users/ssoLogin', {
        headers: { credentials: 'include' },
        params: param,
      })
      .then(res => {
        fnResolve(new ResponseDto<any>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}
export function ssoUserCheck(client: AxiosInstance, param: any): Promise<ResponseDto<any>> {
  const promiseFn = (fnResolve: (value: ResponseDto<any>) => void, fnReject: (reason?: any) => void) => {
    client
      .get('/users/ssoUserCheck', {
        headers: { credentials: 'include' },
        params: param,
      })
      .then(res => {
        fnResolve(new ResponseDto<any>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}
