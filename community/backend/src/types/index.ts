/**
 * response code
 */
export const RESULT_CODE = {
  SUCCESS: { code: 0, msg: 'RESULT_SUCCESS' },
  FAILED: { code: 99, msg: 'RESULT_FAILED' },
  BOARD_NOT_FOUND: { code: 98, msg: 'RESULT_BOARD_NOT_FOUND' },
  PERFO_NOT_FOUND: { code: 97, msg: 'RESULT_PERFO_NOT_FOUND' },
  INVALID_PARAMETER: { code: 96, msg: 'RESULT_INVALID_PARAM' },
  PASSWORD_NOT_MATCHED: { code: 95, msg: 'RESULT_PASSWORD_NOT_MATCHED' },
  PASSWORD_INCORRECT: { code: 94, msg: 'RESULT_PASSWORD_INCORRECT' },
  DELETED_CONTENT: { code: 93, msg: 'RESULT_DELETED_CONTENT' },
  NO_PERMISSION: { code: 91, msg: 'RESULT_NO_PERMISSION' },
  NEED_MORE_INFO: { code: 90, msg: 'NEED_MORE_INFO' },
  USER_EXIST: { code: 89, msg: 'USER_ALREADY_EXIST' },
  DB_ERROR: { code: 88, msg: 'RESULT_DB_ERROR' },
  AWS_ERROR: { code: 87, msg: 'RESULT_AWS_ERROR' },
  TOKEN_EXPIRED: { code: 86, msg: 'TOKEN_EXPIRED' },
  OUT_OF_STOCK: { code: 85, msg: 'OUT_OF_STOCK' },
  PRODUCT_NOT_FOUND: { code: 84, msg: 'PRODUCT_NOT_FOUND' },
  CART_NOT_FOUND: { code: 83, msg: 'CART_NOT_FOUND' },
  OUT_OF_POINT: { code: 82, msg: 'OUT_OF_POINT' },
  DUPLICATE_PRODUCT: { code: 81, msg: 'DUPLICATE_PRODUCT' }, // 카트에 담긴상품을 직접 구매하려는 경우
  MAIL_ERROR: { code: 80, msg: 'MAIL_ERROR' }, // 메일이 정상적으로 보내지지 않은 경우
  AUTH_CODE_NOT_FOUND: { code: 79, msg: 'AUTH_CODE_NOT_FOUND' }, // 유저 인증 정보가 존재하지 않는 경우
  OUT_OF_CART_STOCK: { code: 78, msg: 'OUT_OF_CART_STOCK' }, // 이미 카트에 담긴 상품의 경우
  PRODUCT_META_NOT_FOUND: { code: 77, msg: 'PRODUCT_META_NOT_FOUND' }, // 메타 정보가 존재하지 않는 경우
  CURRENCY_NOT_FOUND: { code: 76, msg: 'CURRENCY_NOT_FOUND' }, // 메타 정보가 존재하지 않는 경우
  PAYMENT_NOT_FOUND: { code: 75, msg: 'PAYMENT_NOT_FOUND' }, // 결제 정보가 존재하지 않는 경우
  EXTERNAL_PAYMENT_NOT_FOUND: { code: 74, msg: 'EXTERNAL_PAYMENT_NOT_FOUND' }, // 외부 결제 정보가 존재하지 않는 경우
  UPDATE_EXTERNAL_ORDER_FAILED: { code: 73, msg: 'EXTERNAL_PAYMENT_NOT_FOUND' }, // 외부 결제 정보 변경 실패
  UPDATE_PAYMENT_FAILED: { code: 72, msg: 'UPDATE_PAYMENT_FAILED' }, // 결제 정보 변경 실패
  MAIL_PARAM_ERROR: { code: 71, msg: 'MAIL_PARAM_ERROR' }, // 메일 파라미터가 비어있는 경우
  PAYMENT_CART_NOT_FOUND: { code: 70, msg: 'PAYMENT_CART_NOT_FOUND' }, // 결제 장바구니가 비어있는 경우
  ESIM_NOT_FOUND: { code: 69, msg: 'ESIM_NOT_FOUND' },
  ORDER_NOT_FOUND: { code: 68, msg: 'ORDER_NOT_FOUND' },
  DUPLICATED_IDX: { code: 67, msg: 'DUPLICATED_IDX' },
  DEVICE_NOT_FOUND: { code: 66, msg: 'DEVICE_NOT_FOUND' },
  DEVICE_DEPLOY_NOT_FOUND: { code: 65, msg: 'DEVICE_DEPLOY_NOT_FOUND' },
  DEVICE_PRODUCT_NOT_FOUND: { code: 64, msg: 'DEVICE_PRODUCT_NOT_FOUND' },
  DEVICE_STATE_CHANGE_DENIED: { code: 63, msg: 'DEVICE_STATE_CHANGE_DENIED' },
  DEVICE_STATE_UPDATE_FAILED: { code: 62, msg: 'DEVICE_STATE_UPDATE_FAILED' },
  DUPULICATE_DISPLAY_ORDER: { code: 61, msg: 'DUPULICATE_DISPLAY_ORDER' },
  UPDATE_PAID_ESIM_FAILED: { code: 65, msg: 'UPDATE_PAID_ESIM_FAILED' },

  // API result Code
  INVALID_API_KEY: { code: 999, msg: 'INVALID_API_KEY' }, // 유효하지 않은 키
  LIMITED_API_KEY: { code: 998, msg: 'LIMITED_API_KEY' }, // 제한 된 키 (신고당하거나 block 된경우)
  EXPIRED_API_KEY: { code: 997, msg: 'EXPIRED_API_KEY' }, // 만료된 키

  // DeployIdx result Code
  NO_DEPLOY_IDX: { code: 996, msg: 'NO_DEPLOY_IDX' }, // deployIdx 존재하지 않음
  DIFF_DEPLOY_IDX: { code: 996, msg: 'DIFF_DEPLOY_IDX' }, // deployIdx가 변경됨
};

