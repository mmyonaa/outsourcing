# 아키텍처 다이어그램

> 보광극장 홍보 및 대관 사이트의 구조를 Mermaid 다이어그램으로 정리한 문서입니다.
> GitHub에서 md 파일을 열면 다이어그램이 자동 렌더링됩니다.
> 데이터베이스 ERD는 별도 문서로 관리합니다. 스키마 정의는 [`../backend/ddl/ddl.sql`](../backend/ddl/ddl.sql) 참고.

---

## 1. 시스템 아키텍처 / 배포 구성

전체 요청 흐름과 인프라 구성입니다. 프론트엔드는 vite-ssg로 빌드된 정적 파일을 서빙하고, 백엔드는 Koa API 서버로 동작합니다.

```mermaid
flowchart TB
    subgraph Client["사용자"]
        Browser["브라우저<br/>(PC / 모바일)"]
    end

    subgraph External["외부 서비스"]
        Kakao["Kakao Maps SDK<br/>(dapi.kakao.com)"]
    end

    subgraph EC2["AWS EC2 (bktheater.com)"]
        Nginx["Nginx<br/>리버스 프록시"]

        subgraph PM2["PM2"]
            FE["frontend 프로세스<br/>vite preview<br/>(빌드된 dist/ 정적 서빙)"]
            BE["backend 프로세스<br/>Koa API 서버 :3000"]
        end
    end

    subgraph Data["데이터 저장소"]
        PG[("PostgreSQL<br/>board · performance<br/>banner · app_setting")]
        S3[("AWS S3<br/>bktheater-media<br/>이미지 · 파일")]
    end

    Browser -->|"http://bktheater.com"| Nginx
    Browser -.->|"지도 스크립트 직접 로드"| Kakao
    Browser -.->|"업로드된 이미지 직접 조회"| S3

    Nginx -->|"/ (정적 페이지)"| FE
    Nginx -->|"/api/* (프록시)"| BE

    BE -->|"postgres.js<br/>(snake_case ↔ camelCase 자동 변환)"| PG
    BE -->|"@aws-sdk/client-s3<br/>uploadToS3()"| S3
```

- 프론트 환경변수(`VITE_KAKAO_MAP_KEY`)는 **빌드 시점**에 dist에 주입되고, 백엔드 환경변수(DB/AWS)는 **런타임**에 `backend/.env`에서 로드됩니다.
- 브라우저는 S3에 업로드된 이미지를 S3 URL로 직접 조회합니다 (백엔드를 경유하지 않음).

---

## 2. 백엔드 레이어드 아키텍처

`routes → controller → service → repository` 계층 구조입니다. 세 도메인(banner / board / performance)이 동일한 패턴을 따릅니다.

```mermaid
flowchart LR
    subgraph Entry["진입점"]
        IDX["index.ts<br/>dotenv 로드 → getServer()"]
        SRV["server.ts<br/>CORS · bodyParser<br/>에러 핸들러 · 라우터 등록"]
    end

    subgraph Routes["routes/ — 라우트 + multer 업로드"]
        R1["banner.route.ts"]
        R2["board.route.ts"]
        R3["performance.route.ts"]
    end

    subgraph Controllers["controller/ — 요청 파싱 · 응답 조립"]
        C1["banner.controller"]
        C2["board.controller"]
        C3["performance.controller"]
    end

    subgraph Services["service/ — 비즈니스 로직"]
        S1["banner.service<br/>(기본 배너 병합)"]
        S2["board.service"]
        S3s["performance.service"]
    end

    subgraph Repos["repository/ — SQL 쿼리 (+ dto/)"]
        RP1["banner.repository<br/>(+ app_setting 조회/갱신)"]
        RP2["board.repository"]
        RP3["performance.repository"]
    end

    subgraph Infra["provider/ · utils/"]
        DB["database.provider<br/>postgres.js 커넥션 풀"]
        S3U["s3.util<br/>uploadToS3()"]
        ERR["custom.error<br/>CustomError"]
    end

    PG[("PostgreSQL")]
    AWS[("AWS S3")]

    IDX --> SRV
    SRV --> R1 & R2 & R3
    R1 --> C1
    R2 --> C2
    R3 --> C3
    C1 --> S1 --> RP1
    C2 --> S2 --> RP2
    C3 --> S3s --> RP3
    RP1 & RP2 & RP3 --> DB --> PG
    C1 & C2 & C3 -.->|"이미지/파일 업로드"| S3U --> AWS
    S1 & S2 & S3s -.->|"DB 오류 래핑"| ERR
```

