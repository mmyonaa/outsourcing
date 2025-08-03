import { Context } from 'koa'
import { ResponseDto } from '../repository/dto/response.dto';
import { SearchBoardDto } from '../repository/dto/board.dto';
import { setEntityParameters } from '../utils/common.util';
import { RESULT_CODE } from '../../types';
import * as boardService from '../service/board.service'

/**
 * 글 조회
 * @param {Context} ctx Koa context
 * */
export const getBoardList = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new SearchBoardDto();
    setEntityParameters(reqParam, ctx.request.query);

    const resultData = await boardService.getBoardList(reqParam);

    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
}


/**
 * 글 작성
 * @param {Context} ctx Koa context
 * */
export const insertBoard = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new SearchBoardDto();
    setEntityParameters(reqParam, ctx.request.body);

    const resultData = await boardService.insertBoard(reqParam);

    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
}