import postgres from "postgres";
import { PerfoEntity, SearchPerfoDto } from "./dto/perfo.dto";

export const getPerfoList = (sql: postgres.Sql, reqParam: SearchPerfoDto) => {
  const page = reqParam.page || 1;
  const rows = reqParam.rows || 10;
  const offset = (page - 1) * rows;

  return sql<PerfoEntity[]>`
      SELECT *
      FROM public.performance
      WHERE 1 = 1
        AND del_yn = 'N'
          ${reqParam.perIdx ? sql` AND per_idx =${reqParam.perIdx}` : sql``}
    ${reqParam.perType ? sql` AND per_type =${reqParam.perType}` : sql``}
    ${reqParam.category ? sql` AND category =${reqParam.category}` : sql``}
              ${
                reqParam.keyword
                  ? sql` AND title ILIKE ${"%" + reqParam.keyword + "%"}`
                  : sql``
              }
    ORDER BY reg_dt DESC
    LIMIT ${rows} OFFSET ${offset}
  `;
};

export const getPerfoListCount = (
  sql: postgres.Sql,
  reqParam: SearchPerfoDto
) => {
  return sql<PerfoEntity[]>`
    SELECT COUNT(*) as total_count
      FROM public.performance
      WHERE 1 = 1
        AND del_yn = 'N' 
          ${reqParam.perIdx ? sql` AND per_idx =${reqParam.perIdx}` : sql``}
    ${reqParam.perType ? sql` AND per_type =${reqParam.perType}` : sql``}
    ${reqParam.category ? sql` AND category =${reqParam.category}` : sql``}
              ${
                reqParam.keyword
                  ? sql` AND title ILIKE ${"%" + reqParam.keyword + "%"}`
                  : sql``
              }      
    `;
};

export const insertPerfo = (
  sql: postgres.Sql,
  reqParam: PerfoEntity
): Promise<any> => {
  return sql`
    INSERT INTO public.performance
        ${sql(
          reqParam,
          "title",
          "titleSec",
          "titleThird",
          "body",
          "perType",
          "author",
          "imgUrl",
          "category"
        )} RETURNING *
  `;
};

export const updatePerfo = (
  sql: postgres.Sql,
  reqParam: PerfoEntity
): Promise<any> => {
  // imgUrl을 제외한 필드들만 sql() 함수로 처리
  return sql`
    UPDATE public.performance SET
      ${sql(
        reqParam,
        "title",
        "titleSec",
        "titleThird",
        "body",
        "category",
        "delYn",
        "views"
      )}
      ${reqParam.imgUrl ? sql`, img_url = ${reqParam.imgUrl}` : sql``},
      mod_dt = CURRENT_TIMESTAMP
    WHERE per_idx = ${reqParam.perIdx}
    RETURNING *
  `;
};
