import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import fs from 'fs';
import path from 'path';
import cors from '@koa/cors';

const app = new Koa();
const router = new Router();

// app.use(cors());
app.use(cors({ origin: 'http://bktheater.com', credentials: true }));
app.use(bodyParser());

const routesPath = __dirname;  // 라우트 파일들이 있는 디렉토리 경로

fs.readdirSync(routesPath)
  .filter((file) => /.+\.routes\.(ts|js)$/i.test(file))
  .forEach((file) => {
    const route = require(path.join(routesPath, file));
    // ES Module default export 형태면 route.default() 이렇게 호출
    // CommonJS export면 그냥 route() 호출
    // 상황에 맞게 조정 필요

    // 아래는 default export인 경우 예시
    const routerInstance = route.default ? route.default() : route();
    router.use(routerInstance.routes());
    router.use(routerInstance.allowedMethods());
  });

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