- 페이지네이션은 repository 계층에서 `getSafePagination`(rows 1~100 제한)으로 방어합니다.
- 기본 배너의 활성 상태는 `app_setting` 테이블(key: `default_banner_active`)에 영속화됩니다.

---

## 3. 주요 흐름 시퀀스 다이어그램

### 3-1. 배너 등록 (이미지 업로드 → 배너 저장, 2단계)

```mermaid
sequenceDiagram
    actor Admin as 관리자
    participant FE as AdminBanner.vue
    participant API as Koa API
    participant S3 as AWS S3
    participant DB as PostgreSQL

    Admin->>FE: 이미지 선택 + 전환시간/순서 입력 후 [등록]
    FE->>FE: 파일 검증 (image/*, 5MB 이하)
    FE->>API: POST /api/banner/upload-image (multipart)
    API->>API: multer 메모리 버퍼 (20MB 제한, image/* 필터)
    API->>S3: uploadToS3(file, 'banner')
    S3-->>API: S3 객체 URL
    API-->>FE: { imageUrl }
    FE->>API: POST /api/banner/insertBanner { imgUrl, swipeDuration, displayOrder }
    API->>DB: INSERT INTO banner
    DB-->>API: RETURNING *
    API-->>FE: resultCode 0
    FE->>FE: 모달 닫기 + 목록 재조회
```

### 3-2. 홈 배너 조회 (기본 배너 병합)

```mermaid
sequenceDiagram
    participant Home as Home.vue
    participant API as banner.controller
    participant SVC as banner.service
    participant REPO as banner.repository
    participant DB as PostgreSQL

    Home->>API: GET /api/banner/getBannerList?activeYn=Y
    API->>SVC: getBannerList(param)
    SVC->>REPO: getBannerList(sql, param)
    REPO->>DB: SELECT * FROM banner WHERE del_yn='N' AND active_yn='Y'
    DB-->>SVC: 배너 목록
    SVC->>REPO: getDefaultBannerActive(sql)
    REPO->>DB: SELECT setting_value FROM app_setting<br/>WHERE setting_key='default_banner_active'
    DB-->>SVC: 'Y' 또는 'N'
    SVC->>SVC: 기본 배너 생성 후 activeYn 일치 시 목록 맨 앞에 추가
    SVC-->>Home: 배너 목록 (기본 배너 포함)
    Home->>Home: displayOrder 정렬 → 자동 슬라이드 시작<br/>(배너별 swipeDuration 간격)
```

### 3-3. 게시글 상세 조회 + 조회수 증가

```mermaid
sequenceDiagram
    participant User as 방문자
    participant Detail as NoticeDetail.vue
    participant API as Koa API
    participant DB as PostgreSQL

    User->>Detail: /notice/:id 진입
    Detail->>API: GET /api/board/getBoardList?boardIdx=:id
    API->>DB: SELECT * FROM board WHERE board_idx=:id
    DB-->>Detail: 게시글 데이터
    Detail->>Detail: applySeo() — 동적 메타/OG + NewsArticle JSON-LD 주입
    Detail->>API: POST /api/board/updateBoard (views + 1)
    API->>DB: UPDATE board SET views=..., mod_dt=NOW()
    Detail->>Detail: 본문 렌더링 + 파일 다운로드 링크 처리
```

---

## 4. 프론트엔드 라우트 맵

