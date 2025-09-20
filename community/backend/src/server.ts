import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import boardRouter from './middleware/routes/board.route';
import perfoRouter from './middleware/routes/performance.route';

export const getServer = async () => {
  const app = new Koa();
  const router = new Router({ prefix: '/api' }); // /api prefix 한 번만

  // app.use(cors({ origin: 'http://bktheater.com', credentials: true }));
  const allowedOrigins = ["http://localhost:4000", "http://bktheater.com"];
  
  app.use(
    cors({
      origin: (ctx) => {
        const requestOrigin = ctx.request.header.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          return requestOrigin;
        }
        return "http://bktheater.com"; // fallback
      },
      credentials: true,
    })
  );

  app.use(bodyParser());

  // === API 라우터 등록 ===
  router.use(boardRouter.routes());
  router.use(boardRouter.allowedMethods());

  router.use(perfoRouter.routes());
  router.use(perfoRouter.allowedMethods());

  // 실제 router stack 확인 (디버그용)
  console.log('등록된 라우트 목록:');
  router.stack.forEach(r => console.log(r.methods.join(','), r.path));

  // 라우터 등록
  app.use(router.routes());
  app.use(router.allowedMethods()); 

  // 404 및 요청 로그 미들웨어 (라우터 뒤)
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      console.error('Error 발생:', err);
      ctx.status = err.status || 500;
      ctx.body = { message: err.message };
    }
    console.log(`${ctx.method} ${ctx.path} -> ${ctx.status}`);
  });

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
  });
};
