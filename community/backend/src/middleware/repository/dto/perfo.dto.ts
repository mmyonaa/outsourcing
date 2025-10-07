import { STATE_YN } from "../../../types";
import { BasicListDto } from "./basic.dto";

export class SearchPerfoDto extends BasicListDto {
  perIdx: string | undefined = undefined;
  // 제목
  title: string | undefined = undefined;
  // 내용
  body: string | undefined = undefined;
  perType: string | undefined = undefined;
  category: string | undefined = undefined;
  keyword: string | undefined = undefined;
}

export class PerfoEntity {
  // 보드고유번호
  perIdx: string = "";
  perType: string | undefined = undefined;
  // 제목
  title: string | undefined = undefined;
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
  // 수정자회원고유번호
  modrUserIdx: string | undefined = undefined;
  // 수정일시
  modDt: Date | undefined = undefined;
  // 삭제여부
  delYn: STATE_YN = STATE_YN.N;
  // 토탈 카운트
  totalCount = 0;
}
