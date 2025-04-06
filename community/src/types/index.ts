/**
 * 정렬 유형 코드
 */
export enum ORDER_TYPE {
  READ_COUNT_DESC = 'READ_COUNT_DESC', // 읽음 수가 많은 오름차순
  LIKE_COUNT_DESC = 'LIKE_COUNT_DESC', // 좋아요 수가 많은 오름차순
  COMMENT_COUNT_DESC = 'COMMENT_COUNT_DESC', // 댓글 수가 많은 오름차순
  NAME_DESC = 'NAME_DESC', // 이름 오름차순
  NAME_ASC = 'NAME_ASC', // 이름 내림차순
  NEW = 'NEW', // 가장 최신
  OLD = 'OLD', // 가장 오래된
  HOT = 'HOT', // 3일 이내 가장 많이 본 순
  PLAY = 'PLAY', // 플레이순
  THIS_WEEK = 'THIS_WEEK', // 이번주 이내 가장 많이 본 순
  POPULAR = 'POPULAR', // 전체 가장 많이 본 순
  RANDOM_A = 'RANDOM_A', // 랜덤 고유번호 오름차순
  RANDOM_B = 'RANDOM_B', // 랜덤 등록일자 오름차순
  RANDOM_C = 'RANDOM_C', // 랜덤 영문명 오름차순
  RANDOM_D = 'RANDOM_D', // 랜덤 고유번호 내림차순
  RANDOM_E = 'RANDOM_E', // 랜덤 등록일자 내림차순
  RANDOM_F = 'RANDOM_F', // 랜덤 이름 내림차순
  GANADA = 'GANADA', // 가나다
  UPDATE = 'UPDATE', // 업데이트
  LIKE = 'LIKE', // 좋아요
  NOW_YEAR = 'NOW_YEAR', // 올해
  REPLY = 'REPLY', // 댓글 많은 순
}

/**
 * 메인 탭 코드
 */
export enum MAIN_TAB_TYPE {
  NEWS = 'APOC_NEWS',
  TUTORIAL = 'TUTORIAL',
  BOARD = 'BOARD',
  NOTICE = 'NOTICE',
  MYPAGE = 'MYPAGE',
}
export enum MAIN_TAB_CODE_TYPE {
  NEWS = 'M001',
  TUTORIAL = 'M002',
  BOARD = 'M003',
  NOTICE = 'M004',
}

/**
 *  서브 탭 코드
 */
export enum SUB_TAB_TYPE {
  // NEWS
  NOW = 'NOW',
  INTERVIEW = 'INTERVIEW',
  RELEASE = 'RELEASE',
  NEWS_ROOM = 'NEWS_ROOM',
  // TUTORIAL
  USE_STUDIO = 'USE_STUDIO',
  USE_ASSET = 'USE_ASSET',
  USE_PLAY = 'USE_PLAY',
  TUTORIAL = 'TUTORIAL',
  // BOARD
  TIPS = 'TIPS',
  FREE = 'FREE',
  FUNCTION = 'FUNCTION',
  // NOTICE
  NOTICE = 'NOTICE',
  EVENT = 'EVENT',

  MY_CONTENTS = 'MY_CONTENTS',
  LIKE_CONTENTS = 'LIKE_CONTENTS',
  PROFILE = 'PROFILE',
  LOGOUT = 'LOGOUT',
}
export enum SUB_TAB_CODE_TYPE {
  // NEWS
  NOW = 'S001',
  INTERVIEW = 'S002',
  NEWS_ROOM = 'S003',
  RELEASE = 'S004',
  // TUTORIAL
  EDU = 'S005',
  STUDENT = 'S006',
  CREATOR = 'S007',
  // BOARD
  TIPS = 'S008',
  FREE = 'S009',
  FUNCTION = 'S010',
  // NOTICE
  EVENT = 'S011',
  NOTICE = 'S012',
}

/**
 *  태그 코드
 */
export enum TAG_TYPE {
  ALL = 'ALL',
  STUDIO = 'STUDIO',
  KIT = 'KIT',
  APOC = 'APOC',
  TWO_D = '2D',
  THREE_D = '3D',
  AR = 'AR',
  VR = 'VR',
  AI = 'AI',
  VISUAL_CODING = 'Visual Coding',
  TUTORIAL = 'TUTORIAL',
  BOARD = 'BOARD',
  ETC = 'ETC',
}
export enum TAG_CODE_TYPE {
  STUDIO = 'T001',
  KIT = 'T002',
  APOC = 'T003',
  TWO_D = 'T004',
  THREE_D = 'T005',
  AR = 'T006',
  VR = 'T007',
  AI = 'T008',
  VISUAL_CODING = 'T009',
  TUTORIAL = 'MY001',
  BOARD = 'MY002',
  ETC = 'T010',
}

/**
 * 카테고리 관련 인터페이스와 enum
 */
export interface CategoryInterface {
  type?: MAIN_TAB_TYPE;
  title: string;
  typeCode?: MAIN_TAB_CODE_TYPE;
  subItems?: CategorySubInterface[];
}

export interface CategorySubInterface {
  type?: SUB_TAB_TYPE;
  title: string;
  iconSrc?: string;
  typeCode?: SUB_TAB_CODE_TYPE;
  tagList?: TagInterface[];
  viewMode?: VIEW_MODE_TYPE;
  options?: {
    isLike: boolean;
    isComment: boolean;
    isRegrUser: boolean;
    isRegDt: boolean;
  };
}
export interface TagInterface {
  type?: TAG_TYPE;
  title: string;
  typeCode?: TAG_CODE_TYPE;
}
export enum VIEW_MODE_TYPE {
  CARD = 'CARD',
  LIST = 'LIST',
}
/**
 * YN 상태값
 */
export enum STATE_YN {
  Y = 'Y',
  N = 'N',
}

/**
 * 보드저장상태
 */
export enum SAVE_STATE {
  DRAFT = 'DRAFT', // 임시저장
  SAVE = 'SAVE', // 저장
}

export interface InstagramInterface {
  id: string;
  like_count: number;
  comments_count: number;
  media_type: string;
  media_url: string;
  permalink: string;
}

export enum POPUP_TYPE {
  NONE = 'NONE',
  REPORT_POPUP = 'REPORT_POPUP',
  COPY_TOAST = 'COPY_TOAST',
  TABLET_SIDE_MENU = 'TABLET_SIDE_MENU',
}
export enum EVAL_TARGET_TYPE {
  BOARD = 'BOARD',
  COMMENT = 'COMMENT',
}
export enum EVAL_TYPE {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export interface CategoryType {
  categoryIdx: string;
  categoryTypeCode: string;
  categoryCode: string;
  categoryKrName: string;
  categoryEnName: string;
}

export interface HeaderSelectOption {
  value: string;
  label: string;
  subLabel?: string; //부가설명
  uuid?: string;
  router?: string;
  imageSrc?: string;
  func?: () => void;
  listLabel?: string; //수정 팝업에 쓰임
}
