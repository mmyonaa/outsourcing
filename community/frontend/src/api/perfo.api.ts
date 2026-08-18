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
 * 공연 수정 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function updatePerfo(apiClient: AxiosInstance, params: PerfoEntity): Promise<ResponseDto<PerfoEntity>> {
  return apiRequest<PerfoEntity>(() => apiClient.post('/perfo/updateperfo', params), { strict: false });
}

/**
 * 공연 등록 (multipart) — 텍스트 필드 + 이미지 파일을 form-data 로 전송하는 admin 등록 화면용
 */
export function insertPerfoForm(apiClient: AxiosInstance, formData: FormData): Promise<ResponseDto<PerfoEntity>> {
  return apiRequest<PerfoEntity>(
    () => apiClient.post('/perfo/insertperfo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    { strict: false },
  );
}

/**
 * 조회수 증가 — 서버가 원자적으로 +1 (전체 엔티티 update로 조회수를 보내던 방식 대체)
 */
export function increasePerfoViews(apiClient: AxiosInstance, perIdx: string): Promise<ResponseDto<PerfoEntity>> {
  return apiRequest<PerfoEntity>(() => apiClient.post('/perfo/increaseViews', { perIdx }), { strict: false });
}

/**
 * 공연 삭제 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function deletePerfo(apiClient: AxiosInstance, params: Pick<PerfoEntity, 'perIdx'>): Promise<ResponseDto<PerfoEntity>> {
  return apiRequest<PerfoEntity>(() => apiClient.post('/perfo/deleteperfo', params), { strict: false });
}
