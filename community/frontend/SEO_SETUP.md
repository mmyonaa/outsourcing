# 보광극장 SEO 설정 가이드

## 📋 개요

보광극장 웹사이트의 검색 엔진 최적화(SEO)를 위한 설정 가이드입니다.

## ✅ 구현된 SEO 기능

### 1. 기본 메타 태그 (index.html)
- 페이지 제목, 설명, 키워드
- Open Graph 태그 (Facebook, LinkedIn 공유 시 사용)
- Twitter Card 태그
- Canonical URL
- 언어 설정 (한국어)
- 검색 봇 허용 설정

### 2. 구조화된 데이터 (JSON-LD)
- Schema.org 형식의 구조화된 데이터
- 공연장(PerformingArtsTheater) 타입
- 주소, 위치 정보 포함

### 3. Robots.txt
- 위치: `/public/robots.txt`
- 검색 봇 허용/차단 설정
- Sitemap 위치 명시
- 관리자 페이지 크롤링 차단

### 4. Sitemap.xml
- 위치: `/public/sitemap.xml`
- 모든 주요 페이지 URL 포함
- 업데이트 빈도와 우선순위 설정

### 5. 페이지별 동적 메타 태그
- 라우터 전환 시 자동으로 메타 태그 업데이트
- 각 페이지별 맞춤 SEO 설정

## 🔧 추가 설정이 필요한 항목

### 1. 사이트 소유권 확인

#### Google Search Console
1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 → 도메인 또는 URL 접두어 선택
3. 소유권 확인 코드 받기
4. `index.html`의 다음 부분 수정:
   ```html
   <meta name="google-site-verification" content="구글 사이트 소유 확인 코드" />
   ```

#### Naver Search Advisor
1. [네이버 서치어드바이저](https://searchadvisor.naver.com/) 접속
2. 사이트 등록
3. 소유권 확인 코드 받기
4. `index.html`의 다음 부분 수정:
   ```html
   <meta name="naver-site-verification" content="네이버 사이트 소유 확인 코드" />
   ```

### 2. OG 이미지 준비
- 크기: 1200x630 픽셀 권장
- 파일 경로: `/public/assets/og-image.jpg`
- SNS 공유 시 표시되는 대표 이미지

### 3. 도메인 및 URL 수정
현재 `https://www.bktheater.com`으로 설정되어 있습니다.
실제 도메인으로 변경이 필요한 파일:
- `index.html`: canonical, og:url
- `sitemap.xml`: 모든 URL
- `seo.util.ts`: 기본 URL 설정

### 4. 위치 정보 수정
`index.html`의 JSON-LD에서 정확한 주소와 좌표 입력:
```json
"address": {
  "@type": "PostalAddress",
  "addressCountry": "KR",
  "addressRegion": "서울특별시",
  "addressLocality": "종로구",
  "streetAddress": "실제 도로명 주소"
},
"geo": {
  "@type": "GeoCoordinates",
  "latitude": "실제 위도",
  "longitude": "실제 경도"
}
```

### 5. SNS 계정 연결
`index.html`의 JSON-LD에서 실제 SNS URL 입력:
```json
"sameAs": [
  "https://www.instagram.com/실제계정",
  "https://www.facebook.com/실제계정"
]
```

## 📊 검색 엔진 등록

### Google
1. [Google Search Console](https://search.google.com/search-console)에서 사이트 등록
2. Sitemap 제출: `https://www.bktheater.com/sitemap.xml`
3. URL 검사 도구로 주요 페이지 색인 요청

### Naver
1. [네이버 서치어드바이저](https://searchadvisor.naver.com/)에서 사이트 등록
2. 사이트맵 제출
3. 수집 요청

### Daum (Kakao)
1. [Daum 검색등록](https://register.search.daum.net/index.daum)에서 사이트 등록

## 🎯 검색 키워드

설정된 주요 검색 키워드:
- 보광
- 보광극장
- 보광 극장
- 보광극장 대관
- 보광 극장 대관
- 보광 극장 공연
- 종로 공연장
- 서울 공연장
- 극장 대관
- 공연장 대관

## 📈 SEO 개선 팁

1. **콘텐츠 정기 업데이트**: 공연 정보, 공지사항 등을 자주 업데이트
2. **내부 링크**: 페이지 간 적절한 내부 링크 구조 유지
3. **이미지 최적화**: alt 속성에 설명적인 텍스트 추가
4. **페이지 로딩 속도**: 이미지 압축, 코드 최적화
5. **모바일 최적화**: 반응형 디자인 유지
6. **SSL 인증서**: HTTPS 사용
7. **정기 모니터링**: Google Analytics, Search Console 확인

## 📝 체크리스트

배포 전 확인사항:
- [ ] Google Search Console 소유권 확인 코드 입력
- [ ] Naver 서치어드바이저 확인 코드 입력
- [ ] OG 이미지 준비 및 업로드
- [ ] 실제 도메인으로 URL 변경
- [ ] 정확한 주소와 위치 정보 입력
- [ ] SNS 계정 URL 입력
- [ ] Sitemap 제출
- [ ] robots.txt 접근 가능 확인

## 🔍 모니터링

- Google Search Console에서 검색 성능 확인
- Google Analytics로 트래픽 분석
- 주기적으로 "보광극장" 등의 키워드로 검색 순위 확인
