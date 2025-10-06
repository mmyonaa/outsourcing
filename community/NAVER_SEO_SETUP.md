# 네이버 서치어드바이저 설정 가이드

## 🎯 목표
네이버 검색에 "보광극장" 검색 시 사이트가 노출되도록 설정

---

## ✅ 1단계: 네이버 확인 코드 추가 (완료)

### 확인 코드
```html
<meta name="naver-site-verification" content="faac0211f1a39d46ad697e669d075a14e5f41e7b" />
```

✅ `index.html`에 이미 추가되었습니다!

---

## 🚀 2단계: 배포 및 확인

### 로컬에서 Git Push

```bash
cd /c/Users/apddf/bktheater/outsourcing/community
git add frontend/index.html
git commit -m "Add Naver site verification code"
git push origin main
```

### 서버에서 배포

```bash
# 1. SSH 접속
ssh ec2-user@YOUR_SERVER_IP

# 2. Git pull
cd /home/ec2-user/outsourcing/community/frontend
git pull origin main

# 3. 빌드
npm run build

# 4. PM2 재시작
pm2 restart frontend

# 5. 확인
curl http://bktheater.com/ | grep "naver-site-verification"
```

**예상 출력:**
```html
<meta name="naver-site-verification" content="faac0211f1a39d46ad697e669d075a14e5f41e7b" />
```

---

## 📋 3단계: 네이버 서치어드바이저 소유권 확인

### 1. 네이버 서치어드바이저 접속

