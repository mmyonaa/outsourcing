import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getApiHeader } from '@/utils/apiClient';

/**
 * 공연 목록 조회
 * @param apiClient
 * @param params
 */
export function getPerfoList(apiClient: AxiosInstance, params: SearchPerfoDto): Promise<ResponseDto<PerfoEntity[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<PerfoEntity[]>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .get('/perfo/getperfoList', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<PerfoEntity[]>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}

/**
 * 공연 상세 조회
 * @param apiClient
 * @param params
 */
export function getPerfoDetail(apiClient: AxiosInstance, params: PerfoEntity): Promise<ResponseDto<PerfoEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<PerfoEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .get('/perfo/getperfoDetail', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<PerfoEntity>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}

/**
 * 공연 등록
 * @param apiClient
 * @param params
 */
export function insertPerfo(apiClient: AxiosInstance, params: PerfoEntity): Promise<ResponseDto<PerfoEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<PerfoEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/perfo/insertperfo', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<PerfoEntity>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}

/**
 * 공연 수정
 * @param apiClient
 * @param params
 */
export function updatePerfo(apiClient: AxiosInstance, params: PerfoEntity): Promise<ResponseDto<PerfoEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<PerfoEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/perfo/updateperfo', params, getApiHeader())
      .then(res => {
        fnResolve(new ResponseDto<PerfoEntity>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}

/**
 * 공연 삭제
 * @param apiClient
 * @param params
 */
export function deletePerfo(apiClient: AxiosInstance, params: any): Promise<ResponseDto<PerfoEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<PerfoEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/perfo/deleteperfo', params, getApiHeader())
      .then(res => {
        fnResolve(new ResponseDto<PerfoEntity>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}
