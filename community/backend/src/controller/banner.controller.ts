import { Context } from 'koa'
import { ResponseDto } from '../repository/dto/response.dto';
import { BannerEntity, SearchBannerDto, UPDATABLE_BANNER_COLUMNS } from '../repository/dto/banner.dto';
import { setEntityParameters } from '../utils/common.util';
import { RESULT_CODE } from '../types';
import * as bannerService from '../service/banner.service'
import { CustomError } from '../utils/custom.error';
import { uploadToS3 } from '../utils/s3.util';

/**
 * 배너 조회
 * @param {Context} ctx Koa context
 * */
export const getBannerList = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new SearchBannerDto();
    setEntityParameters(reqParam, ctx.request.query);

    const [resultData, totalCount] = await Promise.all([
      bannerService.getBannerList(reqParam),
      bannerService.getBannerListCount(reqParam),
    ]);

    result.data = resultData;
    result.totalCount = totalCount;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
}

/**
 * 배너 작성
 * @param {Context} ctx Koa context
 * */
export const insertBanner = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new BannerEntity();
    setEntityParameters(reqParam, ctx.request.body);

    const resultData = await bannerService.insertBanner(reqParam);

    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
}

/**
 * 배너 수정
 * @param {Context} ctx Koa context
 * */
export const updateBanner = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new BannerEntity();
    const providedKeys = setEntityParameters(reqParam, ctx.request.body);

    if(!reqParam.bannerIdx){
        throw new CustomError(
            RESULT_CODE.INVALID_PARAMETER.code,
            RESULT_CODE.INVALID_PARAMETER.msg
        )
    }

    // 클라이언트가 실제로 보낸 필드만 수정 (미전송 필드가 NULL/기본값으로 덮이는 것 방지)
    const updateColumns = UPDATABLE_BANNER_COLUMNS.filter((c) =>
      providedKeys.includes(c),
    );
    if (updateColumns.length === 0) {
      throw new CustomError(
        RESULT_CODE.INVALID_PARAMETER.code,
        '수정할 필드가 없습니다.',
      );
    }

    const resultData = await bannerService.updateBanner(reqParam, updateColumns);
    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
}

/**
 * 배너 삭제
 * @param {Context} ctx Koa context
 * */
export const deleteBanner = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new BannerEntity();
    setEntityParameters(reqParam, ctx.request.body);

    if(!reqParam.bannerIdx){
        throw new CustomError(
            RESULT_CODE.INVALID_PARAMETER.code,
            RESULT_CODE.INVALID_PARAMETER.msg
        )
    }

    // 가상의 기본 배너는 DB 행이 아니므로 삭제 불가
    if (reqParam.bannerIdx === 'default') {
        throw new CustomError(
            RESULT_CODE.INVALID_PARAMETER.code,
            '기본 배너는 삭제할 수 없습니다.'
        )
    }

    // 단일 UPDATE 로 소프트 삭제 — 삭제된 행이 없으면 NOT_FOUND
    const resultData = await bannerService.deleteBanner(reqParam.bannerIdx);

    if (resultData.length === 0) {
        throw new CustomError(
            RESULT_CODE.INVALID_PARAMETER.code,
            '배너를 찾을 수 없습니다.'
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
 * 배너 이미지 업로드
 * @param {Context} ctx Koa context
 * */
export const uploadBannerImage = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    if (!(ctx.request as any).file) {
      throw new CustomError(
        RESULT_CODE.INVALID_PARAMETER.code,
        '이미지 파일이 없습니다.'
      );
    }

    const imageUrl = await uploadToS3((ctx.request as any).file, 'banner/images');

    result.data = { imageUrl };
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    console.error('Banner image upload error:', e);
    result.setErrorObject(e);
  }
  ctx.body = result;
}
