import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { BoardEntity, BoardEntityDto, BoardStatisticsEntity, InsertBoardDto, SearchBoardDto, updateBoardStaticsDto } from '@/api/dto/board.dto';
import { getApiHeader } from '@/utils/apiClient';
import { BoardCommentEntity } from '@/api/dto/boardComment.dto';

/**
 * 상품 수정
 * @param apiFileClient
 * @param params
 */
export function getBoardList(apiFileClient: AxiosInstance, params: SearchBoardDto): Promise<ResponseDto<BoardEntityDto[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardEntityDto[]>) => void, fnReject: (reason?: any) => void) => {
    apiFileClient
      .get('/board/getBoardList', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BoardEntityDto[]>(res.data));
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
 * 상품 수정
 * @param apiFileClient
 * @param params
 */
export function getBoardListV2(apiFileClient: AxiosInstance, params: SearchBoardDto): Promise<ResponseDto<BoardEntityDto[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardEntityDto[]>) => void, fnReject: (reason?: any) => void) => {
    apiFileClient
      .get('/board/getBoardListV2', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BoardEntityDto[]>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}
export function getBoardDetail(apiFileClient: AxiosInstance, params: BoardEntityDto): Promise<ResponseDto<BoardEntityDto>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardEntityDto>) => void, fnReject: (reason?: any) => void) => {
    apiFileClient
      .get('/board/getBoardDetail', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BoardEntityDto>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}
export function insertBoard(apiClient: AxiosInstance, params: InsertBoardDto): Promise<ResponseDto<BoardEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/board/insertBoard', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BoardEntity>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}

export function getBoardPrevNextIdx(apiFileClient: AxiosInstance, params: SearchBoardDto): Promise<ResponseDto<BoardEntityDto>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardEntityDto>) => void, fnReject: (reason?: any) => void) => {
    apiFileClient
      .get('/board/getBoardPrevNextIdx', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BoardEntityDto>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}
// 게시글 수정
export function updateBoard(client: AxiosInstance, params: InsertBoardDto): Promise<ResponseDto<BoardEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardEntity>) => void, fnReject: (reason?: any) => void) => {
    client
      .post('/board/updateBoard', params, getApiHeader())
      .then(res => {
        fnResolve(new ResponseDto<BoardEntity>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}
// 게시글 삭제
export function deleteBoard(client: AxiosInstance, params: any): Promise<ResponseDto<BoardEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardEntity>) => void, fnReject: (reason?: any) => void) => {
    client
      .post('/board/deleteBoard', params, getApiHeader())
      .then(res => {
        fnResolve(new ResponseDto<BoardEntity>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}

export function updateBoardShareCount(client: AxiosInstance, params: updateBoardStaticsDto): Promise<ResponseDto<BoardStatisticsEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardStatisticsEntity>) => void, fnReject: (reason?: any) => void) => {
    client
      .post('/board/updateBoardShareCount', params, getApiHeader())
      .then(res => {
        fnResolve(new ResponseDto<BoardStatisticsEntity>(res.data));
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };
  return new Promise(promiseFn);
}
