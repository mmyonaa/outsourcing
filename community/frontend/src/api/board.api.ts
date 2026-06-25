import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { BoardEntity, BoardStatisticsEntity, SearchBoardDto, updateBoardStaticsDto } from '@/api/dto/board.dto';
import { getApiHeader } from '@/utils/apiClient';
import { apiRequest } from '@/api/request.util';

/**
 * 게시글 목록 조회
 */
export function getBoardList(client: AxiosInstance, params: SearchBoardDto): Promise<ResponseDto<BoardEntity[]>> {
  return apiRequest<BoardEntity[]>(() => client.get('/board/getBoardList', { headers: getApiHeader().headers, params }));
}

/**
 * 게시글 목록 조회 V2
 */
export function getBoardListV2(client: AxiosInstance, params: SearchBoardDto): Promise<ResponseDto<BoardEntity[]>> {
  return apiRequest<BoardEntity[]>(() =>
    client.get('/board/getBoardListV2', { headers: getApiHeader().headers, params }),
  );
}

/**
 * 게시글 상세 조회
 */
export function getBoardDetail(client: AxiosInstance, params: BoardEntity): Promise<ResponseDto<BoardEntity>> {
  return apiRequest<BoardEntity>(() => client.get('/board/getBoardDetail', { headers: getApiHeader().headers, params }));
}

/**
 * 게시글 등록
 */
export function insertBoard(client: AxiosInstance, params: BoardEntity): Promise<ResponseDto<BoardEntity>> {
  return apiRequest<BoardEntity>(() => client.post('/board/insertBoard', params, getApiHeader()));
}

/**
 * 이전/다음 게시글 인덱스 조회
 */
export function getBoardPrevNextIdx(client: AxiosInstance, params: SearchBoardDto): Promise<ResponseDto<BoardEntity>> {
  return apiRequest<BoardEntity>(() =>
    client.get('/board/getBoardPrevNextIdx', { headers: getApiHeader().headers, params }),
  );
}

/**
 * 게시글 수정 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function updateBoard(client: AxiosInstance, params: BoardEntity): Promise<ResponseDto<BoardEntity>> {
  return apiRequest<BoardEntity>(() => client.post('/board/updateBoard', params, getApiHeader()), { strict: false });
}

/**
 * 게시글 삭제 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function deleteBoard(client: AxiosInstance, params: any): Promise<ResponseDto<BoardEntity>> {
  return apiRequest<BoardEntity>(() => client.post('/board/deleteBoard', params, getApiHeader()), { strict: false });
}

/**
 * 게시글 공유 카운트 갱신 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function updateBoardShareCount(
  client: AxiosInstance,
  params: updateBoardStaticsDto,
): Promise<ResponseDto<BoardStatisticsEntity>> {
  return apiRequest<BoardStatisticsEntity>(() => client.post('/board/updateBoardShareCount', params, getApiHeader()), {
    strict: false,
  });
}
