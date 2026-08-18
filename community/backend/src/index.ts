// env 로드가 가장 먼저 실행되어야 한다 (import 호이스팅 주의).
// server → routes → s3.util/database.provider 가 모듈 로드 시점에 process.env를 읽으므로
// dotenv.config()를 같은 파일에서 호출하면 이미 늦다.
import './env';
import { getServer } from './server';

// Koa 서버 실행 (데이터 접근은 postgres.js 사용)
getServer().catch((error) => {
  console.error('❌ 서버 시작 실패:', error);
  process.exit(1);
});
