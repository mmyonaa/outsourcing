import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

// 라우터 직접 import
import boardRouter from './middleware/routes/board.route';

export const getServer = async () => {
  const app = new Koa();
  const router = new Router();

  app.use(cors({ origin: 'http://bktheater.com', credentials: true }));
  app.use(bodyParser());

  console.log('__dirname:', __dirname); // 현재 경로 확인

  // === API 라우터 등록 ===
  const br = boardRouter();
  router.use(br.routes());
  router.use(br.allowedMethods());

  // 실제 router stack 확인
  console.log('등록된 라우트 목록:');
  router.stack.forEach((r) => {
    console.log(r.methods.join(','), r.path, r.stack);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
  });
};
