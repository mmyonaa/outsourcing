import { STATE_YN } from "../../../types";
import { BasicListDto } from "./basic.dto";

export class SearchBannerDto extends BasicListDto {
  bannerIdx: string | undefined = undefined;
  activeYn: STATE_YN | undefined = undefined;
}

export class BannerEntity {
  // 배너고유번호
  bannerIdx: string = "";
  // 이미지 URL
  imgUrl: string | undefined = undefined;
  // 스와이프 지속시간 (초)
  swipeDuration: number = 5;
  // 표시 순서
  displayOrder: number = 0;
  // 활성화 여부
  activeYn: STATE_YN = STATE_YN.Y;
  // 기본 배너 여부
  isDefault: boolean = false;
  // 등록일시
  regDt: Date | undefined = undefined;
  // 수정일시
  modDt: Date | undefined = undefined;
  // 삭제여부
  delYn: STATE_YN = STATE_YN.N;
  // 토탈 카운트
  totalCount = 0;
}
