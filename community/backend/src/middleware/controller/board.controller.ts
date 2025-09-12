import { Context } from 'koa'
import { ResponseDto } from '../repository/dto/response.dto';
import { BoardEntity, SearchBoardDto } from '../repository/dto/board.dto';
import { setEntityParameters } from '../utils/common.util';
import { RESULT_CODE, STATE_YN } from '../../types';
import * as boardService from '../service/board.service'
import { CustomError } from '../utils/custom.error';

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
  ctx.body = result;
}

/**
 * 글 작성
 * @param {Context} ctx Koa context
 * */
export const insertBoard = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new BoardEntity();
    setEntityParameters(reqParam, ctx.request.body);

    const resultData = await boardService.insertBoard(reqParam);

    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
}

/**
 * 글 수정
 * @param {Context} ctx Koa context
 * */
export const updateBoard = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new BoardEntity();
    setEntityParameters(reqParam, ctx.request.body);

    if(!reqParam.boardIdx){
        throw new CustomError(
            RESULT_CODE.INVALID_PARAMETER.code,
            RESULT_CODE.INVALID_PARAMETER.msg
        )
    }

    const resultData = await boardService.updateBoard(reqParam);

    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
}

/**
 * 글 수정
 * @param {Context} ctx Koa context
 * */
export const deleteBoard = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new BoardEntity();
    setEntityParameters(reqParam, ctx.request.body);

    if(!reqParam.boardIdx){
        throw new CustomError(
            RESULT_CODE.INVALID_PARAMETER.code,
            RESULT_CODE.INVALID_PARAMETER.msg
        )
    }

    reqParam.delYn = STATE_YN.Y
    
    const resultData = await boardService.deleteBoard(reqParam);
    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
}