[https://searchadvisor.naver.com/](https://searchadvisor.naver.com/)

### 2. 로그인

네이버 계정으로 로그인

### 3. 사이트 추가

1. **"웹마스터 도구"** 클릭
2. **"사이트 추가"** 클릭
3. 사이트 URL 입력:
   ```
   http://bktheater.com
   ```
4. **"확인"** 클릭

### 4. 소유 확인

1. **"HTML 태그"** 방식 선택
2. 표시된 메타 태그 확인:
   ```html
   <meta name="naver-site-verification" content="faac0211f1a39d46ad697e669d075a14e5f41e7b" />
   ```
3. 이미 `index.html`에 추가되어 있으므로 **"확인"** 버튼 클릭

### 5. 소유권 확인 성공

✅ "소유권이 확인되었습니다" 메시지가 나타나야 함

---

## 🗺️ 4단계: 사이트맵 제출

### 1. 서치어드바이저 메인 화면

1. **"요청" → "사이트맵 제출"** 클릭

### 2. 사이트맵 URL 입력

```
http://bktheater.com/sitemap.xml
```

### 3. 제출

**"확인"** 버튼 클릭

### 4. 상태 확인

- **"수집 대기"** → 정상
- 몇 시간 후 **"수집 중"** → 진행 중
- 며칠 후 **"수집 완료"** → 완료

---

## 📊 5단계: 수집 요청 (선택사항)

### 주요 페이지 수집 요청

1. **"요청" → "URL 수집 요청"**
2. URL 입력 후 요청:
   ```
   http://bktheater.com/
   http://bktheater.com/introduce
   http://bktheater.com/performance
   http://bktheater.com/rental
   http://bktheater.com/notice
   ```

### 일별 수집 요청 제한

- 일반 사용자: **10개/일**
- 사이트 등록 후: 제한 증가

---

## 🎨 6단계: 사이트 정보 최적화

### 1. 사이트 간단 설명

서치어드바이저 → **"설정" → "사이트 정보"**

**제목:**
```
보광극장
```

**설명:**
```
서울 종로구에 위치한 보광극장. 연극, 뮤지컬, 콘서트 등 다양한 공연과 극장 대관 서비스를 제공합니다.
```

### 2. 대표 이미지 등록

- 크기: 1200x630px 권장
- 로고 또는 극장 사진 업로드

---

## 📈 7단계: 검색 반영 확인

### 검색 시기

| 단계 | 시간 |
|------|------|
| 사이트 등록 | 즉시 |
| 사이트맵 수집 시작 | 1-3일 |
| 첫 색인 | 3-7일 |
| 검색 결과 노출 | 1-2주 |

### 확인 방법

1. **네이버 검색창에서:**
   ```
   site:bktheater.com
   ```
   → 사이트가 색인되었는지 확인

2. **브랜드명 검색:**
   ```
   보광극장
   ```
   → 검색 결과에 나타나는지 확인

---

## 🔍 8단계: 검색 성과 모니터링

### 서치어드바이저 메뉴

1. **"통계" → "검색 유입"**
   - 어떤 검색어로 유입되는지
   - 클릭 수, 노출 수 확인

2. **"통계" → "수집 현황"**
   - 얼마나 많은 페이지가 수집되었는지

3. **"통계" → "사이트 최적화"**
   - SEO 점수 확인
   - 개선 사항 확인

---

## 💡 네이버 검색 최적화 팁

### 1. 네이버 플레이스 등록 (중요!)

[네이버 플레이스](https://place.naver.com/)

**"보광극장" 검색 시 지도와 함께 나타나도록:**

1. 네이버 플레이스 접속
2. 사업자 등록
3. 극장 정보 입력:
   - 상호명: 보광극장
   - 주소: 실제 주소
   - 전화번호
   - 운영시간
   - 사진 (극장 내부, 무대 등)
4. 웹사이트: `http://bktheater.com`

**효과:**
- "보광극장" 검색 → 지도 + 정보 상단 노출
- "종로 극장" 검색 → 지역 검색 결과에 노출

### 2. 네이버 블로그 연동

1. 네이버 블로그 개설
2. 공연 후기, 소식 등 게시
3. 웹사이트 링크 포함
4. **백링크** 효과로 검색 순위 향상

### 3. 정기적인 콘텐츠 업데이트

- 공연 정보 업데이트
- 공지사항 게시
- 새로운 페이지 추가
- → 네이버가 자주 방문하게 됨

### 4. 소셜 미디어 연동

- Instagram에 웹사이트 링크
- Facebook 페이지 생성
- 공연 포스팅 시 링크 포함

---

## ✅ 체크리스트

### 초기 설정
- [x] 네이버 확인 코드 추가
- [ ] 배포
- [ ] 네이버 서치어드바이저 소유권 확인
- [ ] 사이트맵 제출
- [ ] 주요 페이지 수집 요청
- [ ] 사이트 정보 입력

### 추가 최적화
- [ ] 네이버 플레이스 등록
- [ ] 네이버 블로그 개설
- [ ] 소셜 미디어 링크 추가
- [ ] 정기 업데이트 계획 수립

---

## 🎯 예상 결과

### 1-2주 후:

**네이버 검색:**
```
보광극장
```

**예상 결과:**
1. 네이버 플레이스 (지도 + 정보) ← 가장 먼저 노출
2. 공식 웹사이트 (http://bktheater.com)
3. 관련 블로그 게시물

**검색 순위 향상:**
- "보광극장" → 1위 (브랜드명)
- "보광 극장 대관" → 상위권
- "종로 공연장" → 중상위권

---

## 🐛 문제 해결

### 소유권 확인 실패

**증상:**
```
메타 태그를 찾을 수 없습니다
```

**해결:**
1. 배포 확인:
   ```bash
   curl http://bktheater.com/ | grep "naver-site-verification"
   ```

2. 빌드 확인:
   ```bash
   curl http://bktheater.com/ | grep "<head>"
   ```

3. 메타 태그가 `<head>` 안에 있는지 확인

### 사이트맵 수집 실패

**증상:**
```
사이트맵을 가져올 수 없습니다
```

**해결:**
1. sitemap.xml 접근 확인:
   ```bash
   curl http://bktheater.com/sitemap.xml
   ```

2. robots.txt 확인:
   ```bash
   curl http://bktheater.com/robots.txt
   ```

3. Sitemap URL 정확히 입력:
   ```
   http://bktheater.com/sitemap.xml
   ```

### 검색 결과에 안 나타남

**가능한 이유:**
1. **시간 부족**: 최소 1-2주 기다리기
2. **콘텐츠 부족**: 더 많은 내용 추가
3. **경쟁 사이트**: 같은 이름의 다른 사이트 존재
4. **페널티**: 스팸으로 간주됨 (드묾)

**해결:**
1. 네이버 플레이스 먼저 등록 (빠름)
2. 블로그 포스팅 (백링크)
3. 정기적인 업데이트
4. 시간 기다리기

---

## 📞 다음 단계

1. **지금 바로:**
   ```bash
   git add frontend/index.html
   git commit -m "Add Naver verification code"
   git push
   ```

2. **서버에서 배포:**
   ```bash
   cd /home/ec2-user/outsourcing/community/frontend
   git pull
   npm run build
   pm2 restart frontend
   ```

3. **네이버 서치어드바이저:**
   - 소유권 확인
   - 사이트맵 제출

4. **네이버 플레이스 등록** (중요!)
   - 지도 검색 노출

배포 후 결과를 알려주시면 다음 단계를 도와드리겠습니다!
