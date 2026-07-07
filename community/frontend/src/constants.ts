import { KEYS } from './constants-keys';

export const APP_ENV_TYPE = {
  DEV: 'development',
  STAGE: 'staging',
  PROD: 'production',
};

const AppConfig = {
  ENV: APP_ENV_TYPE.DEV,
  API_SERVER: "http://bktheater.com/api",
  FRONT_HOST: 'http://localhost:4000',
  FILE_SERVER: 'https://apoc-community.s3.ap-northeast-2.amazonaws.com/',
  KEYS,
};
export default AppConfig;
