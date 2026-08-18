import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import boardRouter from './routes/board.route';
import perfoRouter from './routes/performance.route';
import bannerRouter from './routes/banner.route';
import Router from '@koa/router';
import { mountDocs } from './docs/swagger';

export const getServer = async () => {
  const app = new Koa();

  const allowedOrigins = [
    "http://localhost:4000",
    "https://bktheater.com",
    "https://www.bktheater.com",
    // http는 https 전환 완료 후 제거 예정 (80→443 리다이렉트가 있어 실사용은 없음)
    "http://bktheater.com",
  ];

  app.use(
    cors({
      origin: (ctx) => {
        const requestOrigin = ctx.request.header.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          return requestOrigin;
        }
        return "https://bktheater.com"; // fallback
      },
      credentials: true,
    })
  );

  // 본문은 HTML 텍스트뿐 (이미지/파일은 S3 업로드 후 URL 참조) — 과도한 한도는 DoS 여지
  app.use(bodyParser({
    jsonLimit: '5mb',
    formLimit: '5mb',
    textLimit: '1mb'
  }));

  // 에러 처리 + 요청 로그 (라우터보다 먼저 등록해 모든 라우터를 감싼다)
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      // 서버 로그에는 전체 에러를 남기되,
      console.error('Error 발생:', err);
      // multer 에러는 status가 없어 500 '서버 오류'로 응답되던 것을 클라이언트 오류로 보정
      if (err.name === 'MulterError') {
        err.status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        err.expose = true;
        if (err.code === 'LIMIT_FILE_SIZE') {
          err.message = '파일 크기가 제한(20MB)을 초과했습니다.';
        }
      }
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

  // API 문서(Swagger UI) 마운트 — 운영에도 노출하되 열람 전용(Try it out 비활성)
  mountDocs(app);

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
  });
};
