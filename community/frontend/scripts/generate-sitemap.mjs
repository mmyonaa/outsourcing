// 빌드 타임 sitemap.xml 생성 스크립트
//
// 정적 페이지 + DB의 개별 글/공연 URL을 모두 포함한 sitemap을 생성한다.
// API가 빌드 시점에 닿지 않아도(네트워크 실패) 정적 페이지만으로 sitemap을 쓰고 정상 종료한다.
//
// 환경변수:
//   SITE_URL          기본 'https://bktheater.com'        (사이트 공개 도메인)
//   SITEMAP_API_BASE  기본 'https://bktheater.com/api'    (백엔드 API base)
//
// 실행: node scripts/generate-sitemap.mjs   (build 스크립트에서 build-ssg 전에 호출)

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../public/sitemap.xml');

const SITE_URL = (process.env.SITE_URL || 'https://bktheater.com').replace(/\/$/, '');
const API_BASE = (process.env.SITEMAP_API_BASE || 'https://bktheater.com/api').replace(/\/$/, '');

const MAX_ROWS = 100; // 백엔드 페이지네이션 상한과 동일
const MAX_PAGES = 50; // 안전 상한 (최대 5000건)

const today = new Date().toISOString().slice(0, 10);

// 정적 페이지 (loc는 경로만, priority/changefreq 지정)
const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/introduce', changefreq: 'monthly', priority: '0.8' },
  { path: '/introduce/org', changefreq: 'monthly', priority: '0.7' },
  { path: '/introduce/route', changefreq: 'monthly', priority: '0.7' },
  { path: '/performance', changefreq: 'weekly', priority: '0.9' },
  { path: '/performance/next', changefreq: 'weekly', priority: '0.9' },
  { path: '/rental', changefreq: 'monthly', priority: '0.8' },
  { path: '/rental/info', changefreq: 'monthly', priority: '0.8' },
  { path: '/rental/schedule', changefreq: 'daily', priority: '0.8' },
  { path: '/notice', changefreq: 'weekly', priority: '0.7' },
  { path: '/news', changefreq: 'weekly', priority: '0.7' },
];

const escapeXml = (s) =>
  String(s).replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c],
  );

const toLastmod = (item) => {
  const raw = item?.modDt || item?.regDt;
  if (!raw) return today;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? today : d.toISOString().slice(0, 10);
};

// 페이지네이션을 돌며 한 종류의 목록 전체를 가져온다.
async function fetchAll(path, baseQuery) {
  const all = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const qs = new URLSearchParams({ ...baseQuery, page: String(page), rows: String(MAX_ROWS) });
    const url = `${API_BASE}${path}?${qs.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : [];
    all.push(...data);
    if (data.length < MAX_ROWS) break;
  }
  return all;
}

// 동적 소스 정의: API 결과를 상세 URL로 변환
const DYNAMIC_SOURCES = [
  {
    name: '공지사항',
    path: '/board/getBoardList',
    query: { boardType: 'NORMAL', activeYn: 'Y' },
    toUrl: (it) => (it.boardIdx ? `/notice/${it.boardIdx}` : null),
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    name: '보도자료',
    path: '/board/getBoardList',
    query: { boardType: 'NEWS', activeYn: 'Y' },
    toUrl: (it) => (it.boardIdx ? `/news/${it.boardIdx}` : null),
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    name: '역대 공연',
    path: '/perfo/getperfoList',
    query: { perType: 'NORMAL' },
    toUrl: (it) => (it.perIdx ? `/performance/${it.perIdx}` : null),
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    name: '예정 공연',
    path: '/perfo/getperfoList',
    query: { perType: 'NEXT' },
    toUrl: (it) => (it.perIdx ? `/performance/next/${it.perIdx}` : null),
    changefreq: 'weekly',
    priority: '0.8',
  },
];

const urlEntry = ({ path, lastmod, changefreq, priority }) =>
  `  <url>\n` +
  `    <loc>${escapeXml(SITE_URL + path)}</loc>\n` +
  `    <lastmod>${lastmod}</lastmod>\n` +
  `    <changefreq>${changefreq}</changefreq>\n` +
  `    <priority>${priority}</priority>\n` +
  `  </url>`;

async function main() {
  const entries = STATIC_ROUTES.map((r) => urlEntry({ ...r, lastmod: today }));

  let dynamicCount = 0;
  for (const src of DYNAMIC_SOURCES) {
    try {
      const items = await fetchAll(src.path, src.query);
      for (const it of items) {
        const url = src.toUrl(it);
        if (!url) continue;
        entries.push(
          urlEntry({ path: url, lastmod: toLastmod(it), changefreq: src.changefreq, priority: src.priority }),
        );
        dynamicCount++;
      }
      console.log(`[sitemap] ${src.name}: ${items.length}건`);
    } catch (e) {
      console.warn(`[sitemap] ${src.name} 수집 실패 (정적 페이지만 유지): ${e.message}`);
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entries.join('\n')}\n` +
    `</urlset>\n`;

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, xml, 'utf-8');
  console.log(`[sitemap] 생성 완료: ${STATIC_ROUTES.length} 정적 + ${dynamicCount} 동적 = ${STATIC_ROUTES.length + dynamicCount} URL -> ${OUTPUT_PATH}`);
}

main().catch((e) => {
  // 예기치 못한 오류라도 빌드를 막지 않는다.
  console.error('[sitemap] 생성 중 오류:', e);
  process.exit(0);
});
