import dotenv from 'dotenv';
import path from 'path';

// 실행 위치(cwd)와 무관하게 backend/.env 를 로드한다.
// 반드시 다른 모듈(server → db/s3)보다 먼저 import 되어야 한다:
// database.provider / s3.util 이 모듈 로드 시점에 process.env를 읽기 때문.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
