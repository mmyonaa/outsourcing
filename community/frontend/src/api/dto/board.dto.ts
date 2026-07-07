import { BasicListDto } from '@/api/dto/request.dto';
import { STATE_YN } from '@/types';

export class BoardEntity {
  // 보드고유번호
  boardIdx: string | undefined = undefined;
  // 제목
  title: string | undefined = undefined;
  // 내용
  body: string | undefined = undefined;
  boardType: string | undefined = undefined;
  // 조회수
  views: number = 0;
  // 관리자
  author: string = '관리자';
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
  // 여부
  bestYn: STATE_YN = STATE_YN.N;
  // 토탈 카운트
  totalCount = 0;
}

export class SearchBoardDto extends BasicListDto {
  boardIdx: string | undefined = undefined;
  boardType: string | undefined = undefined;
  keyword: string | undefined = undefined;
}
