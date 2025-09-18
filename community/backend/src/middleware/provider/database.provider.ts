import postgres from 'postgres';

export const sql = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false, // 필요 시 true
  max: 10,    // connection pool
  debug: false, // 필요 시 true 또는 콜백
  transform: {
    ...postgres.camel,   // camelCase <-> snake_case 자동 변환
    undefined: null,     // undefined 값을 자동으로 NULL로 변환
  },
});

// 기존 getTransaction 그대로 사용 가능
export const getTransaction = async (
  cb: (sql: postgres.TransactionSql) => Promise<any>,
) => {
  return await sql.begin(async (sql) => {
    const result = await cb(sql);
    if (process.env.JEST_WORKER_ID && process.env.JEST_TRANSACTION !== 'commit')
      await sql`ROLLBACK`;
    return result;
  });
};
