import AppConfig from '../../constants';
/**
 * 검색용 기본 DTO
 */
export class BasicListDto {
  //키워드 검색
  keyword: string | undefined = undefined;
  //페이지
  page = 1;
  //로우 카운트
  rows: number | undefined = AppConfig.KEYS.PAGING_ROW;
}
