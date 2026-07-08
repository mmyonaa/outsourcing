# 보광극장 홍보 및 대관 사이트

보광극장의 공연 정보 홍보와 대관 예약을 위한 웹사이트입니다. 공연·공지·보도자료 콘텐츠 관리, 카카오맵 위치 안내, 관리자 운영 기능을 제공하며, 검색 노출(SEO)을 고려한 정적 사이트 생성(SSG) 구조로 구축되었습니다.

> 운영 도메인: https://bktheater.com (Let's Encrypt, http는 https로 리다이렉트)

---

## 🛠️ 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| **Frontend** | Vue 3 (Composition API), TypeScript, [vite-ssg](https://github.com/antfu/vite-ssg) (정적 사이트 생성), Pinia, Vue Router, SCSS |
| **에디터/유틸** | Quill(리치 텍스트, 관리자 전용), dayjs(날짜), axios(HTTP) |
| **Backend** | Koa, TypeScript, [postgres.js](https://github.com/porsager/postgres)(쿼리), @koa/router · @koa/multer · @koa/cors |
| **Database** | PostgreSQL |
| **Storage** | AWS S3 (이미지/파일 업로드) |
| **Infra/DevOps** | AWS EC2, PM2, Nginx(리버스 프록시) |
| **외부 API** | Kakao Maps API |
| **패키지 매니저** | pnpm |

---

## 📁 프로젝트 구조

```
outsourcing/
├── README.md
├── docs/                          # 일반 문서 (구글 캘린더 연동 등)
└── community/
    ├── ecosystem.config.example.js  # PM2 배포 설정 예시 (실제 파일은 gitignore)
    ├── docs/                        # 운영/기술 문서
    │   ├── ARCHITECTURE.md          # 아키텍처 다이어그램 (Mermaid)
    │   ├── ERD.md                   # DB 스키마 다이어그램
    │   └── SEO_GUIDE.md             # SEO 종합 가이드 (등록·타임라인·전략)
    ├── frontend/                    # Vue 3 + vite-ssg
    │   ├── index.html
    │   ├── .env.example             # VITE_KAKAO_MAP_KEY 등
    │   ├── scripts/generate-sitemap.mjs  # 빌드 타임 sitemap 생성
    │   ├── public/                  # robots.txt, sitemap.xml, 정적 자산
    │   └── src/
    │       ├── api/                 # axios 래퍼 (apiRequest 공통 헬퍼)
    │       ├── components/          # 공통 컴포넌트(Base*), 헤더/푸터
    │       ├── composables/         # useAsyncData, useAdminList
    │       ├── router/              # 라우트 정의
    │       ├── stores/              # Pinia 스토어
    │       ├── utils/               # seo.util, apiClient 등
    │       └── views/               # 페이지 + admin/ 관리자 페이지
    └── backend/                     # Koa API 서버
        ├── .env.example
        ├── ddl/ddl.sql              # DB 스키마 정의
        └── src/
            ├── index.ts             # 진입점 (dotenv + 서버 기동)
            ├── server.ts            # Koa 앱/미들웨어/라우터 등록
            └── middleware/
                ├── controller/      # 요청 핸들러
                ├── service/         # 비즈니스 로직
                ├── repository/      # SQL 쿼리 (+ dto/)
                ├── routes/          # 라우트 + multer 업로드 설정
                ├── provider/        # DB 커넥션(postgres.js)
                └── utils/           # s3, 에러 등
```

---

## 🏗️ 아키텍처 개요

```
[브라우저]
   │  HTTP
   ▼
[Nginx]  ──► / (정적)         ──► frontend: vite preview (빌드된 dist 서빙)
         └─► /api (프록시)     ──► backend: Koa  (포트 3000)
                                      │
                                      ├─► PostgreSQL
                                      └─► AWS S3 (이미지/파일)
```

- **프론트엔드**는 `vite-ssg`로 정적 빌드(`dist/`) 후, 운영에서는 `vite preview`가 그 결과물을 서빙합니다. (PM2 `frontend` 프로세스)
- **백엔드**는 Koa API 서버로 포트 `3000`에서 실행되며 모든 라우트는 `/api` 프리픽스를 가집니다. (PM2 `backend` 프로세스)
- 데이터 접근은 **postgres.js**로 처리하며 컬럼은 `snake_case ↔ camelCase` 자동 변환됩니다.

---

## ✨ 주요 기능

### 사용자
- 역대 공연 / 예정 공연 목록·상세 조회
- 공지사항 / 보도자료 목록·상세 조회 (제목 검색, 페이지네이션)
- 대관 안내 및 스케줄 확인
- 카카오맵 연동 위치 안내(오시는 길)
- 홈 배너 자동 슬라이드, PC/모바일 반응형 UI
- 상세 페이지별 동적 메타/OG/JSON-LD, 개별 글 URL 포함 sitemap (SEO)

### 관리자 (`/admin/*`)
- 배너 등록/수정/삭제 및 노출 순서·전환 시간·활성 상태 관리
- 공연(역대/예정), 공지사항, 보도자료 CRUD (Quill 에디터, 이미지·파일 업로드)

---

## 🔧 사전 준비물

- Node.js 18+ (권장)
- PostgreSQL
- pnpm
- AWS S3 버킷 및 자격증명 (이미지/파일 업로드용)
- Kakao Developers JavaScript 키 (지도)

---

## ⚙️ 환경 변수

> `.env` 파일은 git에 포함되지 않습니다. 각 `.env.example`을 복사해 채워주세요.

### frontend (`community/frontend/.env`) — **빌드 시점**에 사용

| 변수 | 설명 |
|------|------|
| `VITE_KAKAO_MAP_KEY` | 카카오맵 JavaScript 키 (빌드 시 `index.html`에 주입) |

> ⚠️ 이 값은 `pnpm build` 때 읽혀 `dist`에 박힙니다. 빌드 전에 `.env`가 있어야 합니다.
> 카카오 JS 키는 브라우저에 노출되는 공개 키이므로, 실제 보호는 **Kakao 콘솔의 도메인 제한**으로 설정하세요.

### backend (`community/backend/.env`) — **런타임**에 사용

| 변수 | 설명 |
|------|------|
| `NODE_ENV` | 실행 환경 |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | PostgreSQL 접속 정보 |
| `AWS_REGION` / `AWS_S3_BUCKET` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | S3 업로드용 |

---

## 🗄️ 데이터베이스

스키마는 [`community/backend/ddl/ddl.sql`](community/backend/ddl/ddl.sql)에 정의되어 있습니다.
ERD(다이어그램·관계 설명)는 [`community/docs/ERD.md`](community/docs/ERD.md)를 참고하세요.

| 테이블 | 용도 |
|--------|------|
| `board` | 공지사항/보도자료 (`board_type`으로 구분) |
| `performance` | 공연 (역대/예정은 `per_type`으로 구분) |
| `banner` | 홈 배너 |
| `app_setting` | 전역 설정 key-value (예: `default_banner_active` — 기본 배너 노출 상태) |

최초 구축 시:

```bash
psql -U <user> -d <db> -h <host> -p <port> -f community/backend/ddl/ddl.sql
```

> `app_setting` 테이블이 없으면 배너 목록 조회가 실패하므로, 기존 DB에 없으면 반드시 생성하세요.

---

## 💻 로컬 개발

### Frontend
```bash
cd community/frontend
pnpm install
pnpm dev              # http://localhost:4000
```

### Backend
```bash
cd community/backend
pnpm install
pnpm dev              # ts-node-dev, http://localhost:3000 (라우트는 /api/*)
```

> 로컬에서 프론트가 백엔드를 호출하도록 `frontend/src/constants.ts`의 `API_SERVER`를 환경에 맞게 조정하세요.

---

## 📦 빌드 & 배포 (EC2 + PM2)

배포는 PM2로 관리됩니다. 설정 형식은 [`community/ecosystem.config.example.js`](community/ecosystem.config.example.js) 참고. (실제 `ecosystem.config.js`는 민감정보/환경별 경로를 포함해 gitignore됩니다.)

### 최초 1회 (서버에서)
```bash
# 1) 환경변수 파일 생성 (.env.example 참고)
cp community/frontend/.env.example community/frontend/.env   # 값 채우기
cp community/backend/.env.example  community/backend/.env    # 값 채우기

# 2) DB 스키마 적용 (필요 시)
psql ... -f community/backend/ddl/ddl.sql
```

### 평소 배포
```bash
cd /home/ec2-user/outsourcing
git pull

# 프론트: 빌드 후 정적 서빙 재시작
cd community/frontend
pnpm install
pnpm build            # type-check + sitemap 생성 + vite-ssg 빌드 (dist 생성)
pm2 restart frontend

# 백엔드: tsc 빌드 후 재시작
cd ../backend
pnpm install
pnpm build            # tsc → dist
pm2 restart backend
```

> **중요:** `pm2 restart frontend`는 빌드를 하지 않고 기존 `dist`만 서빙합니다. 변경을 반영하려면 반드시 `pnpm build`를 먼저 수행해야 합니다.
> 패키지 매니저는 **pnpm**으로 통일되어 있습니다(각 디렉토리에 `pnpm-lock.yaml` 커밋). 서버에도 pnpm이 설치돼 있어야 합니다.

---

## 📜 npm 스크립트

### frontend
| 스크립트 | 설명 |
|----------|------|
| `dev` | 개발 서버 (포트 4000) |
| `build` | sitemap 생성 → 타입체크 → `vite-ssg build` |
| `generate-sitemap` | `scripts/generate-sitemap.mjs` 단독 실행 |
| `start` | `vite preview` (빌드 결과 서빙, 운영용) |
| `type-check` | `vue-tsc` 타입 검사 |
| `lint` / `format` | ESLint / Biome |

### backend
| 스크립트 | 설명 |
|----------|------|
| `dev` | `ts-node-dev`로 핫리로드 실행 |
| `build` | `tsc` → `dist` |
| `start` | `node dist/index.js` |

---

## 🔎 SEO

- **동적 메타/OG/JSON-LD**: 상세 페이지는 데이터 로드 후 글별 메타태그와 구조화 데이터(NewsArticle/TheaterEvent)를 주입합니다. ([`src/utils/seo.util.ts`](community/frontend/src/utils/seo.util.ts))
- **sitemap**: `pnpm build` 시 [`scripts/generate-sitemap.mjs`](community/frontend/scripts/generate-sitemap.mjs)가 API에서 전체 글/공연을 수집해 개별 URL까지 포함한 `public/sitemap.xml`을 생성합니다. (API 미도달 시 정적 페이지로 폴백)
  - 도메인/API base는 `SITE_URL`, `SITEMAP_API_BASE` 환경변수로 조정 가능.
- 검색엔진 등록·노출 타임라인·상위 노출 전략은 [`community/docs/SEO_GUIDE.md`](community/docs/SEO_GUIDE.md) 참고.

---

## 📋 변경 이력

| 버전 | 날짜 | 주요 내용 |
|------|------|-----------|
| **v1.4.0** | 2026-07-08 | UI/UX 개선 — 로딩/에러 상태, 접근성, 반응형 다듬기, HTTPS 전환 |
| **v1.3.0** | 2026-07-07 | 코드베이스 정리 — 데드코드/미사용 의존성 제거, 히스토리 시크릿 정리, ERD·스키마 문서화, 스켈레톤 UI 추가 |
| **v1.2.0** | 2026-06-26 | 유지보수 스프린트 — 상세 페이지 UX·디자인 통일, 공유 버튼 추가, 반응형 안정화, SEO·보안·구조 개선 |
| **v1.1.0** | 2025-12-16 | 배너 관리 기능, SEO 강화(OG·canonical·네이버 서치어드바이저) |
| **v1.0.0** | 2025-11-05 | 초기 오픈 — 공연/공지/대관 게시, 관리자, 반응형 UI, 카카오맵 |

> 버전별 상세 변경 사항은 [CHANGELOG.md](CHANGELOG.md)를 참고하세요.

---

## 📝 라이선스 / 문의

- 👤 개발자: Hyonah Im
- ✉️ 문의: apddfhsajrwk@gmail.com
