import { STATE_YN } from '../../types';
import { BasicListDto } from '@/api/dto/request.dto';

// 게시판 댓글
export class BoardCommentEntity {
  // 게시판댓글고유번호
  commentIdx: string | undefined = undefined;
  // 게시판고유번호
  boardIdx: string | undefined = undefined;
  // 댓글내용
  commentBody: string | undefined = undefined;
  // 상위게시판댓글고유번호
  hirankBoardCommentIdx: string | undefined = undefined;
  // 등록자회원고유번호
  regrUserIdx: string | undefined = undefined;
  // 등록일시
  regDt: Date | null = null;
  // 수정자회원고유번호
  modrUserIdx: string | undefined = undefined;
  // 수정일시
  modDt: Date | null = null;
  // 삭제여부
  delYn: STATE_YN = STATE_YN.N;
}

export class BoardCommentResultDto extends BoardCommentEntity {
  userIdx: string | undefined = undefined;
  userId: string | undefined = undefined;
  userName: string | undefined = undefined;
  userEnName: string | undefined = undefined;
  userNickname: string | undefined = undefined;
  // 좋아요 여부
  isLike = false;
  // 좋아요 총갯수
  likeCount = 0;
  totalCount = 0;
}

export class SearchBoardCommentDto extends BasicListDto {
  // 게시판댓글고유번호
  commentIdx: string | undefined = undefined;
  // 게시판고유번호
  boardIdx: string | undefined = undefined;
  // 상위게시판댓글고유번호
  hirankBoardCommentIdx: string | undefined = undefined;
  // 등록자회원고유번호
  regrUserIdx: string | undefined = undefined;
  // 등록일시
  regDt: Date | null = null;
  delYn: STATE_YN = STATE_YN.N;
  // 상위 댓글을 조회하는 것인지 여부
  isTopCommentSearchYn: STATE_YN = STATE_YN.N;
}
