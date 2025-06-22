"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const User_1 = require("./src/entities/User"); // entity 경로에 맞게 조정하세요
const app = (0, express_1.default)();
app.use(express_1.default.json());
// TypeORM DB 연결 세팅
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'your_password',
    database: 'your_db_name',
    entities: [User_1.User],
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
