import { KEYS } from './constants-keys';

export const APP_ENV_TYPE = {
  DEV: 'development',
  STAGE: 'staging',
  PROD: 'production',
};

const AppConfig = {
  ENV: APP_ENV_TYPE.DEV,
  // API_SERVER: 'http://localhost:3301/api',
  API_SERVER: 'https://community-api-dev.apoc.day/api',
  // API_SERVER: 'https://comm-api.apoc.day/api',
  APOC_API_SERVER: 'https://api.apoc.day/api/v2',
  SSO_URL: 'https://sso-dev.apoc.day',
  SSO_API_SERVER: 'https://sso-dev.apoc.day',
  FRONT_HOST: 'http://localhost:4000',
  FILE_SERVER: 'https://apoc-community.s3.ap-northeast-2.amazonaws.com/',
  TRACKER_URL: 'https://cdn.apoc.day/js/tracker-dev.js?20240415',
  KEYS,
};
export default AppConfig;
