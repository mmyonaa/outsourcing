/**
 * https://github.com/porsager/postgres
 * 위 repo를 확인하시면 더 많은 예제와 설명을 확인 할 수 있습니다.
 */
import postgres from 'postgres';

export let sqlMain: postgres.Sql;
export let sql: postgres.Sql;
export let sqlOld: postgres.Sql;

// onnotice: (notice: postgres.Notice) => void;
// /** (key; value) when a server param change */
// onparameter: (key: string, value: any) => void;
// /** Is called with (connection; query; parameters) */
// debug: boolean | ((connection: number, query: string, parameters: any[], paramTypes: any[]) => void);

export const getTransaction = async (
  cb: (sql: postgres.TransactionSql) => Promise<any>,
) => {
  return await sql.begin(async (sql) => {
    const result = await cb(sql);
    console.log('process.env.JEST_TRANSACTION', process.env.JEST_TRANSACTION);
    if (process.env.JEST_WORKER_ID && process.env.JEST_TRANSACTION !== 'commit')
      await sql`ROLLBACK`;
    return result;
  });
};

const printDebug = (
  connection: number,
  query: string,
  param: any[],
  paramType: any[],
) => {
//   logger.info(`query: ${query}, param: ${param}`);
};

const printNotice = (notice: postgres.Notice) => {
//   logger.info({ tile: `Db Notice`, notice });
};

