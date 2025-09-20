import postgres from "postgres";
import { PerfoEntity, SearchPerfoDto } from "./dto/perfo.dto";

export const getPerfoList = (sql: postgres.Sql, reqParam: SearchPerfoDto) => {
  return sql<PerfoEntity[]>`
      SELECT *
      FROM public.performance
      WHERE 1 = 1
        AND del_yn = 'N' 
          ${reqParam.perIdx
      ? sql` AND per_idx =${reqParam.perIdx}`
      : sql``
    }
    ORDER BY best_yn DESC, reg_dt DESC
  `;
};

export const getPerfoListCount = (sql: postgres.Sql, reqParam: SearchPerfoDto) => {
  return sql<PerfoEntity[]>`
    SELECT COUNT(*) as total_count
      FROM public.performance
      WHERE 1 = 1
        AND del_yn = 'N' 
          ${reqParam.perIdx
      ? sql` AND per_idx =${reqParam.perIdx}`
      : sql``
    }
  `;
};

export const insertPerfo = (sql: postgres.Sql, reqParam: PerfoEntity): Promise<any> => {
  return sql`
    INSERT INTO public.performance 
        ${sql(
        reqParam,
        'title',
        'body',
        'perType'
    )} RETURNING * 
  `;
};

export const updatePerfo = (
  sql: postgres.Sql,
  reqParam: PerfoEntity,
): Promise<any> => {
  return sql`
    UPDATE public.performance SET
      ${sql(reqParam, 'title', 'body', 'perType', 'delYn', 'views')},
      mod_dt = CURRENT_TIMESTAMP
    WHERE per_idx = ${reqParam.perIdx}
    RETURNING *
  `;
};
