/**
 * vite-ssg 프리렌더용 SEO 헬퍼.
 *
 * 이 앱의 상세/목록 뷰는 데이터를 onMounted(클라이언트 전용)에서 가져오고
 * setMetaTags/setJsonLd로 document를 직접 조작한다. 따라서 프리렌더된 정적 HTML에는
 * 페이지별 title/description/canonical/JSON-LD가 담기지 않아 모든 URL이 홈페이지와
 * 동일한 메타로 보인다(Search Console "발견됨/크롤링됨 - 색인 생성 안 됨"의 직접 원인).
 *
 * 여기서는 빌드 시점에:
 *  1) API로 상세 URL 목록을 받아 프리렌더 대상 라우트에 추가하고(includedRoutes)
 *  2) 각 페이지의 <head>에 페이지별 SEO 태그를 주입한다(onPageRendered).
 * 주입 값은 클라이언트의 setMetaTags/setJsonLd와 동일하므로, 하이드레이션 시
 * 기존 태그를 갱신할 뿐 중복이 생기지 않는다.
 *
 * 상세 데이터 수집 로직은 scripts/generate-sitemap.mjs 와 동일한 엔드포인트를 사용한다.
 */
import { toPlainText, extractEventDates, pageSeoConfig } from '../utils/seo.util';

const SITE_URL = (process.env.SITE_URL || 'https://bktheater.com').replace(/\/+$/, '');
const API_BASE = (process.env.SITEMAP_API_BASE || 'https://bktheater.com/api').replace(/\/+$/, '');
const OG_IMAGE_DEFAULT = 'https://bktheater.com/assets/og-image.jpg';
const PUBLISHER_LOGO = 'https://www.bktheater.com/assets/og-image.jpg';

interface PageSeo {
  title: string;
  description: string;
  image?: string;
  canonical: string;
  jsonLd?: Record<string, unknown> | null;
}

// 경로(path) -> 주입할 SEO. includedRoutes()에서 채워지고 injectSeo()에서 읽는다.
const seoByPath = new Map<string, PageSeo>();

// 정적 라우트 경로 -> pageSeoConfig 키
const STATIC_ROUTE_SEO: Record<string, string> = {
  '/': 'home',
  '/introduce': 'introduce',
  '/introduce/org': 'introduceOrg',
  '/introduce/route': 'introduceRoute',
  '/performance': 'performance',
  '/performance/next': 'performanceNext',
  '/rental': 'rental',
  '/rental/info': 'rentalInfo',
  '/rental/schedule': 'rentalSchedule',
  '/notice': 'notice',
  '/news': 'news',
};

const canonicalFor = (routePath: string): string => {
  const p = routePath === '/' ? '' : routePath.replace(/\/$/, '');
  return `${SITE_URL}${p}`;
};

interface ApiItem {
  perIdx?: string;
  boardIdx?: string;
  title?: string;
  body?: string;
  imgUrl?: string;
  titleSec?: string;
  titleThird?: string;
  regDt?: string;
  modDt?: string;
  author?: string;
}

