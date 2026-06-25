import postgres from "postgres";
import { BannerEntity, SearchBannerDto } from "./dto/banner.dto";
import { MAX_ROWS } from "./dto/basic.dto";

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
    LIMIT ${MAX_ROWS}
  `;
};

export const getBannerListCount = (
  sql: postgres.Sql,
  reqParam: SearchBannerDto
) => {
  return sql<BannerEntity[]>`
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
): Promise<any> => {
  return sql`
    INSERT INTO public.banner
        ${sql(
          reqParam,
          "imgUrl",
          "swipeDuration",
          "displayOrder",
          "activeYn"
        )} RETURNING *
  `;
};

export const updateBanner = (
  sql: postgres.Sql,
  reqParam: BannerEntity
): Promise<any> => {
  return sql`
    UPDATE public.banner SET
      ${sql(reqParam, "imgUrl", "swipeDuration", "displayOrder", "activeYn", "delYn")},
      mod_dt = CURRENT_TIMESTAMP
    WHERE banner_idx = ${reqParam.bannerIdx}
    RETURNING *
  `;
};
