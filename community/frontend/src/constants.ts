import { KEYS } from './constants-keys';

export const APP_ENV_TYPE = {
  DEV: 'development',
  STAGE: 'staging',
  PROD: 'production',
};

const AppConfig = {
  ENV: APP_ENV_TYPE.DEV,
  API_SERVER: 'http://bktheater.com:3000/api',
  // API_SERVER: 'http://localhost:3000',
  // API_SERVER: 'http://ec2-13-125-101-232.ap-northeast-2.compute.amazonaws.com:3000',
  FRONT_HOST: 'http://localhost:4000',
  FILE_SERVER: 'https://apoc-community.s3.ap-northeast-2.amazonaws.com/',
  KEYS,
};
export default AppConfig;
