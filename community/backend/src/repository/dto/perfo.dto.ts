import { STATE_YN } from "../../types";
import { BasicListDto } from "./basic.dto";

export class SearchPerfoDto extends BasicListDto {
  perIdx: string | undefined = undefined;
  perType: string | undefined = undefined;
  category: string | undefined = undefined;
  keyword: string | undefined = undefined;
}

// updatePerfo 에서 수정을 허용하는 컬럼 — 클라이언트가 실제로 보낸 필드와
// 교집합을 내어 그 컬럼만 SET 한다.
// views 는 increaseViews 엔드포인트로만 변경 가능 (임의 값 저장 방지)
export const UPDATABLE_PERFO_COLUMNS: (keyof PerfoEntity)[] = [
  "title",
  "titleSec",
  "titleThird",
  "body",
  "category",
  "imgUrl",
];

export class PerfoEntity {
  // 보드고유번호
  perIdx: string = "";
  perType: string | undefined = undefined;
  // 제목
  title: string | undefined = undefined;
  author: string | undefined = undefined;
  titleSec: string | undefined = undefined;
  titleThird: string | undefined = undefined;
  // 내용
  body: string | undefined = undefined;
  category: string | undefined = undefined;
  imgUrl: string | undefined = undefined;
  // 조회수
  views: number = 0;
  // 등록일시
  regDt: Date | undefined = undefined;
  // 수정일시
  modDt: Date | undefined = undefined;
  // 삭제여부
  delYn: STATE_YN = STATE_YN.N;
  // 토탈 카운트
  totalCount = 0;
}