vite-ssg 기준 전체 라우트 구성입니다. 공개 상세 페이지는 SEO를 위해 경로 파라미터(`:id`)를 사용합니다.

```mermaid
flowchart LR
    ROOT["/ (홈)"]

    subgraph Public["공개 페이지"]
        direction TB
        INTRO["/introduce — 극장 소개"]
        INTRO_ORG["/introduce/org — 단체 소개"]
        INTRO_ROUTE["/introduce/route — 오시는 길 (카카오맵)"]
        PERF["/performance — 역대 공연 목록"]
        PERF_D["/performance/:id — 공연 상세"]
        NEXT["/performance/next — 예정 공연 목록"]
        NEXT_D["/performance/next/:id — 예정 공연 상세"]
        RENT["/rental — 공간 안내"]
        RENT_I["/rental/info — 대관 안내"]
        RENT_S["/rental/schedule — 대관 스케줄"]
        NOTICE["/notice — 공지사항 목록"]
        NOTICE_D["/notice/:id — 공지 상세"]
        NEWS["/news — 보도자료 목록"]
        NEWS_D["/news/:id — 보도자료 상세"]
    end

    subgraph Admin["관리자 페이지 (/admin/*)"]
        direction TB
        A_HOME["/admin — 관리자 홈"]
        A_BANNER["/admin/banner — 배너 관리 (모달 CRUD)"]
        A_NOTICE["/admin/notice — 공지 목록"]
        A_NOTICE_D["/admin/notice/detail?id= — 공지 상세/수정"]
        A_NOTICE_A["/admin/notice/assign — 공지 등록"]
        A_NEWS["/admin/news — 보도자료 목록"]
        A_NEWS_D["/admin/news/detail?id= — 보도자료 상세/수정"]
        A_NEWS_A["/admin/news/assign — 보도자료 등록"]
        A_PERF["/admin/performance — 공연 목록"]
        A_PERF_D["/admin/performance/detail?id= — 공연 상세/수정"]
        A_PERF_A["/admin/performance/assign — 공연 등록"]
        A_NEXT["/admin/performance/next — 예정 공연 목록"]
        A_NEXT_D["/admin/performance/next/detail?id= — 상세/수정"]
        A_NEXT_A["/admin/performance/next/assign — 등록"]
    end

    ROOT --> Public
    ROOT --> Admin

    PERF --> PERF_D
    NEXT --> NEXT_D
    NOTICE --> NOTICE_D
    NEWS --> NEWS_D

    A_NOTICE --> A_NOTICE_D & A_NOTICE_A
    A_NEWS --> A_NEWS_D & A_NEWS_A
    A_PERF --> A_PERF_D & A_PERF_A
    A_NEXT --> A_NEXT_D & A_NEXT_A
```

- 공개 상세는 `/:id` 경로 파라미터, 관리자 상세는 기존 `?id=` 쿼리 방식을 유지합니다.
- `robots.txt`에서 `/admin`, `/api`는 크롤링 차단됩니다.

---

## 5. 빌드 & 배포 파이프라인

`.env`가 쓰이는 시점(프론트=빌드 타임, 백엔드=런타임)에 주의하세요.

```mermaid
flowchart TB
    subgraph Deploy["EC2 서버에서 (SSH)"]
        PULL["git pull"]

        subgraph FEBuild["프론트엔드 빌드"]
            FI["npm install"]
            SITEMAP["generate-sitemap.mjs<br/>API에서 글/공연 수집 →<br/>개별 URL 포함 sitemap.xml 생성<br/>(API 미도달 시 정적 페이지 폴백)"]
            TC["vue-tsc 타입체크"]
            SSG["vite-ssg build → dist/"]
            FR["pm2 restart frontend"]
        end

        subgraph BEBuild["백엔드 빌드"]
            BI["npm install"]
            TSC["tsc → dist/"]
            BR["pm2 restart backend"]
        end
    end

    FENV[/"frontend/.env<br/>VITE_KAKAO_MAP_KEY"/]
    BENV[/"backend/.env<br/>DB_* · AWS_*"/]

    PULL --> FI --> SITEMAP --> TC --> SSG --> FR
    PULL --> BI --> TSC --> BR

    FENV -.->|"빌드 타임에 dist에 주입<br/>(%VITE_KAKAO_MAP_KEY% 치환)"| SSG
    BENV -.->|"런타임에 dotenv로 로드"| BR
```

