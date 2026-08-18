import { KEYS } from './constants-keys';

export const APP_ENV_TYPE = {
  DEV: 'development',
  STAGE: 'staging',
  PROD: 'production',
};

// 첨부파일 허용 확장자 — 백엔드(upload.util.ts)의 화이트리스트와 동일하게 유지할 것.
// 서버에서도 거부하지만, 선택 즉시 안내하기 위해 클라이언트에서도 검사한다.
export const ALLOWED_UPLOAD_FILE_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif',
  'pdf', 'hwp', 'hwpx', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'txt',
];

const AppConfig = {
  ENV: import.meta.env.PROD ? APP_ENV_TYPE.PROD : APP_ENV_TYPE.DEV,
  // 로컬 개발에서 실서버 DB를 치지 않도록 .env 의 VITE_API_SERVER 로 재정의할 수 있다
  API_SERVER: import.meta.env.VITE_API_SERVER || 'https://bktheater.com/api',
  KEYS,
};
export default AppConfig;
