import { STATE_YN } from '../../types';

export class PopularSearchEntity {
  // 인기검색어고유번호
  popularSearchIdx: string | undefined = undefined;
  // 인기검색어한글명
  popularSearchKrName: string | undefined = undefined;
  // 인기검색어영문명
  popularSearchEnName: string | undefined = undefined;
  // 절렬순서
  sortOrder = 0;
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
