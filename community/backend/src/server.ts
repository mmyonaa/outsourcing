import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import fs from 'fs';
import path from 'path';
import cors from '@koa/cors';

export const getServer = async() => {
    const app = new Koa();
    const router = new Router();

    // app.use(cors());
    app.use(cors({ origin: 'http://bktheater.com', credentials: true }));
    app.use(bodyParser());

    const routesPath = __dirname;  // 라우트 파일들이 있는 디렉토리 경로

    fs.readdirSync(routesPath)
    .filter((file) => /.+\.routes\.(ts|js)$/i.test(file))
    .forEach((file) => {
        console.log('라우터 로딩 중:', file);

        const route = require(path.join(routesPath, file));

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
}
