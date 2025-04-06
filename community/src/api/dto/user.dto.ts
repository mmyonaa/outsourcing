import { STATE_YN } from '@/types';

export class UserEntity {
  // 회원고유번호
  userIdx: string | undefined = undefined;
  // 통합회원고유번호
  universalUserIdx: string | undefined = undefined;
  // 회원유형코드
  userTypeCode: string | undefined = undefined;
  // 회원 아이디
  userId: string | undefined = undefined;
  // 회원 이름
  userName: string | undefined = undefined;
  // 회원 영문 이름
  userEnName: string | undefined = undefined;
  // 회원 비밀번호
  pwd: string | undefined = undefined;
  // 회원 닉네임
  userNickname: string | undefined = undefined;
  // 전화번호
  mobileTel: string | undefined = undefined;
  // 국가명
  countryName: string | undefined = undefined;
  // 도시명
  cityName: string | undefined = undefined;
  // 우편번호
  zipcode: string | undefined = undefined;
  // 주소
  address: string | undefined = undefined;
  // 상세주소
  detailAddress: string | undefined = undefined;
  // 생일
  birth: Date | undefined = undefined;
  // 로그인 유형코드
  loginTypeCode: string | undefined = undefined;
  // 등록자 회원 고유번호
  regrUserIdx: string | undefined = undefined;
  // 등록일시
  regDt: Date | undefined = undefined;
  // 수정자 회원 고유번호
  modrUserIdx: string | undefined = undefined;
  // 수정일시
  modDt: Date | undefined = undefined;
  // 삭제Yn
  delYn: STATE_YN = STATE_YN.N;
  // 탈퇴여부
  withDrawYn: STATE_YN = STATE_YN.N;
}

export class UserInfoEntityDto extends UserEntity {
  // 사용자 토큰
  token: string | undefined = undefined;
  // 회원 프로필 이미지
  userProfileImg: string | undefined = undefined;
}

export class JoinUserDto {
  // 회원 아이디
  userId: string | undefined = undefined;
  // 회원 이름
  userName: string | undefined = undefined;
  // 비밀번호
  pwd: string | undefined = undefined;
  // 닉네임
  userNickname: string | undefined = undefined;
}

export class LoginUserDto {
  // 회원 아이디
  userId: string | undefined = undefined;
  // 비밀번호
  pwd: string | undefined = undefined;
}

/**
 * UserFollowArea
 */

export class UserFollowRecEntity {
  userFollowSeq: string | undefined = undefined;
  userIdx: string | undefined = undefined;
  targetUserIdx: string | undefined = undefined;
  checkDt: Date | undefined = undefined;
  regrUserIdx: string | undefined = undefined;
  regDt: Date | undefined = undefined;
  modrUserIdx: string | undefined = undefined;
  modDt: Date | undefined = undefined;
  delYn: STATE_YN = STATE_YN.N;
}