async function fetchList(path: string, query: Record<string, string>): Promise<ApiItem[]> {
  const qs = new URLSearchParams({ ...query, page: '1', rows: '1000' });
  const res = await fetch(`${API_BASE}${path}?${qs.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  const json = (await res.json()) as { data?: ApiItem[] };
  return Array.isArray(json?.data) ? json.data : [];
}

// 공연(역대/예정): 기간이 파싱되는 경우에만 TheaterEvent JSON-LD를 넣는다
// (startDate 없는 Event는 Search Console 심각 오류가 되므로).
function buildPerfoSeo(it: ApiItem, routePath: string): PageSeo {
  const title = `${it.title} | 보광극장`;
  const description = toPlainText(it.body);
  const image = it.imgUrl || undefined;
  const canonical = canonicalFor(routePath);
  const dates = extractEventDates([it.titleSec, it.titleThird, it.body]);
  const jsonLd = dates
    ? {
        '@context': 'https://schema.org',
        '@type': 'TheaterEvent',
        name: it.title,
        description,
        ...(image ? { image } : {}),
        startDate: dates.startDate,
        endDate: dates.endDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'PerformingArtsTheater',
          name: '보광극장',
          address: {
            '@type': 'PostalAddress',
            addressLocality: '서울 용산구',
            addressCountry: 'KR',
          },
        },
        organizer: { '@type': 'Organization', name: '보광극장', url: SITE_URL },
        performer: { '@type': 'PerformingGroup', name: it.title },
        url: canonical,
      }
    : null;
  return { title, description, image, canonical, jsonLd };
}

// 공지/보도: NewsArticle JSON-LD
function buildBoardSeo(it: ApiItem, routePath: string): PageSeo {
  const title = `${it.title} | 보광극장`;
  const description = toPlainText(it.body);
  const canonical = canonicalFor(routePath);
  return {
    title,
    description,
    canonical,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: it.title,
      description,
      datePublished: it.regDt,
      dateModified: it.modDt,
      author: { '@type': 'Organization', name: it.author || '보광극장' },
      publisher: {
        '@type': 'Organization',
        name: '보광극장',
        logo: { '@type': 'ImageObject', url: PUBLISHER_LOGO },
      },
      mainEntityOfPage: canonical,
    },
  };
}

interface DetailSource {
  path: string;
  query: Record<string, string>;
  toPath: (it: ApiItem) => string | null;
  build: (it: ApiItem, routePath: string) => PageSeo;
}

const DETAIL_SOURCES: DetailSource[] = [
  {
    path: '/perfo/getperfoList',
    query: { perType: 'NORMAL' },
    toPath: it => (it.perIdx ? `/performance/${it.perIdx}` : null),
    build: buildPerfoSeo,
  },
  {
    path: '/perfo/getperfoList',
    query: { perType: 'NEXT' },
    toPath: it => (it.perIdx ? `/performance/next/${it.perIdx}` : null),
    build: buildPerfoSeo,
  },
  {
    path: '/board/getBoardList',
    query: { boardType: 'NORMAL', activeYn: 'Y' },
    toPath: it => (it.boardIdx ? `/notice/${it.boardIdx}` : null),
    build: buildBoardSeo,
  },
  {
    path: '/board/getBoardList',
    query: { boardType: 'NEWS', activeYn: 'Y' },
    toPath: it => (it.boardIdx ? `/news/${it.boardIdx}` : null),
    build: buildBoardSeo,
  },
];

/**
 * vite-ssg ssgOptions.includedRoutes 로 넘길 함수.
 * 정적 공개 라우트 + API에서 수집한 상세 라우트를 반환하고, 각 경로의 SEO를 미리 계산해 둔다.
 * API 수집이 실패하면 정적 라우트만 프리렌더한다(빌드는 중단하지 않음).
 */
export async function includedRoutes(paths: string[]): Promise<string[]> {
  // /admin·동적(:param)·옛 URL 리디렉션(/detail, 컴포넌트 없음)은 프리렌더에서 제외
  const staticRoutes = paths.filter(
    r => !r.startsWith('/admin') && !r.includes(':') && !r.endsWith('/detail'),
  );
  for (const r of staticRoutes) {
    const key = STATIC_ROUTE_SEO[r];
    const cfg = key ? pageSeoConfig[key] : undefined;
    seoByPath.set(r, {
      title: cfg?.title || '보광극장 | 서울 용산구 공연장 대관 및 공연 안내',
      description:
        cfg?.description ||
        '보광극장은 서울 용산구에 위치한 공연장입니다. 연극, 뮤지컬, 콘서트 등 다양한 공연과 대관 서비스를 제공합니다.',
      image: OG_IMAGE_DEFAULT,
      canonical: canonicalFor(r),
      jsonLd: null,
    });
  }

  const detailRoutes: string[] = [];
  try {
    for (const src of DETAIL_SOURCES) {
      const items = await fetchList(src.path, src.query);
      for (const it of items) {
        const p = src.toPath(it);
        if (!p) continue;
        detailRoutes.push(p);
        seoByPath.set(p, src.build(it, p));
      }
    }
    console.log(`[ssg-seo] 상세 라우트 ${detailRoutes.length}건을 프리렌더 대상에 추가`);
  } catch (err) {
    console.warn(
      `[ssg-seo] 상세 라우트 수집 실패 — 정적 라우트만 프리렌더합니다: ${(err as Error).message}`,
    );
  }

  return [...staticRoutes, ...detailRoutes];
}

// ---- HTML <head> 주입 유틸 ----

const escAttr = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escText = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function setTitle(html: string, title: string): string {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escText(title)}</title>`);
  }
  return html.replace(/<\/head>/i, `  <title>${escText(title)}</title>\n</head>`);
}

// name= 또는 property= 로 식별되는 meta 태그의 content 를 교체(없으면 삽입).
// content 속성이 식별 속성 앞/뒤 어디에 오든 처리한다.
function setMeta(html: string, attr: 'name' | 'property', key: string, content: string): string {
  const k = escRegex(key);
  const val = escAttr(content);
  const after = new RegExp(
    `(<meta[^>]*\\b${attr}=["']${k}["'][^>]*\\bcontent=["'])[^"']*(["'])`,
    'i',
  );
  if (after.test(html)) return html.replace(after, `$1${val}$2`);
  const before = new RegExp(
    `(<meta[^>]*\\bcontent=["'])[^"']*(["'][^>]*\\b${attr}=["']${k}["'])`,
    'i',
  );
  if (before.test(html)) return html.replace(before, `$1${val}$2`);
  return html.replace(/<\/head>/i, `  <meta ${attr}="${key}" content="${val}">\n</head>`);
}

function setCanonical(html: string, href: string): string {
  const tag = `<link rel="canonical" href="${escAttr(href)}">`;
  if (/<link[^>]*\brel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/<link[^>]*\brel=["']canonical["'][^>]*>/i, tag);
  }
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function injectJsonLd(html: string, data: Record<string, unknown>): string {
  // </script> 및 <, > 를 이스케이프해 스크립트 조기 종료/XSS를 방지
  const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
  const tag = `<script type="application/ld+json" data-seo="article">${json}</script>`;
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

/**
 * vite-ssg ssgOptions.onPageRendered 로 넘길 함수.
 * includedRoutes()에서 계산해 둔 SEO를 해당 경로의 프리렌더 HTML <head>에 주입한다.
 */
export function onPageRendered(route: string, html: string): string {
  const seo = seoByPath.get(route);
  if (!seo) return html;

  let out = setTitle(html, seo.title);
  out = setMeta(out, 'name', 'description', seo.description);
  out = setMeta(out, 'property', 'og:title', seo.title);
  out = setMeta(out, 'property', 'og:description', seo.description);
  out = setMeta(out, 'property', 'og:url', seo.canonical);
  out = setMeta(out, 'name', 'twitter:title', seo.title);
  out = setMeta(out, 'name', 'twitter:description', seo.description);
  if (seo.image) {
    out = setMeta(out, 'property', 'og:image', seo.image);
    out = setMeta(out, 'name', 'twitter:image', seo.image);
  }
  out = setCanonical(out, seo.canonical);
  if (seo.jsonLd) out = injectJsonLd(out, seo.jsonLd);
  return out;
}
