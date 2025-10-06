# Sitemap 배포 문제 해결 가이드

## 🔍 문제
- `http://bktheater.com/sitemap.xml` → 404 Not Found
- Google Search Console에서 sitemap을 읽을 수 없음

## ✅ 원인
sitemap.xml 파일이 서버에 배포되지 않음

---

## 🚀 해결 방법

### 방법 1: Nginx로 정적 파일 서빙 (추천)

PM2 대신 Nginx에서 직접 빌드된 파일을 서빙

#### 1. 서버에 빌드 파일 업로드

**로컬에서:**
```bash
# 프론트엔드 빌드
cd frontend
npm run build

# 빌드 파일 확인
ls .vite-ssg-temp/wu8bh7b11a/
# sitemap.xml, robots.txt 있는지 확인
```

**서버로 업로드:**
```bash
# SCP 사용
scp -r .vite-ssg-temp/wu8bh7b11a/* username@YOUR_SERVER_IP:/var/www/bktheater/

# 또는 rsync
rsync -avz .vite-ssg-temp/wu8bh7b11a/ username@YOUR_SERVER_IP:/var/www/bktheater/
```

#### 2. Nginx 설정 수정

서버에서:
```bash
sudo nano /etc/nginx/sites-available/bktheater.com
# 또는
sudo nano /etc/nginx/conf.d/bktheater.com.conf
```

**수정 내용:**
```nginx
server {
    listen 80;
    server_name bktheater.com www.bktheater.com;

    # 정적 파일 루트 디렉토리
    root /var/www/bktheater;
    index index.html;

    # 정적 파일 서빙
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 백엔드 API 프록시
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 3. Nginx 재시작

```bash
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. PM2에서 프론트엔드 중지 (이제 필요 없음)

```bash
pm2 stop frontend  # 또는 프론트엔드 앱 이름
pm2 save
```

백엔드만 PM2로 실행:
```bash
pm2 list
# backend만 running 상태여야 함
```

#### 5. 테스트

```bash
curl -I http://bktheater.com/sitemap.xml
# HTTP/1.1 200 OK 가 나와야 함

curl http://bktheater.com/robots.txt
# robots.txt 내용이 보여야 함
```

---

### 방법 2: PM2로 빌드 파일 서빙 (현재 방식 유지)

PM2를 계속 사용하려면:

#### 1. PM2 설정 확인

```bash
pm2 describe frontend
```

#### 2. 정적 파일 서버로 serve 사용

**serve 설치:**
```bash
npm install -g serve
```

**PM2 ecosystem 파일 수정:**
```javascript
module.exports = {
  apps: [
    {
      name: 'bktheater-frontend',
      script: 'serve',
      args: '-s .vite-ssg-temp/wu8bh7b11a -l 4000',
      cwd: '/path/to/frontend',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'bktheater-backend',
      script: './dist/index.js',
      cwd: '/path/to/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

**PM2 재시작:**
```bash
pm2 restart bktheater-frontend
pm2 save
```

#### 3. Nginx 설정 (프록시로 사용)

```nginx
server {
    listen 80;
    server_name bktheater.com www.bktheater.com;

    # 프론트엔드 프록시 (PM2 serve)
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 백엔드 API
    location /api {
        proxy_pass http://localhost:3000;
        # ... (이전과 동일)
    }
}
```

---

### 방법 3: 빌드 후 dist 폴더 이름 확인

Vite SSG는 `.vite-ssg-temp/random-id/` 경로에 빌드합니다.

#### 올바른 빌드 출력 경로 사용

**package.json 수정:**
```json
{
  "scripts": {
    "build": "vite build",
    "build-ssg": "vite-ssg build --out dist"
  }
}
```

`dist` 폴더로 직접 출력하도록 변경

**vite.config.ts 확인:**
```typescript
export default defineConfig({
  build: {
    outDir: 'dist',  // 출력 디렉토리
  },
  ssgOptions: {
    script: 'async',
    dirStyle: 'nested',
    format: 'esm',
  },
});
```

**재빌드:**
```bash
npm run build
ls dist/  # sitemap.xml, robots.txt 확인
```

---

## 🎯 권장 배포 프로세스

### 로컬 (개발 환경)

```bash
# 프론트엔드
cd frontend
npm run build

# 백엔드
cd ../backend
npm run build
```

### 서버 배포 스크립트

**deploy.sh** (서버에서 실행):
```bash
#!/bin/bash

# 변수
FRONTEND_DIR="/var/www/bktheater"
BACKEND_DIR="/home/user/backend"
REPO_DIR="/home/user/bktheater/outsourcing/community"

# Git pull
cd $REPO_DIR
git pull origin main

# 프론트엔드 빌드 및 배포
cd $REPO_DIR/frontend
npm install
npm run build

# 빌드 파일 복사
rm -rf $FRONTEND_DIR/*
cp -r .vite-ssg-temp/*/* $FRONTEND_DIR/

# 또는 dist 폴더 사용
# cp -r dist/* $FRONTEND_DIR/

# 백엔드 빌드 및 재시작
cd $REPO_DIR/backend
npm install
npm run build
pm2 restart backend

# Nginx 재시작 (필요시)
sudo systemctl reload nginx

echo "배포 완료!"
```

**실행:**
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## ✅ 체크리스트

### 배포 전
- [ ] `npm run build` 실행
- [ ] 빌드 폴더에 `sitemap.xml` 있는지 확인
- [ ] 빌드 폴더에 `robots.txt` 있는지 확인

### 서버 설정
- [ ] Nginx 설정 확인
- [ ] 정적 파일 경로 확인
- [ ] PM2 설정 확인 (필요시)

### 배포 후
- [ ] `curl http://bktheater.com/sitemap.xml` 확인
- [ ] `curl http://bktheater.com/robots.txt` 확인
- [ ] 브라우저에서 접속 확인
- [ ] Google Search Console에서 sitemap 재제출

---

## 🐛 문제 해결

### sitemap.xml이 여전히 404
```bash
# 1. 파일 존재 확인
ls -la /var/www/bktheater/sitemap.xml

# 2. 파일 권한 확인
sudo chmod 644 /var/www/bktheater/sitemap.xml
sudo chown www-data:www-data /var/www/bktheater/sitemap.xml

# 3. Nginx 에러 로그 확인
sudo tail -f /var/log/nginx/error.log

# 4. Nginx 설정 테스트
sudo nginx -t
```

### PM2로 서빙 시 404
```bash
# 1. PM2 로그 확인
pm2 logs frontend

# 2. PM2 앱이 올바른 디렉토리를 서빙하는지 확인
pm2 describe frontend

# 3. serve가 올바른 폴더를 가리키는지 확인
```

---

## 📞 다음 단계

어떤 방법을 선택하시겠습니까?

1. **Nginx 직접 서빙** (추천 - 가장 빠름)
2. **PM2 + serve 사용** (현재 구조 유지)
3. **빌드 설정 수정** (dist 폴더로 출력)

선택하신 방법에 따라 구체적인 명령어를 안내해드리겠습니다!
