import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getApiHeader } from '@/utils/apiClient';
import { apiRequest } from '@/api/request.util';

/**
 * 게시글 목록 조회
 */
export function getBoardList(client: AxiosInstance, params: SearchBoardDto): Promise<ResponseDto<BoardEntity[]>> {
  return apiRequest<BoardEntity[]>(() => client.get('/board/getBoardList', { headers: getApiHeader().headers, params }));
}

/**
 * 게시글 등록
 */
export function insertBoard(client: AxiosInstance, params: BoardEntity): Promise<ResponseDto<BoardEntity>> {
  return apiRequest<BoardEntity>(() => client.post('/board/insertBoard', params, getApiHeader()));
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
