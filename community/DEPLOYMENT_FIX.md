현재 서버 상황을 모르므로, 가장 간단한 임시 해결책:
서버에서 직접 파일 생성

# 서버 SSH 접속 후

# sitemap.xml 생성

sudo nano /var/www/html/sitemap.xml

# 또는 Nginx root 디렉토리

내용 붙여넣기:

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://bktheater.com/</loc>
    <lastmod>2025-01-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>http://bktheater.com/introduce</loc>
    <lastmod>2025-01-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>http://bktheater.com/performance</loc>
    <lastmod>2025-01-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>http://bktheater.com/rental</loc>
    <lastmod>2025-01-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>http://bktheater.com/notice</loc>
    <lastmod>2025-01-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
robots.txt도 생성:
sudo nano /var/www/html/robots.txt
내용:
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Sitemap: http://bktheater.com/sitemap.xml
권한 설정:
sudo chmod 644 /var/www/html/sitemap.xml
sudo chmod 644 /var/www/html/robots.txt
테스트:
curl http://bktheater.com/sitemap.xml
자세한 배포 가이드는 DEPLOYMENT_FIX.md를 참고하세요! 현재 서버 구조(어떻게 배포되어 있는지)를 알려주시면 더 정확한 해결책을 제시해드리겠습니다.
