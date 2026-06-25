import * as bannerRepo from '../repository/banner.repository'
import { BannerEntity, SearchBannerDto } from '../repository/dto/banner.dto';
import {sql} from '../provider/database.provider'
import { RESULT_CODE, STATE_YN } from '../../types';
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

  // 기본 배너 활성 상태 (app_setting 테이블에서 조회 - 서버 재시작/다중 인스턴스에서도 유지)
  const defaultBannerActive = (await bannerRepo.getDefaultBannerActive(
    sql,
  )) as STATE_YN;

  // 기본 배너를 배너 목록에 추가
  const defaultBanner = new BannerEntity();
  defaultBanner.bannerIdx = 'default';
  defaultBanner.isDefault = true;
  defaultBanner.displayOrder = -1;
  defaultBanner.swipeDuration = 5;
  defaultBanner.activeYn = defaultBannerActive;

  // 기본 배너 추가 (activeYn 필터링 고려)
  if (!reqParam.activeYn) {
    // 필터 없으면 항상 추가
    data.unshift(defaultBanner);
  } else if (reqParam.activeYn === defaultBannerActive) {
    // 필터가 있고 상태가 일치하면 추가
    data.unshift(defaultBanner);
  }

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
  // 기본 배너인 경우 app_setting 테이블의 활성 상태만 갱신
  if (reqParam.bannerIdx === 'default' && reqParam.isDefault) {
    await bannerRepo.setDefaultBannerActive(sql, reqParam.activeYn);
    return reqParam;
  }

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
