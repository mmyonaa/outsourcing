-- 확장 설치 (최초 1회만 실행)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 게시판 (공지사항 / 보도자료 — board_type으로 구분)
CREATE TABLE board (
    board_idx UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_type VARCHAR(50),          -- 게시판 종류 (공지사항/보도자료 구분)
    title VARCHAR(500),
    body TEXT,
    author VARCHAR(500),
    views INTEGER DEFAULT 0,
    best_yn CHAR(1) DEFAULT 'N',     -- 상단 고정 여부 (정렬 우선)
    reg_dt TIMESTAMPTZ DEFAULT NOW(),
    mod_dt TIMESTAMPTZ DEFAULT NOW(),
    del_yn CHAR(1) DEFAULT 'N'
);

-- 공연 (자체/대관 — per_type으로 구분)
CREATE TABLE performance (
    per_idx UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    per_type VARCHAR(50),            -- 공연 종류 (자체/대관 구분)
    category VARCHAR(50),            -- 카테고리 (공연/교육/행사)
    title VARCHAR(500),
    title_sec VARCHAR(500),          -- 부제목
    title_third VARCHAR(500),        -- 부제목(보조)
    body TEXT,
    author VARCHAR(500),
    img_url VARCHAR(500),            -- 포스터 이미지 URL (S3)
    views INTEGER DEFAULT 0,
    reg_dt TIMESTAMPTZ DEFAULT NOW(),
    mod_dt TIMESTAMPTZ DEFAULT NOW(),
    del_yn CHAR(1) DEFAULT 'N'
);

-- 홈 배너
CREATE TABLE banner (
    banner_idx UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    img_url VARCHAR(500),
    swipe_duration INTEGER DEFAULT 5,
    display_order INTEGER DEFAULT 0,
    active_yn CHAR(1) DEFAULT 'Y',
    reg_dt TIMESTAMPTZ DEFAULT NOW(),
    mod_dt TIMESTAMPTZ DEFAULT NOW(),
    del_yn CHAR(1) DEFAULT 'N'
);

-- 애플리케이션 설정 (key-value)
-- 기본 배너 활성 여부 등 서버 재시작/다중 인스턴스에서도 유지되어야 하는 상태 저장
CREATE TABLE app_setting (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value VARCHAR(500),
    reg_dt TIMESTAMPTZ DEFAULT NOW(),
    mod_dt TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 배너 활성 상태 초기값
INSERT INTO app_setting (setting_key, setting_value)
VALUES ('default_banner_active', 'Y')
ON CONFLICT (setting_key) DO NOTHING;
