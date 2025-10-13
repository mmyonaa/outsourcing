import { BasicListDto } from '@/api/dto/request.dto';
import { STATE_YN } from '@/types';

export class PerfoEntity {
  // 공연고유번호
  perIdx: string | undefined = undefined;
  // 공연타입
  perType: string | undefined = undefined;
  // 카테고리
  category: string | undefined = undefined;
  // 제목
  title: string | undefined = undefined;
  // 중제목
  titleSec: string | undefined = undefined;
  // 소제목
  titleThird: string | undefined = undefined;
  // 내용
  body: string | undefined = undefined;
  // 이미지 URL
  imgUrl: string | undefined = undefined;
  // 작성자
  author: string | undefined = undefined;
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

export class SearchPerfoDto extends BasicListDto {
  perIdx: string | undefined = undefined;
  // 제목
  title: string | undefined = undefined;
  // 내용
  body: string | undefined = undefined;
  // 공연타입
  perType: string | undefined = undefined;
  // 검색 키워드
  keyword: string | undefined = undefined;
  category: string | undefined = undefined;
}
