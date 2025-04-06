import { BasicListDto } from '@/api/dto/request.dto';
import { type CategoryType, SAVE_STATE, STATE_YN } from '@/types';

export class BoardEntity {
  // 보드고유번호
  boardIdx: string | undefined = undefined;
  // 제목
  title: string | undefined = undefined;
  // 내용
  body: string | undefined = undefined;
  // 저장상태
  saveState: SAVE_STATE = SAVE_STATE.DRAFT;
  // 재생시간
  playTime = 0;
  // 게시글공개여부
  openYn: STATE_YN = STATE_YN.Y;
  // 게시글상단고정여부
  pinYn: STATE_YN = STATE_YN.N;
  // 등록자회원고유번호
  regrUserIdx: string | undefined = undefined;
  // 등록일시
  regDt: Date | undefined = undefined;
  // 수정자회원고유번호
  modrUserIdx: string | undefined = undefined;
  // 수정일시
  modDt: Date | undefined = undefined;
  // 삭제여부
  delYn: STATE_YN = STATE_YN.N;
  // 토탈 카운트
  totalCount = 0;
}

export class SearchBoardDto extends BasicListDto {
  boardIdx: string | undefined = undefined;
  // 제목
  title: string | undefined = undefined;
  // 내용
  body: string | undefined = undefined;
  // 공개여부
  openYn: STATE_YN = STATE_YN.Y;
  // 저장상태
  saveState: SAVE_STATE = SAVE_STATE.DRAFT;
  // 등록자회원고유번호
  regrUserIdx: string | undefined = undefined;
  // 등록일시
  regDt: Date | undefined = undefined;
  // 메인탭 코드
  mainTabCode: string | undefined = undefined;
  // 서브탭 코드
  subTabCode: string | undefined = undefined;
  // 태그탭 코드
  tagCode: string | undefined = undefined;
  // 메인탭 코드
  mainTabIdx: string | undefined = undefined;
  // 서브탭 코드
  subTabIdx: string | undefined = undefined;
  // 태그탭 코드
  tagIdx: string | undefined = undefined;
  // 좋아요 여부
  isLike = false;
  // 좋아요 누른 콘텐츠
  likeContents: STATE_YN = STATE_YN.N;
  // 내 콘텐츠
  myContents: STATE_YN = STATE_YN.N;
}

export class BoardEntityDto extends BoardEntity {
  //게시판 썸네일 이미지
  boardMainImg: string | undefined = undefined;
  // 팔로우 여부
  isFollow = false;
  // 좋아요 여부
  isLike = false;
  // 좋아요 총갯수
  likeCount = 0;
  // 댓글 총개수
  commentCount = 0;
  // 유저 idx
  userIdx: string | undefined = undefined;
  // 유저 id
  userId: string | undefined = undefined;
  // 유저 닉네임
  userNickname: string | undefined = undefined;
  // 카테고리 정보들
  category: CategoryType[] | undefined = [];
  //반환 총갯수
  totalCount = 0;
  //게시판 이전글
  prevBoardIdx: string | undefined = undefined;
  //게시판 다음글
  nextBoardIdx: string | undefined = undefined;
}

export class InsertBoardDto extends BoardEntity {
  // 카테고리 고유번호 리스트
  categoryList: string[] = [];
  imgList: string[] = [];
}

export class BoardStatisticsEntity {
  // 보드고유번호
  boardIdx: string | undefined = undefined;
  // 조회수
  read_count = 0;
  // 공유횟수
  share_count = 0;
}

export class updateBoardStaticsDto extends BasicListDto {
  boardIdx: string | undefined = undefined;
}
