import AppConfig from '../../constants';
import type { ORDER_TYPE } from '@/types';

/**
 * 검색용 기본 DTO
 */
export class BasicListDto {
  //키워드 검색
  keyword: string | undefined = undefined;
  //정렬 타입
  orderType: ORDER_TYPE | undefined = undefined;
  //페이지
  page = 1;
  //로우 카운트
  rows: number | undefined = AppConfig.KEYS.PAGING_ROW;
}
