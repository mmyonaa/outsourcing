import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import fs from 'fs';
import path from 'path';
import cors from '@koa/cors';
import serve from 'koa-static';

export const getServer = async () => {
  const app = new Koa();
  const router = new Router({ prefix: '/api' });

  app.use(cors({ origin: 'http://bktheater.com', credentials: true }));
  app.use(bodyParser());

  // === API 라우터 등록 ===
  const routesPath = path.join(__dirname, 'middleware', 'routes'); // 라우트 파일들이 있는 디렉토리 경로

  fs.readdirSync(routesPath)
    .filter((file) => /.+\.route\.(ts|js)$/i.test(file))
    .forEach((file) => {
      console.log('라우터 로딩 중:', file);
      const route = require(path.join(routesPath, file));
      const routerInstance = route.default ? route.default() : route();
      router.use(routerInstance.routes());
      router.use(routerInstance.allowedMethods());
    });

  console.log('등록된 라우트 목록:');
  router.stack.forEach((r) => {
    console.log(`${r.methods.join(',')} ${r.path}`);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

//   // === 프론트 정적 파일 서빙 ===
//   const frontendDistPath = path.join(__dirname, '../frontend/dist');
//   app.use(serve(frontendDistPath));

//   // === Vue Router fallback ===
//   app.use(async (ctx, next) => {
//     if (ctx.status === 404 && ctx.method === 'GET') {
//       ctx.type = 'html';
//       ctx.body = fs.createReadStream(path.join(frontendDistPath, 'index.html'));
//     } else {
//       await next();
//     }
//   });

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
  });
};