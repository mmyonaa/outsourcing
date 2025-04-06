import { BasicListDto } from '@/api/dto/request.dto';
import { STATE_YN } from '@/types';

export interface ICategory {
  // 카테고리고유번호
  categoryIdx: string;
  // 카테고리타입코드
  categoryTypeCode: string;
  // 카테고리코드
  categoryCode: string;
  // 카테고리 한글명
  categoryKrName: string;
  // 카테고리 영문명
  categoryEnName: string;
  // 정렬순서
  sortOrder: number;
  // 부모고유번호
  parentCategoryIdx: string;
  //하위태그
  tag: ICategory[] | undefined;
}

export class CategoryEntity {
  // 카테고리고유번호
  categoryIdx: string | undefined = undefined;
  // 카테고리코드
  categoryCode: string | undefined = undefined;
  // 카테고리타입코드
  categoryTypeCode: string | undefined = undefined;
  // 카테고리명
  categoryName: string | undefined = undefined;
  // 카테고리영문명
  categoryEnName: string | undefined = undefined;
  // 카테고리설명
  categoryDesc: string | undefined = undefined;
  // 정렬순서
  sortOrder = 0;
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

export class SearchCategoryDto extends BasicListDto {
  categoryIdx: string | undefined = undefined;
  categoryCode: string | undefined = undefined;
  categoryTypeCode: string | undefined = undefined;
  categoryEnName: string | undefined = undefined;
  regrUserIdx: string | undefined = undefined;
}

// @neck 이름 나중에 바꾸기
export class CategoryEntityV2 {
  // 카테고리고유번호
  categoryIdx: string | undefined = undefined;
  // 카테고리타입코드
  categoryTypeCode: string | undefined = undefined;
  // 카테고리코드
  categoryCode: string | undefined = undefined;
  // 카테고리 한글명
  categoryKrName: string | undefined = undefined;
  // 카테고리 영문명
  categoryEnName: string | undefined = undefined;
  // 정렬순서
  sortOrder = 0;
  // 하위탭
  subTab: ICategory[] | undefined = undefined;
  // 태그
  tag: ICategory[] | undefined = undefined;
}
// @neck 이름 나중에 바꾸기
export class CategoryEntityDetail {
  // 카테고리고유번호
  categoryIdx: string | undefined = undefined;
  // 카테고리타입코드
  categoryTypeCode: string | undefined = undefined;
  // 카테고리코드
  categoryCode: string | undefined = undefined;
  // 카테고리 한글명
  categoryKrName: string | undefined = undefined;
  // 카테고리 영문명
  categoryEnName: string | undefined = undefined;
  // 정렬순서
  sortOrder = 0;
  // 부모고유번호
  parentCategoryIdx: string | undefined = undefined;
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
}
