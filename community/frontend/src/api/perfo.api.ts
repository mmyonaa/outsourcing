import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { apiRequest } from '@/api/request.util';

/**
 * 공연 목록 조회
 */
export function getPerfoList(apiClient: AxiosInstance, params: SearchPerfoDto): Promise<ResponseDto<PerfoEntity[]>> {
  return apiRequest<PerfoEntity[]>(() =>
    apiClient.get('/perfo/getperfoList', { params }),
  );
}

/**
 * 공연 등록
 */
export function insertPerfo(apiClient: AxiosInstance, params: PerfoEntity): Promise<ResponseDto<PerfoEntity>> {
  return apiRequest<PerfoEntity>(() => apiClient.post('/perfo/insertperfo', params));
}

/**
 * 공연 수정 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function updatePerfo(apiClient: AxiosInstance, params: PerfoEntity): Promise<ResponseDto<PerfoEntity>> {
  return apiRequest<PerfoEntity>(() => apiClient.post('/perfo/updateperfo', params), { strict: false });
}

/**
 * 공연 삭제 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function deletePerfo(apiClient: AxiosInstance, params: any): Promise<ResponseDto<PerfoEntity>> {
  return apiRequest<PerfoEntity>(() => apiClient.post('/perfo/deleteperfo', params), { strict: false });
}
