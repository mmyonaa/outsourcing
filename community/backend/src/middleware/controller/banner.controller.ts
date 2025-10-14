import { Context } from 'koa'
import { ResponseDto } from '../repository/dto/response.dto';
import { BannerEntity, SearchBannerDto } from '../repository/dto/banner.dto';
import { setEntityParameters } from '../utils/common.util';
import { RESULT_CODE, STATE_YN } from '../../types';
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

    const resultData = await bannerService.getBannerList(reqParam);

    result.data = resultData;
    result.totalCount = await bannerService.getBannerListCount(reqParam);
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
    setEntityParameters(reqParam, ctx.request.body);

    if(!reqParam.bannerIdx){
        throw new CustomError(
            RESULT_CODE.INVALID_PARAMETER.code,
            RESULT_CODE.INVALID_PARAMETER.msg
        )
    }

    const resultData = await bannerService.updateBanner(reqParam);
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

    const searchParam = new SearchBannerDto();
    searchParam.bannerIdx = reqParam.bannerIdx
    const [bannerItem] = await bannerService.getBannerList(searchParam);

    if(!bannerItem) {
        throw new CustomError(
            RESULT_CODE.INVALID_PARAMETER.code,
            '배너를 찾을 수 없습니다.'
        )
    }

    bannerItem.delYn = STATE_YN.Y
    const resultData = await bannerService.updateBanner(bannerItem);
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
