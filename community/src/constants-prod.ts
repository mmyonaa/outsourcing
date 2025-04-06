import { KEYS } from './constants-keys';

export const APP_ENV_TYPE = {
  DEV: 'development',
  STAGE: 'staging',
  PROD: 'production',
};

const AppConfig = {
  ENV: APP_ENV_TYPE.PROD,
  FRONT_HOST: 'https://comm.apoc.day',
  API_SERVER: 'https://comm-api.apoc.day/api',
  APOC_API_SERVER: 'https://api.apoc.day/api/v2',
  SSO_URL: 'https://sso-dev.apoc.day',
  SSO_API_SERVER: 'https://sso-dev.apoc.day',
  CHAT_URL: 'https://chat.apoc.day',
  AUTHOR_HOST: 'https://author.apoc.day/#/',
  FILE_SERVER: 'https://apoc-community.s3.ap-northeast-2.amazonaws.com/',
  TRACKER_URL: 'https://cdn.apoc.day/js/tracker-dev.js?20240415',
  KEYS,
};
export default AppConfig;
