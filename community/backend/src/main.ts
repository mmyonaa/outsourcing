import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { User } from './entities/User'; // entity 경로에 맞게 조정하세요
import dotenv from 'dotenv'

dotenv.config(); // 이 부분 꼭 추가하세요!

const app = express();
app.use(express.json());

// TypeORM DB 연결 세팅
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('📦 DB 연결 성공');
    app.listen(3000, () => {
      console.log('🚀 서버 실행 중: http://localhost:3000');
    });
  })
  .catch((error) => console.error('❌ DB 연결 실패:', error));
