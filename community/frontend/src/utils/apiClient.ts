import axios, { type AxiosInstance } from 'axios';
import AppConfig from '../constants';

// 이 사이트는 로그인이 없는 설계라 인증 토큰 배관(setApiToken/getApiHeader)은 제거됨.
// 공통 헤더는 axios 인스턴스 기본값으로 충분하다.
let apiClient: AxiosInstance | undefined;

export function getApiClient(baseUrl = AppConfig.API_SERVER): AxiosInstance {
  if (!apiClient) {
    apiClient = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  apiClient.defaults.baseURL = baseUrl;

  return apiClient;
}
