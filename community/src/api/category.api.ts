import type { AxiosInstance } from 'axios';
import { CategoryEntityV2, SearchCategoryDto } from '@/api/dto/category.dto';
import { ResponseDto } from '@/api/dto/response.dto';
import { CategoryEntity } from '@/api/dto/category.dto';
import { getApiHeader } from '@/utils/apiClient';

// MainTab 가져오기
export function getCategoryList(apiClient: AxiosInstance, params: SearchCategoryDto): Promise<ResponseDto<CategoryEntity[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<CategoryEntity[]>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .get('/category/getCategoryList', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<CategoryEntity[]>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}

// SubTab / Tag 가져오기
export function getSubCategoryList(apiClient: AxiosInstance, params: SearchCategoryDto): Promise<ResponseDto<CategoryEntity[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<CategoryEntity[]>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .get('/category/getSubCategoryList', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<CategoryEntity[]>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}
export function getCategoryListV2(apiClient: AxiosInstance): Promise<ResponseDto<CategoryEntityV2[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<CategoryEntityV2[]>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .get('/category/getCategoryListV2', { headers: getApiHeader().headers })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<CategoryEntityV2[]>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}
