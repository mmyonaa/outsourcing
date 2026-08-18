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

  // 단건(bannerIdx) 조회에는 가상의 기본 배너를 섞지 않는다.
  // (섞으면 update/delete 대상 조회가 항상 기본 배너를 집어 실제 배너를 못 찾는다)
  if (reqParam.bannerIdx) {
    return data;
  }

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
  let count = data.length > 0 ? Number(data[0].totalCount) : 0;

  // getBannerList 의 기본 배너 주입 조건과 동일하게 count 도 +1 (목록 길이와 정합 유지)
  if (!reqParam.bannerIdx) {
    const defaultBannerActive = (await bannerRepo.getDefaultBannerActive(
      sql,
    )) as STATE_YN;
    if (!reqParam.activeYn || reqParam.activeYn === defaultBannerActive) {
      count += 1;
    }
  }

  return count;
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
  columns?: (keyof BannerEntity)[],
): Promise<BannerEntity> => {
 try{
  // 기본 배너인 경우 app_setting 테이블의 활성 상태만 갱신
  // (isDefault 플래그까지 요구하면 플래그 없이 보낸 요청이 아래 UPDATE로 빠져
  //  'default' 문자열이 UUID 캐스트 에러를 내므로 bannerIdx 만으로 분기)
  if (reqParam.bannerIdx === 'default') {
    await bannerRepo.setDefaultBannerActive(sql, reqParam.activeYn);
    return reqParam;
  }

  const data = await bannerRepo.updateBanner(sql, reqParam, columns);
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
 * 배너 삭제 (소프트 삭제)
 * @param {string} bannerIdx
 * @return {Promise<BannerEntity[]>} 삭제된 행 (없으면 빈 배열)
 */
export const deleteBanner = async (
  bannerIdx: string,
): Promise<BannerEntity[]> => {
 try{
  const data = await bannerRepo.deleteBanner(sql, bannerIdx);
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
