-- 확장 설치 (최초 1회만 실행)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 공지사항
CREATE TABLE board (
    board_idx UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500),
    body TEXT,
    author VARCHAR(500),
    views INTEGER DEFAULT 0,
    best_yn CHAR(1) DEFAULT 'N',
    reg_dt TIMESTAMPTZ DEFAULT NOW(),
    mod_dt TIMESTAMPTZ DEFAULT NOW(),
    del_yn CHAR(1) DEFAULT 'N'
);

-- 공연
CREATE TABLE performance (
    per_idx UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    per_type VARCHAR(50),
    title VARCHAR(500),
    body TEXT,
    img_url VARCHAR(100),
    views INTEGER DEFAULT 0,
    reg_dt TIMESTAMPTZ DEFAULT NOW(),
    mod_dt TIMESTAMPTZ DEFAULT NOW(),
    del_yn CHAR(1) DEFAULT 'N'
);
