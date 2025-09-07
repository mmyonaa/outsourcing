import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

// router 직접 import
import boardRouter from './middleware/routes/board.route';

export const getServer = async () => {
  const app = new Koa();
  const router = new Router({ prefix: '/api' }); // /api 상위 prefix

  app.use(cors({ origin: 'http://bktheater.com', credentials: true }));
  app.use(bodyParser());

  // === API 라우터 등록 ===
  router.use(boardRouter.routes());
  router.use(boardRouter.allowedMethods());

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
