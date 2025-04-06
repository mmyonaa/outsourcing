import type { BoardEntityDto } from '@/api/dto/board.dto';
import AppConfig from '@/constants';
import type { CategoryType } from '@/types';
import { SUB_TAB_TYPE } from '@/types';
import lzString from 'lz-string';
import { useRoute } from 'vue-router';

export enum MobileOS {
  ANDROID = 'android',
  IOS = 'ios',
  OTHER = 'other',
}

export function getUuid(): string {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = ((dt + Math.random() * 16) % 16) | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid.replace(/-/gi, '').toLowerCase();
}

export const getMobileOS = (): MobileOS => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    return MobileOS.ANDROID;
  } else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return MobileOS.IOS;
  }
  return MobileOS.OTHER;
};

export function saveLocalData(key: string, val: string): void {
  if (typeof window === 'undefined') return;
  const storage = window.localStorage;
  if (storage) {
    try {
      storage.setItem(key, lzString.compressToUTF16(val));
    } catch (e) {
      console.error('Storage Full ... clean old data...');
      for (const k in storage) {
        if (k.indexOf('DATA_MESSAGE_DETAIL_') > -1) {
          storage.removeItem(k);
        }
      }
      storage.setItem(key, lzString.compressToUTF16(val));
    }
  }
}

export function loadLocalData(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const storage = window.localStorage;
  if (storage) {
    const keyValue = storage.getItem(key);
    if (keyValue) return lzString.decompressFromUTF16(keyValue);
  }
  return null;
}

export function removeLocalData(key: string): void {
  if (typeof window === 'undefined') return;
  const storage = window.localStorage;
  if (storage) {
    storage.removeItem(key);
  }
}

/**
 * targetEntity 에 포함된 key에 value 적용
 * @param targetEntity
 * @param obj
 */
export const setEntityParameters = (targetEntity: any, obj: any) => {
  const keyList = Object.keys(targetEntity);
  for (const key of keyList) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      targetEntity[key] = obj[key];
    }
  }
};

// 쿼리 가져오기
export const getQueryString = (query: string) => {
  const route = useRoute();
  if (Object.prototype.hasOwnProperty.call(route.query, query)) {
    return route.query[query as string] as string;
  } else {
    return;
  }
};

// HTML Entity 값을 원래 입력값으로 변경
export const decodeHTMLEntities = (str: string): string => {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
};

// 게시판 카체고리 가져오기
// export const getBoardCategory = (board: BoardEntityDto) => {
//   let tagCode: string | undefined;
//   let subTabCode: string | undefined;
//   let mainTabCode: string | undefined;
//   let mainTab: CategoryInterface | undefined;
//   let subTab: CategorySubInterface | undefined;
//
//   if (!board || !board.category) return;
//   board.category?.forEach((item: CategoryType) => {
//     switch (item.categoryTypeCode) {
//       case 'TAG':
//         tagCode = item.categoryCode;
//         break;
//       case 'SUB_TAB':
//         subTabCode = item.categoryCode;
//         break;
//       case 'MAIN_TAB':
//         mainTabCode = item.categoryCode;
//         break;
//     }
//   });
//   const mainCategory = CATEGORY_INFO.find(category => category.typeCode === mainTabCode);
//   if (mainCategory) {
//     mainTab = mainCategory;
//     const subItem = mainCategory.subItems?.find(subItem => subItem.typeCode === subTabCode);
//     if (subItem) {
//       subTab = subItem;
//     }
//   }
//   return {
//     tag: tagCode,
//     subTab: { code: subTabCode, type: subTab?.type, title: subTab?.title },
//     mainTab: { code: mainTabCode, type: mainTab?.type, title: mainTab?.title },
//   };
// };
export const getBoardCategoryV2 = (board: BoardEntityDto) => {
  let mainTab: CategoryType | undefined;
  let subTab: CategoryType | undefined;
  const tag: CategoryType[] = [];
  if (!board || !board.category) return;
  board.category?.forEach((item: CategoryType) => {
    switch (item.categoryTypeCode) {
      case 'TAG':
        tag.push(item);
        break;
      case 'SUB_TAB':
        subTab = item;
        break;
      case 'MAIN_TAB':
        mainTab = item;
        break;
    }
  });
  return { mainTab, subTab, tag };
};

