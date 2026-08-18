-- 2026-08-18 코드 리뷰 후속: 제약/인덱스 보강
-- 운영 DB에 수동으로 1회 적용한다. (적용 후 ddl.sql 신규 설치본과 동등해짐)
--
-- CHECK 은 NOT VALID 로 추가해 기존 행 검증을 생략(락 최소화)하고,
-- 필요 시 VALIDATE CONSTRAINT 를 별도로 실행한다.

-- Y/N 플래그 값 제약
ALTER TABLE board
  ADD CONSTRAINT board_del_yn_check CHECK (del_yn IN ('Y', 'N')) NOT VALID,
  ADD CONSTRAINT board_best_yn_check CHECK (best_yn IN ('Y', 'N')) NOT VALID;

ALTER TABLE performance
  ADD CONSTRAINT performance_del_yn_check CHECK (del_yn IN ('Y', 'N')) NOT VALID;

ALTER TABLE banner
  ADD CONSTRAINT banner_del_yn_check CHECK (del_yn IN ('Y', 'N')) NOT VALID,
  ADD CONSTRAINT banner_active_yn_check CHECK (active_yn IN ('Y', 'N')) NOT VALID;

-- 사실상 필수인 컬럼 (기존 데이터에 NULL 이 없는지 먼저 확인 후 적용)
-- SELECT count(*) FROM board WHERE title IS NULL OR board_type IS NULL;
ALTER TABLE board
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN board_type SET NOT NULL;

-- SELECT count(*) FROM performance WHERE title IS NULL OR per_type IS NULL;
ALTER TABLE performance
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN per_type SET NOT NULL;

-- 목록 쿼리 패턴에 맞춘 인덱스
-- board: WHERE board_type AND del_yn ORDER BY best_yn DESC, mod_dt DESC
CREATE INDEX IF NOT EXISTS idx_board_list
  ON board (board_type, del_yn, best_yn DESC, mod_dt DESC);

-- performance: WHERE per_type / category AND del_yn ORDER BY reg_dt DESC
CREATE INDEX IF NOT EXISTS idx_performance_list
  ON performance (per_type, del_yn, reg_dt DESC);
CREATE INDEX IF NOT EXISTS idx_performance_category
  ON performance (category, del_yn, reg_dt DESC);

-- banner: WHERE del_yn / active_yn ORDER BY display_order, mod_dt DESC
CREATE INDEX IF NOT EXISTS idx_banner_list
  ON banner (del_yn, active_yn, display_order, mod_dt DESC);