/**
 * Result code interface
 */
export interface IResultCode {
  code: number;
  msg: string;
}

export enum EXT_DEVICE_TYPE {
  PRITNER = 'PRINTER',
}

export enum EXT_DEVICE_STATE {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  PRINTER_PAPER_OK = 'PRINTER_PAPER_OK',
  PRINTER_PAPER_WARN = 'PRINTER_PAPER_WARN',
  PRINTER_PAPER_OUT = 'PRINTER_PAPER_OUT',
}

/**
 * YN 상태값
 */
export enum STATE_YN {
  Y = 'Y',
  N = 'N',
}

/**
 * 로그 응답 상태 코드
 */
export enum LOG_RESULT_CODE {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

/**
 * 트랜잭션유형코드
 */
export enum TRANSACTION_TYPE_CODE {
  GET = 'GET',
  POST = 'POST',
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

/**
 * 서버 운영 환경 구분
 */
export enum ServerEnv {
  DEV = 'DEV',
  STAGING = 'STAGING',
  PROD = 'PRODUCTION',
}

/**
 * 날짜 형태
 */
export enum DATE_FORMAT {
  YYYYMMDD = 'YYYY-MM-DD',
}

/**
 * 사용자 사용 언어 종류
 */
export enum LOCALE {
  KO = 'ko',
  EN = 'en',
}

/**
 * 회원 구분
 */
export enum USER_TYPE {
  USER = 'USER', // 일반 구매 사용자
  COMPANY = 'COMPANY', // 영업업체
  ADMIN = 'ADMIN', // 일반 관리자
  MASTER = 'MASTER', // 최종관리자
}

/**
 * 회원 구분 비교 단계
 */
export enum USER_TYPE_INDEX {
  USER = '1', // 일반 구매 사용자
  COMPANY = '2', // 영업업체
  ADMIN = '3', // 일반 관리자
  MASTER = '4', // 최종관리자
}

/**
 * 회원 상태
 */
export enum STATE_USER {
  ACTIVE = 'ACTIVE', // 활동중
  WITHDRAW = 'WITHDRAW', // 탈퇴
}

/**
 * 나라 구분
 */
export enum COUNTRY {
  KR = 'KR',
  JP = 'JP',
  FR = 'FR',
  EN = 'EN',
}

/**
 * 파일 확장자
 */
export enum EXT_CODE {
  GLB = '.glb',
  GLTF = '.gltf',
  WEBP = '.webp',
  PNG = '.png',
  JPG = '.jpg',
  JPEG = '.jpeg',
  GIF = '.gif',
  MP3 = '.mp3',
  WAV = '.wav',
  MP4 = '.mp4',
  MOV = '.mov',
}

/**
 * 로그 타입 코드
 * common_code
 * code_type_code = 'log_type_code'
 */
export enum LOG_TYPE_CODE {
  USER_REG = 'USER_REG', // 사용자 등록
  USER_MOD = 'USER_MOD', // 사용자 수정
  USER_PWD_MOD = 'USER_PWD_MOD', // 사용자 비밀번호 수정
  USER_LIST = 'USER_LIST', // 사용자 리스트
  USER_DETAIL = 'USER_DETAIL', // 사용자 상세
  USER_PWD_CHECK = 'USER_PWD_CHECK', // 사용자 비밀번호 확인
  USER_LOGIN = 'USER_LOGIN', // 사용자 로그인
  USER_LOGOUT = 'USER_LOGOUT', // 사용자 로그아웃
  USER_TOKEN = 'USER_TOKEN', // 사용자 토큰
  CART = 'CART', // 장바구니
  REFUND = 'REFUND', // 환불
  COMMON_CODE = 'COMMON_CODE', // 공통 코드
  ATTACH_FILE = 'ATTACH_FILE', // 첨부파일
  PRODUCT = 'PRODUCT', // 상품
  POINT = 'POINT', // 포인트,

