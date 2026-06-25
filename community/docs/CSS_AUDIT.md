# 사이트 CSS 전체 점검 리포트

> 작성일: 2026-06-25 · 대상: `community/frontend`
> 점검 범위: 전역/공유 SCSS, 공개 페이지 일관성, 반응형/모바일

세 영역으로 나눠 전체 스타일을 점검한 결과입니다. 우선순위(P0=버그성 → P3=유지보수)별로 정리했으며,
`✅ 검증됨` 표시는 실제 코드에서 직접 확인한 항목입니다.

---

## P0 — 모바일에서 레이아웃이 깨지는 문제 (우선 수정 권장)

### 1. 카테고리 필터가 모바일에서 가로 스크롤 발생 `✅ 검증됨`
- **위치:** [Performance.vue:459-463](../frontend/src/views/Performance.vue#L459-L463)
- **문제:** 768px 이하에서 `.category-filter-wrapper`에 `flex-wrap: nowrap` 적용 + 태그에 `white-space: nowrap`.
  좁은 화면에서 필터 버튼들이 줄바꿈되지 않고 가로로 넘쳐 스크롤이 생김.
- **수정:** `flex-wrap: nowrap` → `flex-wrap: wrap`
- PerformanceNext.vue에도 동일 패턴 가능성 → 함께 확인 필요.

### 2. 소개 페이지 포스터 고정 너비 오버플로 `✅ 검증됨`
- **위치:** [introduce.scss:167-172](../frontend/src/assets/css/introduce.scss#L167-L172)
- **문제:** `.poster img { width: 320px; }` 고정. 375px 미만 기기 + 좌우 패딩에서 화면 밖으로 넘침.
- **수정:** `max-width: 100%` 추가 또는 모바일에서 `width: 100%`.

### 3. 카드 그리드에 모바일 단일 컬럼 폴백 없음 `✅ 검증됨`
- **위치:** [board.scss:215-230](../frontend/src/assets/css/board.scss#L215-L230)
- **문제:** `repeat(4,1fr)` → s-pc `3` → tablet `2`까지만 있고 **모바일(1컬럼) 폴백 없음**.
  작은 폰에서 2컬럼이 강제돼 카드가 과하게 찌그러짐.
- **수정:** `@include mobile { grid-template-columns: 1fr; }` 추가.
- 유사: [introduce.scss:100-111](../frontend/src/assets/css/introduce.scss#L100-L111) (4→2 급격한 점프), [home.scss:37-97](../frontend/src/assets/css/home.scss#L37-L97)

---

## P1 — 디자인 일관성 (방금 개선한 상세 페이지 기준 통일)

> 기준: PerformanceDetail / PerformanceNextDetail의 새 스타일
> (카드 `border-radius:16px`, 그림자 `0 4px 16px rgba(0,0,0,.04)`, pill 태그 `999px`)

### 4. 카드 `border-radius` 제각각
- 리스트 카드 `12px` ([Performance.vue:307](../frontend/src/views/Performance.vue#L307), PerformanceNext.vue:307)
- 모바일 카드 `8px` ([notice.scss:218](../frontend/src/assets/css/notice.scss#L218))
- 홈 포스터 `12px`/태그 `18px` ([home.scss](../frontend/src/assets/css/home.scss))
- 상세 패널 `16px`
- **권장:** 카드류를 `16px`로 통일.

### 5. 카드 그림자 제각각
- 리스트 카드 `0 2px 8px` / hover `0 8px 24px`
- 모바일 카드 `0 2px 4px`
- 상세 패널 `0 4px 16px rgba(0,0,0,.04)`
- **권장:** 1~2단계 표준 그림자로 통일.

### 6. 카테고리 태그 스타일 불일치
- 상세: `999px` pill, `13px`, `padding 0.4rem 0.95rem`
- 리스트 카드: `18px`, `14px`, `padding 0.5rem 1.2rem` ([Performance.vue:358-384](../frontend/src/views/Performance.vue#L358-L384))
- **권장:** 한쪽으로 통일(리스트는 약간 크게 두는 것도 가능하나 radius는 맞추기).

### 7. 페이지 제목(h1) 공통 스타일 부재
- 모든 공개 페이지가 맨 `<h1>`을 브라우저 기본/전역 cascade에 의존. 일관된 크기·굵기·여백 없음.
- **권장:** 공유 `.page-title` 클래스 또는 전역 `h1` 규칙 1개 정의.

### 8. 컨테이너 상단 여백 불일치
- 리스트 페이지 `3rem` vs 상세 페이지 `2rem`.
- **권장:** 한 값으로 통일하거나 `.page-content` 래퍼로 표준화.

---

## P2 — 전역 스타일 구조 / 디자인 토큰

### 9. 하드코딩된 회색 계열 (30+ 곳)
- `#333 #555 #888 #999 #aaa #ccc #ddd #eee` 가 토큰 없이 산재
  ([notice.scss](../frontend/src/assets/css/notice.scss), [introduce.scss](../frontend/src/assets/css/introduce.scss) 등)
- **권장:** `$colorGray-100~900` 스케일 신설 후 치환.

### 10. `border-radius` px/rem 혼용
- `4px 6px 8px 12px 16px 18px` + `0.5rem 1rem 3rem` 혼재.
- **권장:** rem 기반 4~5단계 스케일(`$radius-sm/md/lg`)로 표준화.

### 11. box-shadow 중복·미세 차이
- `0 2px 8px`, `0 4px 12px(.05/.06)`, `0 6px 18px` 등 거의 같은 그림자가 흩어져 있음.
- **권장:** `$shadow-sm/md/lg` 토큰 3종으로 추출.

### 12. z-index 스케일 부재
- `0,1,2,3,4,5,6,50,51,52,99,102` 가 파일별로 산발
  (header.scss, megaMenu.scss, write.scss). 헤더(3)와 write(2~10)가 겹칠 위험.
- **권장:** `$z-header/$z-dropdown/$z-modal` 등 중앙 스케일.

### 13. 반응형 breakpoint 불일치
- variables.scss에 `@mixin mobile/tablet/pc` 가 있는데 **사용 안 함**.
  home/introduce/rental/Performance가 `600px 768px 900px 1024px 1200px`를 인라인으로 제각각 사용.
  ([home.scss 다수](../frontend/src/assets/css/home.scss), [Performance.vue:431-503](../frontend/src/views/Performance.vue#L431-L503))
- **권장:** variables.scss 믹스인으로 일원화.

### 14. `max-width` 컨테이너 폭 불일치
- `140rem`(footer/new) vs `130rem`(board) vs `960px`(introduce).
- **권장:** 공통 컨테이너 폭 1개로 통일.

---

## P3 — 유지보수 / 정리

### 15. `!important` 남용 (15+)
- [new.scss:6,33-39](../frontend/src/assets/css/new.scss), [home.scss:2](../frontend/src/assets/css/home.scss),
  megaMenu.scss, quillSnow.scss 다수. 특정성 충돌 신호 → 점진 리팩터.

### 16. 미사용/주석 코드 정리
- `$colorPrimaryOld`, `$colorTagOld` (variables.scss:5,26) 미사용 → 제거.
- megaMenu.scss/quillSnow.scss/common.scss의 주석 처리된 규칙 블록 정리.

### 17. 터치 타깃 < 44px
- megaMenu 로그인/`.make-btn` `height:40px`, notice 리셋버튼 모바일 `40px`.
- **권장:** 모바일 최소 44px.

### 18. 반복 hover/transition 패턴 → 믹스인화
- `translateY(-4px) + box-shadow` 카드 hover가 여러 곳 복붙 ([home.scss:260-263, 364-367](../frontend/src/assets/css/home.scss#L260-L267)).

---

## 권장 진행 순서

1. **P0 (3건)** — 모바일 깨짐 즉시 수정. 변경 작고 영향 큼.
2. **P1 (4~8)** — 디자인 토큰 일부(라운드/그림자/태그)만 먼저 맞춰도 체감 일관성 ↑.
3. **P2 (디자인 토큰 도입)** — variables.scss에 gray/shadow/radius/z-index/breakpoint 스케일 신설 후 점진 치환.
4. **P3** — 토큰 도입과 병행해 정리.

> ⚠️ P2의 토큰 치환은 전역 영향 범위가 크므로, 한 번에 하지 말고
> "토큰 신설 → 신규/수정 코드부터 적용 → 기존 코드 점진 마이그레이션" 순서를 권장합니다.
