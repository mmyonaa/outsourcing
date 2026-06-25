# 사이트 개선 점검 보고서

> 작성일: 2026-06-25
> 대상: 보광극장 커뮤니티 사이트 (Vue 3 + vite-ssg 프론트엔드 / Koa + postgres.js 백엔드)
> 점검 범위: 보안 · 인증 · 백엔드/프론트엔드 품질 · UX/접근성 · SEO · 성능 · 의존성 · 빌드 설정

---

## 요약

| 심각도 | 건수 | 핵심 내용 |
|--------|------|-----------|
| 🔴 Critical | 2 | 자격증명 Git 노출, 관리자 API 인증 부재 |
| 🟠 High | 8 | 업로드 검증, 페이지네이션 상한, SEO 라우팅/메타/사이트맵, 의존성 중복, CORS |
| 🟡 Medium | 7 | 에러/로딩 상태, API 래퍼 패턴, 번들 최적화, 에러 노출, 코드 중복 |
| 🟢 Low | 6 | 접근성, 로그 정리, 미사용 코드, 타이밍 의존 코드 |

**가장 시급한 항목: #1 자격증명 폐기·재발급, #2 관리자 API 인증.** 운영 중이라면 실제 침해 위험입니다.

---

## 🔴 Critical (즉시 조치)

### 1. AWS·DB 자격증명이 Git에 평문으로 노출

