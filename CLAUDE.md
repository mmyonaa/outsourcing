# CLAUDE.md

보광극장(bktheater.com) 홍보·대관 사이트. `community/frontend`(Vue 3 + vite-ssg)와
`community/backend`(Koa + PostgreSQL)로 나뉜다. 기술 스택·구조 상세는 `README.md`.

## 검증

루트에서 **`pnpm typecheck`** 하나로 둘 다 돈다 — frontend 는 `vue-tsc`, backend 는
`tsc --noEmit`. 2026-09-30 실측 기준 둘 다 통과한다.

루트 `package.json` 은 **이 스크립트만 든 껍데기**다. pnpm 워크스페이스가 아니므로
(`pnpm-workspace.yaml` 이 없다) **루트에서 `pnpm install` 을 돌리지 않는다** — 의존성은
`community/frontend` 와 `community/backend` 가 각자 들고 있다.

frontend 에는 `lint` · `test:unit` · `test:e2e` 도 있다(필요하면 개별 실행).
빌드는 SSG 라 `build-ssg` 를 거친다.

## 버전

버전 정본은 **`CHANGELOG.md`** 다 — 루트에도 하위에도 릴리스 버전을 든 매니페스트가 없다
(frontend 의 `0.0.1` 은 릴리스 버전이 아니다). pm2 연속 배포라 릴리스는 논리적
마일스톤으로 끊는다 — 근거는 `CHANGELOG.md` 머리말에 있다.

v1.0.0 ~ v1.5.1 의 8개 버전이 모두 같은 이름의 git 태그와 1:1 로 맞아 있다.

## 함정

- **시크릿을 커밋하지 않는다.** `.gitignore` 가 `*.pem` · `*.key` · `*.conf` 를 막고 있고,
  `community/ecosystem.config.js` 도 추적 대상이 아니다(`.example` 만 커밋돼 있다).
  배포 키(`community/bktheater.pem`)가 작업 트리에 있지만 git 에는 없다 — 그대로 둔다.
- 배포는 AWS EC2 + pm2 + Nginx. 프론트는 정적 산출물이라 빌드 결과를 올린다.
