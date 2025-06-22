import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { User } from './src/entities/User'; // entity 경로에 맞게 조정하세요

const app = express();
app.use(express.json());

// TypeORM DB 연결 세팅
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'your_password',
  database: 'your_db_name',
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
