import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { BoardCommentEntity, BoardCommentResultDto, SearchBoardCommentDto } from '@/api/dto/boardComment.dto';
import { getApiHeader } from '@/utils/apiClient';

/**
 * 댓글 리스트 가져오기
 * @param apiClient
 * @param params
 */
export function getBoardCommentList(apiClient: AxiosInstance, params: SearchBoardCommentDto): Promise<ResponseDto<BoardCommentResultDto[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardCommentResultDto[]>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .get('/comment/getBoardCommentList', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BoardCommentResultDto[]>(res.data));
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
 * 댓글 가져오기
 * @param apiClient
 * @param params
 */
export function getBoardComment(apiClient: AxiosInstance, params: SearchBoardCommentDto): Promise<ResponseDto<BoardCommentResultDto>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardCommentResultDto>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .get('/comment/getBoardComment', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BoardCommentResultDto>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}

export function insertBoardComment(apiClient: AxiosInstance, params: BoardCommentEntity): Promise<ResponseDto<BoardCommentEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardCommentEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/comment/insertBoardComment', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BoardCommentEntity>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}

export function updateBoardComment(apiClient: AxiosInstance, params: BoardCommentEntity): Promise<ResponseDto<BoardCommentEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardCommentEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/comment/updateBoardComment', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BoardCommentEntity>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}

export function deleteBoardComment(apiClient: AxiosInstance, params: BoardCommentEntity): Promise<ResponseDto<BoardCommentEntity>> {
  const promiseFn = (fnResolve: (value: ResponseDto<BoardCommentEntity>) => void, fnReject: (reason?: any) => void) => {
    apiClient
      .post('/comment/deleteBoardComment', params, getApiHeader())
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<BoardCommentEntity>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}
