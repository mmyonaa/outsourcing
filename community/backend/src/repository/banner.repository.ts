import postgres from "postgres";
import {
  BannerEntity,
  SearchBannerDto,
  UPDATABLE_BANNER_COLUMNS,
} from "./dto/banner.dto";
import { MAX_ROWS, getSafePagination } from "./dto/basic.dto";

const DEFAULT_BANNER_ACTIVE_KEY = "default_banner_active";

// 기본 배너 활성 상태 조회 (app_setting 테이블, 없으면 'Y')
export const getDefaultBannerActive = async (
  sql: postgres.Sql,
): Promise<string> => {
  const rows = await sql<{ settingValue: string }[]>`
    SELECT setting_value
      FROM public.app_setting
     WHERE setting_key = ${DEFAULT_BANNER_ACTIVE_KEY}
     LIMIT 1
  `;
  return rows.length > 0 ? rows[0].settingValue : "Y";
};

// 기본 배너 활성 상태 저장 (upsert)
export const setDefaultBannerActive = async (
  sql: postgres.Sql,
  value: string,
): Promise<void> => {
  await sql`
    INSERT INTO public.app_setting (setting_key, setting_value, mod_dt)
    VALUES (${DEFAULT_BANNER_ACTIVE_KEY}, ${value}, NOW())
    ON CONFLICT (setting_key)
    DO UPDATE SET setting_value = ${value}, mod_dt = NOW()
  `;
};

export const getBannerList = (sql: postgres.Sql, reqParam: SearchBannerDto) => {
  // rows 미지정 시 기존 동작(LIMIT 100) 유지, 지정 시 다른 리소스처럼 페이지네이션 적용
  const { rows, offset } = getSafePagination({
    ...reqParam,
    rows: reqParam.rows ?? MAX_ROWS,
  });
  return sql<BannerEntity[]>`
      SELECT *
      FROM public.banner
      WHERE 1 = 1
        AND del_yn = 'N'
          ${
            reqParam.bannerIdx
              ? sql` AND banner_idx =${reqParam.bannerIdx}`
              : sql``
          }
          ${
            reqParam.activeYn
              ? sql` AND active_yn =${reqParam.activeYn}`
              : sql``
          }
    ORDER BY display_order ASC, mod_dt DESC
    LIMIT ${rows} OFFSET ${offset}
  `;
};

export const getBannerListCount = (
  sql: postgres.Sql,
  reqParam: SearchBannerDto
) => {
  return sql<{ totalCount: string }[]>`
    SELECT COUNT(*) as total_count
      FROM public.banner
      WHERE 1 = 1
        AND del_yn = 'N'
          ${
            reqParam.bannerIdx
              ? sql` AND banner_idx =${reqParam.bannerIdx}`
              : sql``
          }
          ${
            reqParam.activeYn
              ? sql` AND active_yn =${reqParam.activeYn}`
              : sql``
          }
  `;
};

export const insertBanner = (
  sql: postgres.Sql,
  reqParam: BannerEntity
): Promise<BannerEntity[]> => {
  const cols: (keyof BannerEntity)[] = [
    "imgUrl",
    "swipeDuration",
    "displayOrder",
    "activeYn",
  ];
  return sql<BannerEntity[]>`
    INSERT INTO public.banner
        ${sql(reqParam, ...cols)} RETURNING *
  `;
};

export const updateBanner = (
  sql: postgres.Sql,
  reqParam: BannerEntity,
  columns: (keyof BannerEntity)[] = UPDATABLE_BANNER_COLUMNS
): Promise<BannerEntity[]> => {
  // 허용 목록과 교집합만 SET — 미전송 필드가 NULL/기본값으로 덮이는 것 방지
  const cols = columns.filter((c) => UPDATABLE_BANNER_COLUMNS.includes(c));
  if (cols.length === 0) {
    // sql(reqParam) 에 컬럼이 하나도 없으면 전체 키가 SET 되므로 반드시 차단
    throw new Error("업데이트할 컬럼이 없습니다.");
  }
  return sql<BannerEntity[]>`
    UPDATE public.banner SET
      ${sql(reqParam, ...cols)},
      mod_dt = CURRENT_TIMESTAMP
    WHERE banner_idx = ${reqParam.bannerIdx}
    RETURNING *
  `;
};

export const deleteBanner = (
  sql: postgres.Sql,
  bannerIdx: string
): Promise<BannerEntity[]> => {
  // 단일 UPDATE로 소프트 삭제 — 존재 확인(RETURNING 행 수)까지 한 번에 처리
  return sql<BannerEntity[]>`
    UPDATE public.banner SET
      del_yn = 'Y',
      mod_dt = CURRENT_TIMESTAMP
    WHERE banner_idx = ${bannerIdx}
      AND del_yn = 'N'
    RETURNING *
  `;
};
