import Router from "@koa/router";
import { koaSwagger } from "koa2-swagger-ui";
import type Koa from "koa";
import fs from "fs";
import path from "path";

/**
 * Swagger UI(API 문서)를 앱에 마운트한다.
 * - GET /api/docs              : Swagger UI 화면 (열람 전용)
 * - GET /api/docs/openapi.yaml : 원본 스펙(브라우저 Swagger UI가 직접 파싱)
 *
 * 운영에도 노출하되 **읽기 전용**이다. 쓰기 엔드포인트에 인증이 없어
 * UI의 "Try it out"(직접 호출)을 비활성화해 열람만 가능하게 한다.
 */
export const mountDocs = (app: Koa) => {
  // 실행 위치(cwd)와 무관하게 backend/openapi.yaml 을 찾는다.
  // dev: src/docs → ../../ = backend/
  // prod: dist/docs → ../../ = backend/
  const specPath = path.join(__dirname, "../../openapi.yaml");

  // 원본 yaml 제공 (별도 yaml 파서 없이 브라우저가 파싱)
  // 부팅 시 1회만 읽어 캐시 — 요청마다 동기 파일 IO 를 하지 않는다
  const spec = fs.readFileSync(specPath, "utf-8");
  const router = new Router();
  router.get("/api/docs/openapi.yaml", (ctx) => {
    ctx.type = "text/yaml; charset=utf-8";
    ctx.body = spec;
  });
  app.use(router.routes());
  app.use(router.allowedMethods());

  // Swagger UI (assets는 koa2-swagger-ui가 로컬 번들로 서빙)
  app.use(
    koaSwagger({
      routePrefix: "/api/docs",
      title: "보광극장 API 문서",
      swaggerOptions: {
        url: "/api/docs/openapi.yaml",
        // 읽기 전용: 직접 호출(Try it out) 비활성화
        tryItOutEnabled: false,
        supportedSubmitMethods: [],
      },
    })
  );

  console.log("📖 Swagger UI: /api/docs (열람 전용)");
};
