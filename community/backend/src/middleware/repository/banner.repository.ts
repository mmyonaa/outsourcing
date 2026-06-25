import postgres from "postgres";
import { BannerEntity, SearchBannerDto } from "./dto/banner.dto";
import { MAX_ROWS } from "./dto/basic.dto";

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
