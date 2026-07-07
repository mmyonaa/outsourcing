import { KEYS } from './constants-keys';

export const APP_ENV_TYPE = {
  DEV: 'development',
  STAGE: 'staging',
  PROD: 'production',
};

const AppConfig = {
  ENV: APP_ENV_TYPE.DEV,
  API_SERVER: "https://bktheater.com/api",
  FRONT_HOST: 'http://localhost:4000',
  KEYS,
};
export default AppConfig;
