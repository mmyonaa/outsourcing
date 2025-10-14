import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { BannerEntity, SearchBannerDto } from '@/api/dto/banner.dto';
import { getApiHeader } from '@/utils/apiClient';

/**
 * 배너 목록 조회
 * @param apiClient
 * @param params
 */
export function getBannerList(apiClient: AxiosInstance, params: SearchBannerDto): Promise<ResponseDto<BannerEntity[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BannerEntity[]>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .get('/banner/getBannerList', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BannerEntity[]>(res.data));
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
 * 배너 등록
 * @param apiClient
 * @param params
 */
export function insertBanner(apiClient: AxiosInstance, params: BannerEntity): Promise<ResponseDto<BannerEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BannerEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/banner/insertBanner', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BannerEntity>(res.data));
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
 * 배너 수정
 * @param apiClient
 * @param params
 */
export function updateBanner(apiClient: AxiosInstance, params: BannerEntity): Promise<ResponseDto<BannerEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BannerEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/banner/updateBanner', params, getApiHeader())
      .then(res => {
        fnResolve(new ResponseDto<BannerEntity>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}

/**
 * 배너 삭제
 * @param apiClient
 * @param params
 */
export function deleteBanner(apiClient: AxiosInstance, params: any): Promise<ResponseDto<BannerEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BannerEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/banner/deleteBanner', params, getApiHeader())
      .then(res => {
        fnResolve(new ResponseDto<BannerEntity>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}
