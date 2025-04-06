import type { AxiosInstance } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';
import { BoardEntity, BoardEntityDto, InsertBoardDto, SearchBoardDto } from '@/api/dto/board.dto';
import { getApiHeader } from '@/utils/apiClient';
import { BoardCommentEntity } from '@/api/dto/boardComment.dto';
import { PopularSearchEntity } from '@/api/dto/popularSearch.dto';
import { BasicListDto } from '@/api/dto/request.dto';

/**
 * 상품 수정
 * @param apiFileClient
 * @param params
 */
export function getPopularSearch(apiFileClient: AxiosInstance, params: BasicListDto): Promise<ResponseDto<PopularSearchEntity[]>> {
  const promiseFn = (fnResolve: (value: ResponseDto<PopularSearchEntity[]>) => void, fnReject: (reason?: any) => void) => {
    apiFileClient
      .get('/popularSearch/getPopularSearch', { headers: getApiHeader().headers, params: params })
      .then(res => {
        if (res.data.resultCode !== 0) {
          console.error(res);
          fnReject('msg.' + res.data.resultMsg);
        } else {
          fnResolve(new ResponseDto<PopularSearchEntity[]>(res.data));
        }
      })
      .catch(err => {
        console.error(err);
        fnReject('msg.RESULT_FAILED');
      });
  };

  return new Promise(promiseFn);
}
