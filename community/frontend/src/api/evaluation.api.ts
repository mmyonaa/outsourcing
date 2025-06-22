import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { getApiHeader } from '@/utils/apiClient';
import { EvaluationEntity } from '@/api/dto/eval.dto';

/**
 * 평가 수정
 * @param apiClient
 * @param params
 */
export function updateEvaluation(apiClient: AxiosInstance, params: EvaluationEntity): Promise<ResponseDto<EvaluationEntity[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<EvaluationEntity[]>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/eval/updateEval', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<EvaluationEntity[]>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}
