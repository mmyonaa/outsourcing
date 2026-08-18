import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { apiRequest } from '@/api/request.util';

/**
 * 게시글 목록 조회
 */
export function getBoardList(client: AxiosInstance, params: SearchBoardDto): Promise<ResponseDto<BoardEntity[]>> {
  return apiRequest<BoardEntity[]>(() => client.get('/board/getBoardList', { params }));
}

/**
 * 게시글 등록
 */
export function insertBoard(client: AxiosInstance, params: BoardEntity): Promise<ResponseDto<BoardEntity>> {
  return apiRequest<BoardEntity>(() => client.post('/board/insertBoard', params));
}

/**
 * 게시글 수정 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function updateBoard(client: AxiosInstance, params: BoardEntity): Promise<ResponseDto<BoardEntity>> {
  return apiRequest<BoardEntity>(() => client.post('/board/updateBoard', params), { strict: false });
}

/**
 * 조회수 증가 — 서버가 원자적으로 +1 (전체 엔티티 update로 조회수를 보내던 방식 대체)
 */
export function increaseBoardViews(client: AxiosInstance, boardIdx: string): Promise<ResponseDto<BoardEntity>> {
  return apiRequest<BoardEntity>(() => client.post('/board/increaseViews', { boardIdx }), { strict: false });
}

/**
 * 게시글 삭제 (resultCode 무관하게 응답 반환 - 기존 동작 유지)
 */
export function deleteBoard(client: AxiosInstance, params: Pick<BoardEntity, 'boardIdx'>): Promise<ResponseDto<BoardEntity>> {
  return apiRequest<BoardEntity>(() => client.post('/board/deleteBoard', params), { strict: false });
}