- `npm run build` = `generate-sitemap` → (`type-check` ∥ `build-ssg`) 병렬 실행.
- **`pm2 restart frontend`는 빌드하지 않습니다.** 기존 `dist`만 다시 서빙하므로 변경 반영에는 반드시 `npm run build`가 선행되어야 합니다.
- `.env` 파일 두 개는 gitignore 대상이라 서버에 최초 1회 수동 생성합니다.

---

## 6. 프론트엔드 모듈 의존 다이어그램

뷰 → 컴포저블 → API 래퍼 → HTTP 클라이언트로 이어지는 의존 관계입니다.

```mermaid
flowchart TB
    subgraph Views["views/"]
        HOME["Home.vue"]
        LIST["목록 뷰<br/>Notice · News · Performance(Next)"]
        DETAIL["상세 뷰<br/>NoticeDetail · NewsDetail ·<br/>PerformanceDetail(Next)"]
        ADMIN_L["관리자 목록 뷰<br/>AdminNotice · AdminNews ·<br/>AdminPerformance(Next)"]
        ADMIN_E["관리자 편집 뷰<br/>*Detail · *Assign (Quill)"]
        ABANNER["AdminBanner.vue<br/>(모달 CRUD)"]
    end

    subgraph Composables["composables/"]
        UAL["useAdminList<br/>검색·페이지네이션·라우트 동기화"]
        UAD["useAsyncData<br/>로딩/에러 상태 표준화"]
    end

    subgraph ApiLayer["api/"]
        BAPI["banner.api"]
        BOAPI["board.api"]
        PAPI["perfo.api"]
        REQ["request.util<br/>apiRequest() + ApiError"]
        DTO["dto/<br/>BannerEntity · BoardEntity ·<br/>PerfoEntity · ResponseDto"]
    end

    subgraph Utils["utils/"]
        CLIENT["apiClient<br/>axios 인스턴스 (API_SERVER)"]
        SEO["seo.util<br/>setMetaTags · setJsonLd ·<br/>toPlainText · pageSeoConfig"]
        COMMON["common-util"]
    end

    subgraph Shared["공통 컴포넌트 · 상태"]
        COMP["components/common<br/>ApocPagination · EmptyState ·<br/>ApocImageSet · ApocShareButton"]
        STORE["stores/ (Pinia)<br/>data-store · state-store"]
        MAIN["main.ts (ViteSSG)<br/>라우터 가드에서 pageSeoConfig 적용"]
    end

    HOME --> BAPI & BOAPI & PAPI
    LIST --> BOAPI & PAPI
    DETAIL --> BOAPI & PAPI
    DETAIL --> SEO
    ADMIN_L --> UAL
    ADMIN_E --> BOAPI & PAPI
    ABANNER --> BAPI

    UAL --> UAD
    UAL --> BOAPI & PAPI

    BAPI & BOAPI & PAPI --> REQ
    BAPI & BOAPI & PAPI --> DTO
    REQ --> CLIENT

    MAIN --> SEO
    MAIN --> STORE
    LIST & ADMIN_L --> COMP
    DETAIL --> COMP
```

- 관리자 목록 뷰 4개는 `useAdminList` 하나로 검색·페이지네이션 로직을 공유합니다 (뷰별 차이는 `buildParam`/`fetch` 주입).
- 모든 API 함수는 `apiRequest` 헬퍼를 거치며, 실패는 타입화된 `ApiError`로 던져집니다.
- 정적 페이지 SEO는 `main.ts` 라우터 가드(`pageSeoConfig`), 상세 페이지 SEO는 각 뷰의 `applySeo()`에서 처리합니다.
