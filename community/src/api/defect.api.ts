import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { DefectEntity } from '@/api/dto/defect.dto';
import { getApiHeader } from '@/utils/apiClient';

/**
 * 상품 수정
 * @param apiClient
 * @param params
 */
export function insertDefect(apiClient: AxiosInstance, params: DefectEntity): Promise<ResponseDto<DefectEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<DefectEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/defect/insertDefect', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<DefectEntity>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}