- **위치**: `ecosystem.config.js`
- **확인된 사실**: 실제 운영 키가 평문으로 들어있고, **이 파일이 git에 커밋되어 추적되고 있음**. `.gitignore`는 `.env`만 차단하고 있어 무방비.
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` 노출
  - `DB_PASSWORD` 노출
- **영향**: S3 버킷 및 DB 완전 장악 가능. 이미 푸시됐다면 git history에도 영구 기록됨.
- **조치 순서**:
  1. **AWS 키 즉시 폐기·재발급**(IAM 콘솔), **DB 비밀번호 변경** — 노출된 키 무효화가 최우선
  2. 값을 `.env`로 이전하고 `process.env`로 읽도록 변경
  3. `git rm --cached ecosystem.config.js` 후 `.gitignore`에 추가
  4. `ecosystem.config.example.js`(더미 값) 추가로 형식 공유

### 2. 관리자 API에 인증이 전혀 없음

- **위치**: `backend/src/middleware/routes/*.route.ts`, `frontend/src/router/index.ts`
- **확인된 사실**: 모든 쓰기 엔드포인트(insert/update/delete/upload)에 인증 미들웨어가 없음. URL만 알면 누구나 배너·공연·공지를 생성/수정/삭제하고 S3에 업로드 가능.
  - 프론트 라우터에도 `/admin/*` 가드 없음 → URL 직접 접근 가능
- **조치**:
  - 백엔드: 토큰/세션 인증 미들웨어를 쓰기 라우트 앞에 추가
  - 프론트: 라우트에 `meta: { requiresAuth: true }` 부여 후 `beforeEach` 가드에서 토큰 검사
  - 토큰 만료/검증 로직 추가 (현재 `data-store`는 토큰 문자열만 보관, 만료 처리 없음)

---

## 🟠 High

### 3. 파일 업로드 검증 취약

- **위치**: `backend/src/middleware/utils/s3.util.ts`, 각 `*.route.ts`의 multer `fileFilter`
- **문제**: MIME 타입(`file.mimetype.startsWith('image/')`)만 검사하고, 확장자는 클라이언트 파일명에서 추출 → 스푸핑 가능.
- **조치**: 확장자 화이트리스트 검증, MIME 기반 확장자 도출, 서버 측 이미지 실검증(예: sharp).

### 4. 페이지네이션 상한 부재 (DoS)

- **위치**: `board.repository.ts`, `performance.repository.ts` (`rows || 10`)
- **문제**: `rows: 999999` 같은 요청을 막지 못해 DB 리소스 고갈 가능.
- **조치**: `const rows = Math.min(reqParam.rows || 10, MAX_ROWS)` 적용. 배너 쿼리에는 LIMIT 자체가 없음.

### 5. 기본 배너 상태를 모듈 전역변수로 관리

- **위치**: `banner.service.ts:13` (`let defaultBannerActive`)
- **문제**: 서버 재시작 시 상태 소실, 다중 인스턴스 확장 불가, 동시성 레이스.
- **조치**: DB 레코드/설정 테이블로 이전하고 전역변수 제거.

### 6. 상세페이지 쿼리스트링 라우팅 (SEO 손해)

- **위치**: `router/index.ts`, `NoticeDetail.vue`, `PerformanceDetail.vue`, `NewsDetail.vue`
- **문제**: `/notice/detail?id=123` 형식. 크롤러가 쿼리 파라미터를 정규화에서 무시 → 모든 상세글이 같은 URL로 취급. vite-ssg 프리렌더 불가.
- **조치**: `/notice/:id`, `/performance/:id`, `/news/:id` 경로 파라미터로 전환, 컴포넌트는 `route.params.id` 사용.

### 7. 상세페이지 동적 메타/OG/JSON-LD 없음

- **위치**: `seo.util.ts` (`pageSeoConfig`에 상세페이지 항목 없음)
- **문제**: 데이터 로드 후 메타태그가 갱신되지 않아 모든 상세글이 홈 메타·OG 이미지를 공유.
- **조치**: 데이터 로드 후 `setMetaTags()`로 글 제목/요약/이미지 반영. NewsArticle/Event 등 JSON-LD 동적 삽입.

### 8. 사이트맵에 개별 글 URL 누락

- **위치**: `frontend/public/sitemap.xml`
- **문제**: 정적 목록 페이지만 포함, 실제 SEO 타깃인 개별 글/공연이 빠짐.
- **조치**: 빌드 타임 또는 API 기반 동적 sitemap 생성으로 전 항목 URL 포함.

### 9. 불필요·중복 의존성

- **위치**: `backend/package.json`, `frontend/package.json`
- **문제**:
  - 백엔드: `express`+`koa` 공존(실사용은 koa), `pg`+`postgres` 드라이버 중복
  - 프론트: `storybook` 및 애드온이 `dependencies`에 위치 → 운영 번들 포함 위험
- **조치**: 미사용 패키지 제거, storybook 계열을 `devDependencies`로 이동.

### 10. CORS fallback 설정

- **위치**: `backend/src/middleware/server.ts`
- **문제**: 허용 목록에 없는 origin을 하드코딩 도메인으로 fallback 허용 → CSRF 여지.
- **조치**: 미허용 origin은 거부(`false` 반환).

---

## 🟡 Medium

### 11. 에러/로딩 상태 부재

- **위치**: `Home.vue`, `Admin*.vue`
- **문제**: API 실패 시 빈 화면·콘솔 로그만. 로딩 스피너/에러 표시 없음, `await` 체인에 `.catch` 누락.
- **조치**: `isLoading`/`error` 상태 추가, 실패 시 안내 표시.

### 12. API 래퍼 안티패턴

- **위치**: `frontend/src/api/*.api.ts`
- **문제**: 이미 Promise인 axios를 `new Promise`로 다시 감싸고 문자열로 reject → 에러 종류 구분 불가, 디버깅 곤란.
- **조치**: 래퍼 제거, axios Promise 그대로 반환하고 에러를 타입화된 Error로 변환.

### 13. 번들 최적화 (moment / Quill)

- **위치**: `frontend/package.json`, 상세 뷰들, admin 뷰들
- **문제**: `moment`(약 67KB, deprecated)를 단순 날짜 포맷에 사용. Quill(에디터)은 admin 전용인데 메인 번들에 포함.
- **조치**: moment → day.js/native `Date`, Quill은 admin 라우트에서 동적 import(lazy-load).

### 14. 에러 응답에 DB 메시지 노출

- **위치**: `server.ts` 에러 미들웨어 (`ctx.body = { message: err.message }`)
- **문제**: SQL 에러 등 내부 정보가 클라이언트로 노출.
- **조치**: 서버에만 로깅, 클라이언트엔 일반 메시지 반환.

### 15. 카카오맵 키 하드코딩

- **위치**: `frontend/index.html`
- **조치**: 환경변수(`VITE_KAKAO_MAP_KEY`)로 분리. (키 도메인 제한 설정 여부도 확인 필요)

### 16. 백엔드 TypeScript strict 미적용

- **위치**: `backend/tsconfig.json`
- **문제**: 프론트는 `strict: true`인데 백엔드는 미적용, `strictPropertyInitialization: false`.
- **조치**: strict 활성화로 잠재 버그 사전 차단.

### 17. 관리자 뷰 대량 코드 중복

- **위치**: `AdminNews.vue`, `AdminNotice.vue`, `AdminPerformance.vue`, `AdminPerformanceNext.vue` 및 Detail/Assign 변형
- **문제**: 목록·검색·필터·페이지네이션·렌더링 로직이 8곳 이상 거의 동일하게 반복 → 유지보수 시 동일 수정 반복.
- **조치**: 공통 컴포저블 `useAdminList()` 또는 `AdminListTemplate.vue`로 추출.

---

## 🟢 Low

- **18. 배너 자동 슬라이드**: 현재 동작은 정상(이미 활성/비활성 필터 버그는 수정 완료). 다만 `setInterval` 재생성보다 `setTimeout` 재귀가 의도가 명확.
- **19. 접근성**: `ApocInput`/`ApocPagination`/`ApocButton`에 `aria-label`·`label` 연결·키보드 핸들러 부족, 이미지 alt 미흡.
- **20. 콘솔 로그 정리**: 컨트롤러·api 래퍼·유틸의 `console.log/error`를 로깅 라이브러리로 대체하거나 제거.
- **21. 미사용 코드**: 상세 뷰의 `totalPage` 등 미사용 ref 제거.
- **22. 타이밍 의존 코드**: 파일 링크 설정의 `setTimeout(300)` → `nextTick()`/MutationObserver로 대체.
- **23. 이미지 최적화**: `ApocImageSet`에 WebP/AVIF `<picture>` 협상, `loading="lazy"` 추가.

---

## 권장 진행 순서

1. **#1 자격증명** — `.env` 분리 + git 제거 (키 재발급은 AWS/DB 콘솔에서 직접)
2. **#2 인증** — 백엔드 토큰 미들웨어 + 프론트 라우트 가드
3. **#6·7·8 SEO** — 상세페이지 경로/메타/사이트맵 (검색 노출 직결)
4. **#3·4·10 보안 보강** — 업로드 검증, 페이지네이션 상한, CORS
5. **#11·12·13 품질/성능** — 에러·로딩 상태, API 래퍼, 번들 최적화
6. **#17 리팩터링** — 관리자 뷰 공통화

---

> 본 보고서의 Critical 2건(#1, #2)은 코드를 직접 확인해 검증한 항목입니다. 나머지는 영역별 정적 분석 결과로, 수정 착수 시 해당 파일을 다시 확인합니다.
