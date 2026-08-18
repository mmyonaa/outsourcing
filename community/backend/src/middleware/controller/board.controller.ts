import { Context } from 'koa'
import { ResponseDto } from '../repository/dto/response.dto';
import { BoardEntity, SearchBoardDto, UPDATABLE_BOARD_COLUMNS } from '../repository/dto/board.dto';
import { setEntityParameters } from '../utils/common.util';
import { RESULT_CODE } from '../../types';
import * as boardService from '../service/board.service'
import { CustomError } from '../utils/custom.error';
import { uploadToS3, decodeOriginalName } from '../utils/s3.util';

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
    result.totalCount = await boardService.getBoardListCount(reqParam);
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
    const providedKeys = setEntityParameters(reqParam, ctx.request.body);

    if(!reqParam.boardIdx){
        throw new CustomError(
            RESULT_CODE.INVALID_PARAMETER.code,
            RESULT_CODE.INVALID_PARAMETER.msg
        )
    }

    // 클라이언트가 실제로 보낸 필드만 수정 (미전송 필드가 NULL/기본값으로 덮이는 것 방지)
    const updateColumns = UPDATABLE_BOARD_COLUMNS.filter((c) =>
      providedKeys.includes(c),
    );
    if (updateColumns.length === 0) {
      throw new CustomError(
        RESULT_CODE.INVALID_PARAMETER.code,
        '수정할 필드가 없습니다.',
      );
    }

    const resultData = await boardService.updateBoard(reqParam, updateColumns);
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

    // 단일 UPDATE 로 소프트 삭제 — 삭제된 행이 없으면 NOT_FOUND
    const resultData = await boardService.deleteBoard(reqParam.boardIdx);

    if (resultData.length === 0) {
        throw new CustomError(
            RESULT_CODE.BOARD_NOT_FOUND.code,
            RESULT_CODE.BOARD_NOT_FOUND.msg
        )
    }

    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
}

/**
 * 이미지 업로드
 * @param {Context} ctx Koa context
 * */
export const uploadImage = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    console.log('Upload request received:', {
      hasFile: !!(ctx.request as any).file,
      file: (ctx.request as any).file
    });

    if (!(ctx.request as any).file) {
      throw new CustomError(
        RESULT_CODE.INVALID_PARAMETER.code,
        '이미지 파일이 없습니다.'
      );
    }

    const imageUrl = await uploadToS3((ctx.request as any).file, 'board/images');

    result.data = { imageUrl };
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    console.error('Upload error:', e);
    result.setErrorObject(e);
  }
  ctx.body = result;
}

/**
 * 파일 업로드
 * @param {Context} ctx Koa context
 * */
export const uploadFile = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    console.log('File upload request received:', {
      hasFile: !!(ctx.request as any).file,
      file: (ctx.request as any).file
    });

    if (!(ctx.request as any).file) {
      throw new CustomError(
        RESULT_CODE.INVALID_PARAMETER.code,
        '파일이 없습니다.'
      );
    }

    const file = (ctx.request as any).file;
    const fileUrl = await uploadToS3(file, 'board/files');

    result.data = {
      fileUrl,
      // multer가 latin1로 디코딩한 파일명을 utf8로 복원 (한글 파일명 깨짐 방지)
      fileName: decodeOriginalName(file.originalname)
    };
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    console.error('File upload error:', e);
    result.setErrorObject(e);
  }
  ctx.body = result;
}