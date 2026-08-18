import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { BannerEntity, SearchBannerDto } from '@/api/dto/banner.dto';
import { apiRequest } from '@/api/request.util';

/**
 * 배너 목록 조회
 */
export function getBannerList(apiClient: AxiosInstance, params: SearchBannerDto): Promise<ResponseDto<BannerEntity[]>> {
  return apiRequest<BannerEntity[]>(() =>
    apiClient.get('/banner/getBannerList', { params }),
  );
}

/**
 * 배너 등록
 */
export function insertBanner(apiClient: AxiosInstance, params: BannerEntity): Promise<ResponseDto<BannerEntity>> {
  return apiRequest<BannerEntity>(() => apiClient.post('/banner/insertBanner', params));
}

/**
 * 배너 수정 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function updateBanner(apiClient: AxiosInstance, params: BannerEntity): Promise<ResponseDto<BannerEntity>> {
  return apiRequest<BannerEntity>(() => apiClient.post('/banner/updateBanner', params), {
    strict: false,
  });
}

/**
 * 배너 삭제 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function deleteBanner(apiClient: AxiosInstance, params: any): Promise<ResponseDto<BannerEntity>> {
  return apiRequest<BannerEntity>(() => apiClient.post('/banner/deleteBanner', params), {
    strict: false,
  });
}
