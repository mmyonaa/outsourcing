import AppConfig from '@/constants';
import { loadLocalData, saveLocalData } from '@/utils/common-util';
import { nextTick } from 'vue';
import { I18n, I18nOptions, createI18n } from 'vue-i18n';
import en from './locale/en.json';
import ko from './locale/ko.json';

// 사용 가능 언어
export const SUPPORT_LOCALES = ['ko', 'en'];

// i18n 객체 생성
export function setupI18n(options: I18nOptions = { locale: 'ko' }): I18n<any, any, any, any> {
  const i18n = createI18n(options);
  setI18nLanguage(i18n, options.locale || 'ko');
  return i18n;
}

// html문서에 언어 추가
export function setI18nLanguage(i18n: I18n<any, any, any, any>, locale: string): void {
  i18n.global.locale = locale;

  if (typeof Window === 'undefined') return;
  const el = window.document.querySelector('html') as HTMLElement;
  el.setAttribute('lang', locale);
}

// locale별 json 파일 불러오기
export async function loadLocaleMessages(i18n: I18n<any, any, any, any>, locale: string): Promise<void> {
  const messages = await import(`./locale/${locale}.json`);

  i18n.global.setLocaleMessage(locale, messages.default);

  return nextTick();
}

export const setLanguage = (lang: string) => {
  if (loadLocalData(AppConfig.KEYS.LANG)) {
    return;
  }
  switch (lang) {
    case 'ko':
    case 'ko-KR':
      saveLocalData(AppConfig.KEYS.LANG, 'ko');
      break;
    case 'en-US':
      saveLocalData(AppConfig.KEYS.LANG, 'en');
      break;
    default:
      saveLocalData(AppConfig.KEYS.LANG, 'en');
      break;
  }
};

export { ko, en };
