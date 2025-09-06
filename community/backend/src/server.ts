import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

// 라우터 직접 import
import boardRouter from './middleware/routes/board.route';

export const getServer = async () => {
  const app = new Koa();
  const router = new Router({ prefix: '/api' });

  app.use(cors({ origin: 'http://bktheater.com', credentials: true }));
  app.use(bodyParser());

  // === API 라우터 등록 ===
  router.use(boardRouter().routes());
  router.use(boardRouter().allowedMethods());

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
  });
};
