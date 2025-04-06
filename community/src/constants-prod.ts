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
  AUTHOR_HOST: 'https://author.apoc.day/#/',
  FILE_SERVER: 'https://apoc-community.s3.ap-northeast-2.amazonaws.com/',
  KEYS,
};
export default AppConfig;
