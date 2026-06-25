import dotenv from 'dotenv';
import path from 'path';
import { getServer } from './server';

// 실행 위치(cwd)와 무관하게 backend/.env 를 로드
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Koa 서버 실행 (데이터 접근은 postgres.js 사용)
getServer().catch((error) => {
  console.error('❌ 서버 시작 실패:', error);
  process.exit(1);
});
