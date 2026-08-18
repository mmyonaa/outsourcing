import { KEYS } from './constants-keys';

export const APP_ENV_TYPE = {
  DEV: 'development',
  STAGE: 'staging',
  PROD: 'production',
};

const AppConfig = {
  ENV: import.meta.env.PROD ? APP_ENV_TYPE.PROD : APP_ENV_TYPE.DEV,
  // 로컬 개발에서 실서버 DB를 치지 않도록 .env 의 VITE_API_SERVER 로 재정의할 수 있다
  API_SERVER: import.meta.env.VITE_API_SERVER || 'https://bktheater.com/api',
  KEYS,
};
export default AppConfig;
