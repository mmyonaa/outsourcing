import * as bannerRepo from '../repository/banner.repository'
import { BannerEntity, SearchBannerDto } from '../repository/dto/banner.dto';
import {sql} from '../provider/database.provider'
import { RESULT_CODE } from '../../types';
import { CustomError } from '../utils/custom.error';

/**
 * 배너 조회
 * @param {SearchBannerDto} reqParam
 * @return {Promise<BannerEntity[]>}
 */
export const getBannerList = async (
  reqParam: SearchBannerDto,
): Promise<BannerEntity[]> => {
 try{
  const data = await bannerRepo.getBannerList(sql, reqParam);
  return data
 } catch (e: any) {
  console.log(e)
      throw new CustomError(
        RESULT_CODE.DB_ERROR.code,
        RESULT_CODE.DB_ERROR.msg,
        e,
      );
    }
};

export const getBannerListCount = async (
  reqParam: SearchBannerDto,
): Promise<number> => {
 try{
  const data = await bannerRepo.getBannerListCount(sql, reqParam);
  return data.length > 0 ? Number(data[0].totalCount) : 0;
 } catch (e: any) {
  console.log(e)
      throw new CustomError(
        RESULT_CODE.DB_ERROR.code,
        RESULT_CODE.DB_ERROR.msg,
        e,
      );
    }
};

/**
 * 배너 등록
 * @param {BannerEntity} reqParam
 * @return {Promise<BannerEntity[]>}
 */
export const insertBanner = async (
  reqParam: BannerEntity,
): Promise<BannerEntity[]> => {
 try{
  const data = await bannerRepo.insertBanner(sql, reqParam);
  return data
 } catch (e: any) {
  console.log(e)
      throw new CustomError(
        RESULT_CODE.DB_ERROR.code,
        RESULT_CODE.DB_ERROR.msg,
        e,
      );
    }
};

/**
 * 배너 수정
 * @param {BannerEntity} reqParam
 * @return {Promise<BannerEntity>}
 */
export const updateBanner = async (
  reqParam: BannerEntity,
): Promise<BannerEntity> => {
 try{
  const data = await bannerRepo.updateBanner(sql, reqParam);
  return data
 } catch (e: any) {
  console.log(e)
      throw new CustomError(
        RESULT_CODE.DB_ERROR.code,
        RESULT_CODE.DB_ERROR.msg,
        e,
      );
    }
};
