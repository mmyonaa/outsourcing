import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import boardRouter from './middleware/routes/board.route';
import perfoRouter from './middleware/routes/performance.route';
import bannerRouter from './middleware/routes/banner.route';
import Router from '@koa/router';

export const getServer = async () => {
  const app = new Koa();

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

  app.use(bodyParser({
    jsonLimit: '20mb',
    formLimit: '20mb',
    textLimit: '20mb'
  }));

  // 에러 처리 + 요청 로그 (라우터보다 먼저 등록해 모든 라우터를 감싼다)
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      // 서버 로그에는 전체 에러를 남기되,
      console.error('Error 발생:', err);
      const status = Number(err.status || err.statusCode) || 500;
      ctx.status = status;
      // 클라이언트에는 내부 정보(SQL 에러 등)를 노출하지 않는다.
      // 명시적으로 노출 허용된 4xx 클라이언트 오류만 메시지를 전달하고,
      // 그 외(5xx 포함)는 일반 메시지로 응답한다.
      ctx.body = {
        message: status < 500 && err.expose ? err.message : '서버에서 오류가 발생했습니다.',
      };
    }
    console.log(`${ctx.method} ${ctx.path} -> ${ctx.status}`);
  });

  // === API 라우터 등록 ===
  const router = new Router();

  router.use(boardRouter.routes(), boardRouter.allowedMethods());
  router.use(perfoRouter.routes(), perfoRouter.allowedMethods());
  router.use(bannerRouter.routes(), bannerRouter.allowedMethods());

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
  });
};