export const getBoardSrcImg = (boardName: string) => {
  // console.log('board', boardName);
  switch (boardName) {
    case SUB_TAB_TYPE.NOW:
      return '/assets/images/board/icon/now-apoc.webp';
    case SUB_TAB_TYPE.INTERVIEW:
      return '/assets/images/board/icon/interview.webp';
    case SUB_TAB_TYPE.NEWS_ROOM:
      return '/assets/images/board/icon/news.webp';
    case SUB_TAB_TYPE.RELEASE:
      return '/assets/images/board/icon/release.webp';

    case SUB_TAB_TYPE.USE_PLAY:
      return '/assets/images/board/icon/use-play.webp';
    case SUB_TAB_TYPE.USE_ASSET:
      return '/assets/images/board/icon/use-asset.webp';
    case SUB_TAB_TYPE.USE_STUDIO:
      return '/assets/images/board/icon/use-studio.webp';
    case SUB_TAB_TYPE.TUTORIAL:
      return '/assets/images/board/icon/tutorial.webp';

    case SUB_TAB_TYPE.TIPS:
      return '/assets/images/board/icon/tips.webp';
    case SUB_TAB_TYPE.FREE:
      return '/assets/images/board/icon/free.webp';
    case SUB_TAB_TYPE.FUNCTION:
      return '/assets/images/board/icon/function.webp';

    case SUB_TAB_TYPE.NOTICE:
      return '/assets/images/board/icon/notice.webp';
    case SUB_TAB_TYPE.EVENT:
      return '/assets/images/board/icon/event.webp';

    default:
      return '/assets/images/common/default-img.webp';
  }
};

// 스크롤 비활성화
export function scrollDisable() {
  window.addEventListener('scroll', preventDefault, { passive: false });
  window.addEventListener('touchmove', preventDefault, { passive: false });
  window.addEventListener('mousewheel', preventDefault, { passive: false });
}

//스크롤 활성화
export function scrollAble() {
  window.removeEventListener('scroll', preventDefault);
  window.removeEventListener('touchmove', preventDefault);
  window.removeEventListener('mousewheel', preventDefault);
}
function preventDefault(e: Event) {
  e.preventDefault();
}

export const convertSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const lang = loadLocalData(AppConfig.KEYS.LANG);

  let result = '';

  if (minutes > 0) {
    if (lang === 'ko') {
      result += `${minutes}분 `;
    } else {
      result += `${minutes}minutes `;
    }
  }

  if (remainingSeconds > 0 || minutes === 0) {
    if (lang === 'ko') {
      result += `${remainingSeconds}초`;
    } else {
      result += `${remainingSeconds}seconds`;
    }
  }

  return result.trim();
};

export const ssoLogin = () => {

};

/**
 * @comment HTML을 TEXT로 변환
 */
export const htmlToText = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc.body.textContent || '';
};

/**
 * @comment 이미지만 가져올거양!
 */
export const getFirstImageSrc = (htmlString: string | undefined) => {
  if (htmlString === undefined) return undefined;
  // HTML 문자열을 파싱하기 위해 DOMParser 사용
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // 첫 번째 이미지 태그를 찾음
  const firstImg = doc.querySelector('img');

  // 이미지 태그가 있다면 그 src 속성을 반환
  if (firstImg) {
    const result = firstImg.getAttribute('src');
    return typeof result === 'string' ? result : undefined;
  }

  // 이미지 태그가 없을 경우 null 반환
  return undefined;
};

/**
 * @comment SeoMeta 설정
 */
export const setSeoMeta = (title: string | undefined, description: string | undefined) => {
  // SEO META 변경
  const seoTitle = document.querySelector('title');
  if (seoTitle instanceof HTMLTitleElement) {
    seoTitle.textContent = title || '';
  }

  const seoMetaDescription = document.querySelector('meta[name="description"]');
  const descriptionMaxLength = 80; // 일반적으로 한글은 80자를 넘지 않는게 좋다고 합니다!
  const parseBody = htmlToText(description || '');
  if (seoMetaDescription instanceof HTMLMetaElement) {
    if (!(description && parseBody.length > descriptionMaxLength)) {
      return;
    }
    seoMetaDescription.setAttribute('content', parseBody.substring(0, descriptionMaxLength) + '...' || '');
  }
};

/**
 * @comment OpenGraph 설정
 * 관련으로 질문 드리기
 */
export const setOpenGraph = (title: string | undefined, imgSrc: string | undefined) => {
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogImage = document.querySelector('meta[property="og:image"]');

  if (ogTitle instanceof HTMLElement) {
    ogTitle.setAttribute('content', title || '');
  }

  if (ogImage instanceof HTMLElement) {
    ogImage.setAttribute('content', imgSrc || '');
  }
};
