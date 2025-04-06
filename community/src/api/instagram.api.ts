import { AxiosInstance } from 'axios/index';
import { ResponseDto } from '@/api/dto/response.dto';
import { getApiHeader } from '@/utils/apiClient';

export function getInstagramBoardList(apiClient: AxiosInstance): Promise<ResponseDto<{ data: any }>> {
  const promiseFn = (fnResolve: (value: ResponseDto<{ data: any }>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .get('/instagram/getBoardList')
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<{ data: any }>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}
