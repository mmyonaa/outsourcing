import postgres from "postgres";
import { PerfoEntity, SearchPerfoDto } from "./dto/perfo.dto";

export const getPerfoList = (sql: postgres.Sql, reqParam: SearchPerfoDto) => {
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
  const updateFields: Partial<PerfoEntity> = {};

  if (reqParam.title !== undefined) updateFields.title = reqParam.title;
  if (reqParam.titleSec !== undefined) updateFields.titleSec = reqParam.titleSec;
  if (reqParam.titleThird !== undefined) updateFields.titleThird = reqParam.titleThird;
  if (reqParam.body !== undefined) updateFields.body = reqParam.body;
  if (reqParam.imgUrl !== undefined) updateFields.imgUrl = reqParam.imgUrl;
  if (reqParam.category !== undefined) updateFields.category = reqParam.category;
  if (reqParam.delYn !== undefined) updateFields.delYn = reqParam.delYn;

  return sql`
    UPDATE public.performance SET
      ${sql(updateFields, 'imgUrl', 'title', 'titleSec', 'titleThird', 'body', 'category', 'delYn')},
      mod_dt = CURRENT_TIMESTAMP
    WHERE per_idx = ${reqParam.perIdx}
    RETURNING *
  `;
};
