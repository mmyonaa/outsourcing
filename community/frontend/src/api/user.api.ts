import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { JoinUserDto, LoginUserDto, UserFollowRecEntity, UserInfoEntityDto } from '@/api/dto/user.dto';
import { getApiHeader } from '@/utils/apiClient';

/**
 * 유저 로그인
 * @param apiClient
 * @param params
 */
export function doLogin(apiClient: AxiosInstance, params: LoginUserDto): Promise<ResponseDto<UserInfoEntityDto>> {
  const promiseFn = (fnResolve: (value: ResponseDto<UserInfoEntityDto>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/users/doLogin', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<UserInfoEntityDto>(res.data));
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
 * 유저 가입
 * @param apiClient
 * @param params
 */
export function doJoin(apiClient: AxiosInstance, params: JoinUserDto): Promise<ResponseDto<UserInfoEntityDto[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<UserInfoEntityDto[]>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/users/doJoin', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<UserInfoEntityDto[]>(res.data));
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
 * 유저정보 조회
 * @param client
 * @param param
 */
export function getUserInfo(client: AxiosInstance, param: any): Promise<ResponseDto<UserInfoEntityDto>> {
  const promiseFn = (fnResolve: (value: ResponseDto<UserInfoEntityDto>) => void, fnReject: (reason?: any) => void) => {
    client
      .get('/users/getUser', {
        headers: getApiHeader().headers,
        params: param,
      })
      .then(res => {
        fnResolve(new ResponseDto<UserInfoEntityDto>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}

export function updateUserInfo(client: AxiosInstance, params: any): Promise<ResponseDto<UserInfoEntityDto>> {
  const promiseFn = (fnResolve: (value: ResponseDto<UserInfoEntityDto>) => void, fnReject: (reason?: any) => void) => {
    client
      .post('/users/updateUser', params, getApiHeader())
      .then(res => {
        fnResolve(new ResponseDto<UserInfoEntityDto>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}

/**
 * 팔로우 업데이트
 * @param apiClient
 * @param params
 */
export function updateFollowUser(apiClient: AxiosInstance, params: UserFollowRecEntity): Promise<ResponseDto<UserFollowRecEntity[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<UserFollowRecEntity[]>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/users/updateFollowUser', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<UserFollowRecEntity[]>(res.data));
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
 * 비밀번호 체크
 * @param client
 * @param param
 */
export function getPasswordCheck(client: AxiosInstance, param: any): Promise<ResponseDto<UserInfoEntityDto>> {
  const promiseFn = (fnResolve: (value: ResponseDto<UserInfoEntityDto>) => void, fnReject: (reason?: any) => void) => {
    client
      .get('/users/getPasswordCheck', {
        headers: getApiHeader().headers,
        params: param,
      })
      .then(res => {
        fnResolve(new ResponseDto<UserInfoEntityDto>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}
