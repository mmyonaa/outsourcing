import { TYPE_PERFO_CATEGORY } from '@/types';

/**
 * 공연 카테고리 코드 → 표시 라벨.
 * (기존에 7개 뷰에 복붙되어 있던 switch 를 한 곳으로 모음)
 */
export const getCategoryLabel = (category: string | undefined): string => {
  switch (category) {
    case TYPE_PERFO_CATEGORY.PERFO:
      return '공연';
    case TYPE_PERFO_CATEGORY.EDU:
      return '교육';
    case TYPE_PERFO_CATEGORY.EVENT:
      return '행사';
    default:
      return '';
  }
};
