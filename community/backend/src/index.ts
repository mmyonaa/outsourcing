// index.ts
import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import dotenv from 'dotenv';
import { getServer } from './koaServer'; // ← 여기 중요

dotenv.config();

const app = express();
app.use(express.json());

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
  .then(async () => {
    console.log('📦 DB 연결 성공');

    // Koa 서버 실행
    await getServer();
  })
  .catch((error) => console.error('❌ DB 연결 실패:', error));