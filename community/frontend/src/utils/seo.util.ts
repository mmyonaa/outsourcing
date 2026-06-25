/**
 * SEO 유틸리티 함수
 */

export interface MetaTagsConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

/**
 * 페이지별 메타 태그를 동적으로 설정
 */
export const setMetaTags = (config: MetaTagsConfig) => {
  if (typeof window === 'undefined') return;

  const {
    title = '보광극장 | 서울 용산구 공연장 대관 및 공연 안내',
    description = '보광극장은 서울 용산구에 위치한 공연장입니다. 연극, 뮤지컬, 콘서트 등 다양한 공연과 대관 서비스를 제공합니다.',
    keywords = '보광, 보광극장, 보광 극장, 보광극장 대관, 보광 극장 대관, 보광 극장 공연',
    ogTitle = title,
    ogDescription = description,
    ogImage = 'https://www.bktheater.com/assets/og-image.jpg',
    ogUrl = window.location.href,
    canonical = window.location.href,
  } = config;

  // Title 설정
  document.title = title;

  // Meta 태그 설정 헬퍼 함수
  const setMetaTag = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  };

  // 기본 메타 태그
  setMetaTag('description', description);
  setMetaTag('keywords', keywords);

  // Open Graph 태그
  setMetaTag('og:title', ogTitle, true);
  setMetaTag('og:description', ogDescription, true);
  setMetaTag('og:image', ogImage, true);
  setMetaTag('og:url', ogUrl, true);

  // Twitter 카드 태그
  setMetaTag('twitter:title', ogTitle);
  setMetaTag('twitter:description', ogDescription);
  setMetaTag('twitter:image', ogImage);

  // Canonical URL 설정
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', canonical);
};

/**
 * HTML 문자열에서 태그를 제거하고 메타 description 용으로 길이를 제한한다.
 */
export const toPlainText = (html: string | undefined, maxLength = 160): string => {
  if (!html) return '';
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}…` : text;
};

/**
 * JSON-LD 구조화 데이터를 head에 삽입하거나 교체한다.
 * data-seo 속성으로 식별하여 페이지 이동 시 갱신/제거할 수 있다.
 */
export const setJsonLd = (id: string, data: Record<string, unknown>) => {
  if (typeof document === 'undefined') return;
  const selector = `script[type="application/ld+json"][data-seo="${id}"]`;
  let script = document.querySelector(selector) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

/**
 * setJsonLd로 삽입한 구조화 데이터를 제거한다. (상세페이지 이탈 시 stale 방지)
 */
export const removeJsonLd = (id: string) => {
  if (typeof document === 'undefined') return;
  const script = document.querySelector(
    `script[type="application/ld+json"][data-seo="${id}"]`,
  );
  if (script) script.remove();
};

/**
 * 페이지별 SEO 설정
 */
export const pageSeoConfig: Record<string, MetaTagsConfig> = {
  home: {
    title: '보광극장 | 서울 용산구 공연장 대관 및 공연 안내',
    description: '보광극장은 서울 용산구에 위치한 공연장입니다. 연극, 뮤지컬, 콘서트 등 다양한 공연과 대관 서비스를 제공합니다.',
    keywords: '보광, 보광극장, 보광 극장, 보광극장 대관, 보광 극장 대관, 보광 극장 공연, 용산 공연장, 서울 공연장',
  },
  introduce: {
    title: '극장 소개 | 보광극장',
    description: '보광극장의 역사와 시설을 소개합니다. 서울 용산구에 위치한 문화 공간으로 다양한 공연을 선보입니다.',
    keywords: '보광극장 소개, 보광 극장 소개, 보광극장 시설, 용산 극장',
  },
  introduceOrg: {
    title: '단체 소개 | 보광극장',
    description: '보광극장 운영 단체를 소개합니다.',
    keywords: '보광극장 단체, 보광 극장 단체, 극장 운영',
  },
  introduceRoute: {
    title: '오시는 길 | 보광극장',
    description: '보광극장 찾아오시는 길 안내. 서울 용산구에 위치한 보광극장 주소, 교통편, 주차 정보를 확인하세요.',
    keywords: '보광극장 오시는길, 보광 극장 위치, 보광극장 주소, 보광극장 주차, 용산 극장',
  },
  performance: {
    title: '역대 공연 | 보광극장',
    description: '보광극장에서 진행된 역대 공연 목록을 확인하세요. 연극, 뮤지컬, 콘서트 등 다양한 공연 정보를 제공합니다.',
    keywords: '보광극장 공연, 보광 극장 공연, 보광극장 역대 공연, 용산 공연, 연극, 뮤지컬',
  },
  performanceNext: {
    title: '예정 공연 | 보광극장',
    description: '보광극장의 예정된 공연 일정을 확인하세요. 최신 공연 정보와 티켓 예매 안내를 제공합니다.',
    keywords: '보광극장 예정 공연, 보광 극장 공연 일정, 보광극장 티켓, 공연 예매',
  },
  rental: {
    title: '극장 대관 | 보광극장',
    description: '보광극장 대관 안내. 공연장 대관을 원하시는 분들을 위한 상세 정보와 시설 안내를 제공합니다.',
    keywords: '보광극장 대관, 보광 극장 대관, 공연장 대관, 극장 대관, 용산 극장 대관, 대관 안내',
  },
  rentalInfo: {
    title: '대관 안내 | 보광극장',
    description: '보광극장 대관 절차, 요금, 이용 안내를 확인하세요.',
    keywords: '보광극장 대관 안내, 보광 극장 대관 요금, 극장 대관 절차',
  },
  rentalSchedule: {
    title: '대관 스케줄 | 보광극장',
    description: '보광극장 대관 가능 일정을 확인하세요. 실시간 예약 현황과 스케줄을 제공합니다.',
    keywords: '보광극장 대관 스케줄, 보광 극장 예약, 대관 일정',
  },
  notice: {
    title: '공지사항 | 보광극장',
    description: '보광극장의 최신 소식과 공지사항을 확인하세요.',
    keywords: '보광극장 공지사항, 보광 극장 소식, 공연장 공지',
  },
  news: {
    title: '보도자료 | 보광극장',
    description: '보광극장 관련 보도자료와 언론 보도 소식을 확인하세요.',
    keywords: '보광극장 보도자료, 보광 극장 언론, 공연장 뉴스',
  },
};
