import { STATE_YN } from "../../../types";
import { BasicListDto } from "./basic.dto";

export class SearchBoardDto extends BasicListDto {
  boardIdx: string | undefined = undefined;
  boardType: string | undefined = undefined;
  // 검색어
  keyword: string | undefined = undefined;
}

// updateBoard 에서 수정을 허용하는 컬럼 — 클라이언트가 실제로 보낸 필드와
// 교집합을 내어 그 컬럼만 SET 한다.
export const UPDATABLE_BOARD_COLUMNS: (keyof BoardEntity)[] = [
  "title",
  "body",
  "bestYn",
  "views",
];

export class BoardEntity {
  // 보드고유번호
  boardIdx: string = "";
  // 제목
  title: string | undefined = undefined;
  // 내용
  body: string | undefined = undefined;
  boardType: string | undefined = undefined;
  // 조회수
  views: number = 0;
  // 관리자
  author: string | undefined = undefined;
  // 등록일시
  regDt: Date | undefined = undefined;
  // 수정일시
  modDt: Date | undefined = undefined;
  // 삭제여부
  delYn: STATE_YN = STATE_YN.N;
  bestYn: STATE_YN = STATE_YN.N;
  // 토탈 카운트
  totalCount = 0;
}
