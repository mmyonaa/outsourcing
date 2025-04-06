import { KEYS } from './constants-keys';

export const APP_ENV_TYPE = {
  DEV: 'development',
  STAGE: 'staging',
  PROD: 'production',
};

const AppConfig = {
  ENV: APP_ENV_TYPE.STAGE,
  API_SERVER: 'https://community-api-dev.apoc.day/api',
  APOC_API_SERVER: 'https://api.apoc.day/api/v2',
  FRONT_HOST: ' https://comm.apoc.day',
  FILE_SERVER: 'https://apoc-community.s3.ap-northeast-2.amazonaws.com/',
  KEYS,
};
export default AppConfig;
