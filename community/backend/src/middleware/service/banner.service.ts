import * as bannerRepo from '../repository/banner.repository'
import { BannerEntity, SearchBannerDto } from '../repository/dto/banner.dto';
import { sql } from '../provider/database.provider'
import { STATE_YN } from '../../types';
import { withDbError } from '../utils/common.util';

/**
 * 배너 조회 — 목록 조회 시 가상의 기본 배너를 맨 앞에 주입한다.
 * 단건(bannerIdx) 조회에는 섞지 않는다
 * (섞으면 update/delete 대상 조회가 항상 기본 배너를 집어 실제 배너를 못 찾는다).
 */
export const getBannerList = (
  reqParam: SearchBannerDto,
): Promise<BannerEntity[]> =>
  withDbError(async () => {
    const data = await bannerRepo.getBannerList(sql, reqParam);

    if (reqParam.bannerIdx) {
      return data;
    }

    // 기본 배너 활성 상태 (app_setting 테이블에서 조회 - 서버 재시작/다중 인스턴스에서도 유지)
    const defaultBannerActive = (await bannerRepo.getDefaultBannerActive(
      sql,
    )) as STATE_YN;

    const defaultBanner = new BannerEntity();
    defaultBanner.bannerIdx = 'default';
    defaultBanner.isDefault = true;
    defaultBanner.displayOrder = -1;
    defaultBanner.swipeDuration = 5;
    defaultBanner.activeYn = defaultBannerActive;

    // 기본 배너 추가 (activeYn 필터링 고려)
    if (!reqParam.activeYn || reqParam.activeYn === defaultBannerActive) {
      data.unshift(defaultBanner);
    }

    return data;
  });

/**
 * 배너 카운트 — getBannerList 의 기본 배너 주입 조건과 동일하게 +1 (목록 길이와 정합 유지)
 */
export const getBannerListCount = (
  reqParam: SearchBannerDto,
): Promise<number> =>
  withDbError(async () => {
    const data = await bannerRepo.getBannerListCount(sql, reqParam);
    let count = data.length > 0 ? Number(data[0].totalCount) : 0;

    if (!reqParam.bannerIdx) {
      const defaultBannerActive = (await bannerRepo.getDefaultBannerActive(
        sql,
      )) as STATE_YN;
      if (!reqParam.activeYn || reqParam.activeYn === defaultBannerActive) {
        count += 1;
      }
    }

    return count;
  });

/**
 * 배너 등록
 */
export const insertBanner = (
  reqParam: BannerEntity,
): Promise<BannerEntity[]> =>
  withDbError(() => bannerRepo.insertBanner(sql, reqParam));

/**
 * 배너 수정 — columns: 실제 SET 할 컬럼(클라이언트가 보낸 필드).
 * 기본 배너(bannerIdx === 'default')는 DB 행이 아니므로 app_setting 의
 * 활성 상태만 갱신한다 (isDefault 플래그까지 요구하면 플래그 없이 보낸 요청이
 * UPDATE 로 빠져 'default' 문자열이 UUID 캐스트 에러를 내므로 bannerIdx 만으로 분기).
 */
export const updateBanner = (
  reqParam: BannerEntity,
  columns?: (keyof BannerEntity)[],
): Promise<BannerEntity | BannerEntity[]> =>
  withDbError(async () => {
    if (reqParam.bannerIdx === 'default') {
      await bannerRepo.setDefaultBannerActive(sql, reqParam.activeYn);
      return reqParam;
    }

    return bannerRepo.updateBanner(sql, reqParam, columns);
  });

/**
 * 배너 삭제 (소프트 삭제) — 삭제된 행 반환 (없으면 빈 배열)
 */
export const deleteBanner = (
  bannerIdx: string,
): Promise<BannerEntity[]> =>
  withDbError(() => bannerRepo.deleteBanner(sql, bannerIdx));