  // 외부 요청
  // 사이트 결제 (paygent)
  PAYGENT = 'PAYGENT',
  // 키오스크 결제 기기 (salo)
  KIOSK_SALO = 'KIOSK_SALO',
  // billion 상품 정보 return
  BILLION_NOTICE = 'BILLION_NOTICE',
  // billion 상품 요청
  BILLION_PRODUCT = 'BILLION_PRODUCT',
  // billion 상품 재요청
  BILLION_RESEND = 'BILLION_RESEND',
  // SK 상품 요청
  SK_PRODUCT = 'SK_PRODUCT',
  // SK 수량 체크
  SK_STOCK = 'SK_STOCK',

  // 외부 api 연동 - 주문
  API_ORDER = 'API_ORDER',
  // 외부 api 연동 - esim info 조회
  API_GET_ESIM = 'API_GET_ESIM',
}

export enum CURRENCY_CODE {
  // Australian dollar
  AUD = 'AUD',
  // Brazilian real
  BRL = 'BRL',
  // Canadian dollar
  CAD = 'CAD',
  // Chinese Renmenbi
  CNY = 'CNY',
  // Czech koruna
  CZK = 'CZK',
  // Danish krone
  DKK = 'DKK',
  // Euro
  EUR = 'EUR',
  // Hong Kong dollar
  HKD = 'HKD',
  // Hungarian forint
  HUF = 'HUF',
  //Israeli new shekel
  ILS = 'ILS',
  //Japanese yen
  JPY = 'JPY',
  // Malaysian ringgit
  MYR = 'MYR',
  // Mexican peso
  MXN = 'MXN',
  // New Taiwan dollar
  TWD = 'TWD',
  // New Zealand dollar
  NZD = 'NZD',
  // Norwegian krone
  NOK = 'NOK',
  // Philippine peso
  PHP = 'PHP',
  // Polish złoty
  PLN = 'PLN',
  // Pound sterling
  GBP = 'GBP',
  // Singapore dollar
  SGD = 'SGD',
  // Swedish krona
  SEK = 'SEK',
  // Swiss franc
  CHF = 'CHF',
  // Thai baht
  THB = 'THB',
  // United States dollar
  USD = 'USD',
}

/**
 * 결제 유형 => payment_info 테이블의 payment_type_code
 */
export enum PAYMENT_TYPE {
  // 일반 결제 (*use)
  NORMAL = 'NORMAL',
  // 키오스크 (*use)
  KIOSK = 'KIOSK',
  // 외부 업체 (*use)
  API_ORDER = 'API_ORDER',
  // 오프라인 주문 (*use)
  OFFLINE = 'OFFLINE'

