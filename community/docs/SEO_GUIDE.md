# SEO 종합 가이드

> 보광극장 사이트의 검색엔진 최적화(SEO) 통합 문서.
> 기존 SEO_SETUP / SEARCH_REGISTRATION_GUIDE / NAVER_SEO_SETUP / NAVER_SEARCHADVISOR_GUIDE /
> SEO_TIMELINE_GUIDE 5개 문서를 통합·현행화(https 기준)한 버전입니다. (2026-07-07)

---

## 1. 구현된 SEO 기능 (코드 기준 현황)

| 기능 | 상태 | 위치 |
|------|------|------|
| 기본 메타태그 (title/description/keywords) | ✅ | `frontend/index.html` |
| Open Graph / Twitter Card | ✅ | `frontend/index.html` |
| 구조화 데이터 — 극장(PerformingArtsTheater) | ✅ | `frontend/index.html` (JSON-LD) |
| 페이지별 동적 메타태그 (목록 페이지) | ✅ | `src/utils/seo.util.ts` + `main.ts` 라우터 가드 |
| 상세페이지 동적 메타/OG/JSON-LD (NewsArticle·TheaterEvent) | ✅ | 각 상세 뷰의 `applySeo()` |
| 상세페이지 경로 파라미터 URL (`/notice/:id` 등) | ✅ | `src/router/index.ts` |
| sitemap.xml — 개별 글/공연 URL 포함 빌드 타임 생성 | ✅ | `scripts/generate-sitemap.mjs` (빌드 시 자동) |
| robots.txt (admin/api 차단, Sitemap 명시) | ✅ | `public/robots.txt` |
| HTTPS (Let's Encrypt, http→https 301) | ✅ | Nginx + certbot |
| 소유권 확인 메타태그 (구글 1건, 네이버 2건) | ✅ | `frontend/index.html` |
| 이미지 alt/lazy 최적화 | ⬜ 미완 | 개선 보고서 #23 |

- OG 이미지: `public/assets/og-image.jpg` (1200x630)
- 사이트 주소는 항상 **`https://bktheater.com`** (www는 non-www로 리다이렉트)

---

## 2. 검색엔진 등록 절차

### 2-1. Google Search Console

1. https://search.google.com/search-console → "속성 추가"
2. **URL 접두어** 방식 → `https://bktheater.com` 입력
   - (DNS 접근 가능하면 **도메인 속성**이 더 깔끔 — http/https/www 전부 커버)
3. 소유 확인: **HTML 태그** 방식 → index.html에 이미 배포되어 있어 "확인"만 누르면 통과
4. **Sitemaps** 메뉴 → `sitemap.xml` 제출
5. **URL 검사** → 홈·주요 페이지 "색인 생성 요청" (색인을 24-48시간으로 단축)

> 제출 직후 사이트맵 상태가 **"가져올 수 없음"** 으로 표시되는 것은 유명한 지연 표시입니다.
> 서버가 200으로 응답하고 있다면 1~3일 내 "성공"으로 바뀝니다. (문제 해결 §5 참고)

### 2-2. 네이버 서치어드바이저

1. https://searchadvisor.naver.com → 웹마스터 도구 → 사이트 등록: `https://bktheater.com`
   (http/https는 별개 사이트로 취급되므로 반드시 https로 등록)
2. 소유 확인: **HTML 태그** 방식 → 기존 메타태그로 바로 통과
3. **요청 > 사이트맵 제출** → `https://bktheater.com/sitemap.xml`
4. **요청 > 웹 페이지 수집** → 주요 URL 수집 요청 (하루 10개 제한):
   ```
   https://bktheater.com/
   https://bktheater.com/introduce
   https://bktheater.com/performance
   https://bktheater.com/rental
   https://bktheater.com/notice
   https://bktheater.com/news
   ```
5. **설정 > 사이트 정보**: 제목 "보광극장", 설명·대표이미지(1200x630) 등록
6. **검증 > robots.txt** 정상 수집 확인

### 2-3. Daum(Kakao)

- https://register.search.daum.net/index.daum 에서 사이트 등록 신청 (한 번이면 끝)

---

## 3. 노출 타임라인 (예상)

| 단계 | Google | Naver |
|------|--------|-------|
| 소유권 확인 | 즉시~1일 | 즉시~1일 |
| 첫 크롤링/수집 | 1-3일 | 1-3일 |
| 첫 색인 (`site:bktheater.com`에 표시) | 3-7일 | 3-7일 |
| **브랜드명("보광극장") 노출** | **1-2주** | **1-2주** |
| 일반 키워드("용산 공연장" 등) | 2주-3개월 | 2주-1개월 |

- 첫 1개월은 순위가 오르내리는 게 정상이며 점차 안정화됩니다.
- `site:`에는 나오는데 브랜드명 검색에 안 나오는 것도 정상 과정입니다(색인됐지만 순위 낮음).

---

## 4. 상위 노출 전략

### 즉효 (1-3일)
- **네이버 플레이스 등록** 🏆 — "보광극장" 검색 시 지도+정보로 **최상단** 노출. 사업자등록증 필요. https://place.naver.com/
- **Google 비즈니스 프로필** — 구글 지도/정보 패널 노출. https://www.google.com/business/
  - 상호·주소(서울 용산구 장문로19길 4 지하)·전화·운영시간·사진 등록, 웹사이트 링크 포함

### 단기 (1-2주)
- sitemap 제출 + URL 수동 색인 요청 (§2)
- SNS 프로필(인스타그램 등)에 웹사이트 링크

### 중장기 (1-6개월)
- 공연·공지 **정기 업데이트** (크롤링 빈도·신선도 ↑)
- 네이버 블로그 포스팅 등 백링크 확보
- 인터파크 등 공연 플랫폼에 극장 정보 + 링크 등록
- 이미지 alt·로딩 속도 개선

### 피해야 할 것
- 키워드 반복 남용, 숨김 텍스트, 백링크 구매, 복사 콘텐츠 → 스팸 페널티 위험

---

## 5. 모니터링 & 문제 해결

### 정기 확인 (주 1회 권장)
- Google Search Console **실적**: 노출/클릭 검색어
- 네이버 서치어드바이저 **통계 > 검색 유입 / 수집 현황**
- 검색 테스트: `보광극장`, `보광 극장`, `보광극장 대관`, `용산 공연장`, `site:bktheater.com`

### 사이트맵 "가져올 수 없음" / 수집 실패
```bash
curl -sI https://bktheater.com/sitemap.xml   # 200 + application/xml 인지
curl -s  https://bktheater.com/robots.txt    # 차단 규칙 없는지
```
- 서버 응답이 정상이면 **기다리면 됨** (구글은 제출 직후 흔히 "가져올 수 없음"으로 표시)
- 3일 이상 지속 시: 사이트맵 삭제 후 재제출, 속성 프로토콜(https) 일치 확인

### 소유권 확인 실패
```bash
curl -s https://bktheater.com/ | grep -E "naver-site-verification|google-site-verification"
```
- 메타태그가 안 나오면 빌드/배포 누락 → `pnpm build && pm2 restart frontend`

### 검색에 안 나타남
1. 시간 부족 (최소 1-2주) → 대기
2. `site:` 검색으로 색인 여부부터 확인
3. 빠른 노출이 급하면 네이버 플레이스 우선 등록

---

## 6. 운영 체크리스트

### 완료됨
- [x] 메타태그/OG/JSON-LD/robots/sitemap 구현
- [x] HTTPS 전환 및 코드 https화
- [x] 소유권 확인 태그 배포

### 할 일
- [ ] 구글: https 속성 등록 + sitemap 제출 (+ URL 색인 요청)
- [ ] 네이버: https 사이트 등록 + sitemap 제출 (+ 수집 요청)
- [ ] Daum 검색등록
- [ ] 네이버 플레이스 등록 ⭐
- [ ] Google 비즈니스 프로필 등록
- [ ] SNS 프로필에 사이트 링크
- [ ] (1-2주 후) 브랜드명 검색 노출 확인 및 순위 기록
