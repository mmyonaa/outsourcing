export class SearchBannerDto {
  bannerIdx: string | undefined = undefined;
  activeYn: string | undefined = undefined;
}

export class BannerEntity {
  bannerIdx: string = '';
  imgUrl: string | undefined = undefined;
  swipeDuration: number = 5;
  displayOrder: number = 0;
  activeYn: string = 'Y';
  isDefault: boolean = false;
  regDt: Date | undefined = undefined;
  modDt: Date | undefined = undefined;
  delYn: string = 'N';
}