  // // 페이젠트
  // PAYGENT = 'PAYGENT',
  // // 자동 결제
  // BILLING = 'BILLING',
  // // 브랜드 페이
  // BRANDPAY = 'BRANDPAY',
}

export enum PG_CODE_TYPE {
  // 키오스크 결제 기기
  AEGISE = 'AEGISE',
  // 페이젠트
  PAYGENT = 'PAYGENT',
}

/**
 * 서비스 구분명
 */
export enum SERVICE_CODE {
  ESIM = 'ESIM',
}

/**
 * 결제사 종류
 */
export enum PAYMENT_GATEWAY {
  // 페이젠트
  PAYGENT = 'paygent',
}

/**
 * 환불 상태
 */
export enum REFUND_STATE {
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

/**
 * 결제 상태
 */
export enum PAYMENT_STATE_TYPE {
  // 기본 상태 (최초 카트에 담겨진 상태)
  NONE = 'NONE',
  // 결제 대기중
  PAY_STANDBY = 'PAY_STANDBY',
  // 구매자 인증 완료
  PAY_APPROVED = 'PAY_APPROVED',
  // 결제 취소
  PAY_CANCEL = 'PAY_CANCEL',
  // 결제 실패
  PAY_FAILED = 'PAY_FAILED',
  // 결제 진행 중
  PAY_PROGRESS = 'PAY_PROGRESS',
  // 키오스크 결제 시작
  KIOSK_PAY_LOAD = 'KIOSK_PAY_LOAD',
  // 키오스크 결제 실패
  KIOSK_PAY_FAIL = 'KIOSK_PAY_FAIL',
  // 결제 완료
  PAY_COMPLETE = 'PAY_COMPLETE',
  // 환불 진행 중
  REFUND_PROGRESS = 'REFUND_PROGRESS',
  // 환불 완료
  REFUND_SUCCESS = 'REFUND_SUCCESS',
  // 정산 완료
  SETTLEMENT_COMPLETE = 'SETTLEMENT_COMPLETE',
  // 환불 정산 완료
  SETTLEMENT_REFUND_COMPLETE = 'SETTLEMENT_REFUND_COMPLETE',
  PAY_APPROVE = 'PAY_APPROVE',
}

/**
 * 승인 상태
 * */
export enum APPROVAL_TYPE {
  APPROVAL = 'APPROVAL',
  PENDING = 'PENDING',
}

/**
 * 상품 판매 타입
 * */
export enum PRODUCT_TYPE {
  NONE = 'NONE',
  API = 'API',
  SITE = 'SITE',
  KIOSK = 'KIOSK',
  OFFLINE = 'OFFLINE',
}

/**
 * 상품 등록 타입
 * */
export enum PRODUCT_INSERT_TYPE {
  // 연동
  LINK = 'LINK',
  // 등록
  REG = 'REG',
}

/**
 * 외부 연동 업체 타입
 * */
export enum PROVIDER_TYPE {
  // Billion Connect
  BILLION = 'BILLION',
  // SK Roaming
  SK = 'SK',
  // SK - KBOOKS(경인문고)
  SK_KBOOKS = 'SK_KBOOKS',
}

/**
 * 상품 판매 상태값
 * */
export enum PRODUCT_STATE {
  ACTIVE = 'ACTIVE', // 판매중
  DISABLED = 'DISABLED', // 판매중지
  END = 'END', // 판매종료 (자동)
  PENDING = 'PENDING', // 판매 대기(초기)
  ARCHIVE = 'ARCHIVE', // 외부 상품이 업데이트 되어 보관처리
}

/**
 * 업체 타입
 */
export enum COMPANY_TYPE {
  SOURCING = 'SOURCING',
  COMPANY = 'COMPANY',
}

/**
 * product meta - plan 타입
 */
export enum PLAN_TYPE {
  DAILY = 'DAILY',
  FIXED = 'FIXED',
}

/**
 * product meta - connection 타입
 */
export enum CONNECTION_TYPE {
  LOCAL = 'LOCAL',
  ROAMING = 'ROAMING',
  DUAL = 'DUAL', // LOCAL & ROAMING
}

/**
 * product meta - continent 타입
 */
// TODO: 업체 상의 후 common code 추가
export enum CONTINENT_TYPE {
  ASIA = 'ASIA',
  // MULTIPLE = 'MULTIPLE',
  EUROPE = 'EUROPE',
  OCEANIA = 'OCEANIA',
  USA_CANADA = 'USA & CANADA',
  NORTH_AMERICA = 'NORTH_AMERICA',
  SOUTH_AMERICA = 'SOUTH_AMERICA',
  AFRICA = 'AFRICA',
}

/**
 * point type
 */
export enum POINT_TYPE {
  REWARD = 'REWARD',
  SPEND = 'SPEND',
}

export enum FILE_TYPE {
  USER_PROFILE_IMG = 'USER_PROFILE_IMG',
  PRODUCT_IMG = 'PRODUCT_IMG',
  QR_IMG = 'QR_IMG',
  BANNER = 'BANNER', //배너
  BANNER_THUMBNAIL = 'BANNER_THUMBNAIL' //영상일 경우 배너의 썸네일

}

/**
 * esim 실물 활성화 상태
 */
export enum ACTIVE_STATE {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

/**
 * API key발급 상태 관리
 */
export enum API_STATE {
  ACTIVE = 'ACTIVE', // 활용
  LIMIT = 'LIMIT', // 제한
  DISABLED = 'DISABLED', // 비활성
}

export enum SETTLEMENT_STATE_TYPE {
  PENDING_SETTLEMENT = 'PENDING_SETTLEMENT',
  SETTLEMENT_COMPLETE = 'SETTLEMENT_COMPLETE',
}

/**
 * 결제방식
 */
export enum PAYMENT_METHOD_TYPE {
  CART = 'CART',
  DIRECT = 'DIRECT',
}

/**
 * 사용처 타입
 */
export enum USAGE_CONTEXT_TYPE {
  ALL = 'ALL',
  INNER = 'INNER',
  EXTERNAL = 'EXTERNAL',
  EXTERNAL_API = 'EXTERNAL_API',
  OFFLINE = 'OFFLINE',
}
/**
 * 주문 상태 타입
 */
export enum ORDER_STATUS_TYPE {
  NONE = 'NONE',
  DONE = 'DONE',
}

export enum COMPANY_SETTLEMENT_TYPE {
  NONE = 'NONE',
  GIVE = 'GIVE',
  TAKE = 'TAKE',
  INFLOW = 'INFLOW',
}

export enum PAYGENT_CARD_SET_METHOD {
  TOKEN = 'token',
  CUSTOMER = 'customer',
  DIRECT = 'direct',
  GOOGLE = 'google',
}

export enum ORDER_TYPE {
  POPULAR = 'POPULAR', // 등록일이 60일이 지나지 않고 판매량이 많은 상품
  RELATE = 'RELATE', // 등록일이 60일이 지나지 않고 대륙 간의 연관된 형태(아시아(한국, 일본, 중국))로 정렬
  DEFAULT = 'DEFAULT', // 아무것도 선택하지 않은 경우 기본 정렬 조건
  NORMAL = 'NORMAL', // 기본 노출가 높은 것들이 제일 우선적으로 보이게 정렬
  LOCAL = 'LOCAL', // 로컬 상품
  ROAMING = 'ROAMING', // 로밍 상품
  BEST = 'BEST' // 베스트 퀄리티 여부
}

export enum PRODUCT_META_KEY {
  CONTINENT = 'CONTINENT', // 대륙
  COUNTRY = 'COUNTRY', // 국가
  DAYS = 'DAYS', // 기간
  PLAN = 'PLAN', // plan (daily/fixed)
  DATA = 'DATA', // 데이터 (GB)
  OPERATOR = 'OPERATOR', // 상품 수집 시에 수집되는 통신사 정보 (n개)
  PROVIDER = 'PROVIDER', // 화면에 노출하는 통신사 정보 (1개)
  CONNECTION = 'CONNECTION', // 연결
  VALIDITY = 'VALIDITY' // 유효기간
}

export enum BOARD_TYPE {
  FAQ = 'FAQ',
  NOTICE = 'NOTICE',
  NEWS = 'NEWS',
}

export enum CARD_BRAND {
  // JCB
  JCB = 'JCB',
  // Diners Club INTERNATIONAL
  DINERS = 'Diners',
  // AMERICAN EXPRESS
  AMEX = 'AMEX',
  // VISA
  VISA = 'VISA',
  // MasterCard
  MASTER = 'MasterCard',
}

export enum PAYMENT_ENV {
  // 테스트 모드
  SANDBOX = 'sandbox',
  // 실제 운영 환경
  MODULE = 'module',
}

// esim 오프라인 판매 - 주문 진행 상황 관련 상태값
export enum ORDER_STATE {
  ORDER_STANDBY = 'ORDER_STANDBY',
  ORDER_PROGRESS = 'ORDER_PROGRESS',
  ORDER_COMPLETE = 'ORDER_COMPLETE',
}

// 배너 타입 - TODO: 세부 타입은 아직 미정
export enum BANNER_TYPE {
  MAIN = 'MAIN',
  SUB = 'SUB',
}

/**
 * koa 파일 타입
 */
export interface FileObject {
  fieldname: string;     // 폼에서 지정한 필드 이름
  originalname: string;  // 업로드된 파일의 원래 이름
  encoding: string;      // 파일 인코딩 타입
  mimetype: string;      // 파일의 MIME 타입
  size: number;          // 파일 크기(바이트)
  destination: string;   // 파일이 저장된 폴더 경로
  filename: string;      // 저장된 파일 이름
  path: string;          // 전체 파일 경로
  buffer?: Buffer;       // 메모리에 저장된 경우의 버퍼(옵션)
}

export enum PRODUCT_OPTIONS {
  // 노출순서
  DISPLAY_ORDER = 'DISPLAY_ORDER',
  // 판매량
  SALES = 'SALES',
  // 등록일자
  CREATED_DATE = 'CREATED_DATE',
}

export enum BANNER_FILE_TYPE {
  VIDEO = 'VIDEO_BANNER',
  IMAGE = 'IMAGE_BANNER',
}
