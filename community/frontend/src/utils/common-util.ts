// 팝업(모바일 사이드 메뉴 등)이 열려 있는 동안 배경 스크롤 잠금.
// scroll/mousewheel 이벤트 preventDefault 방식은 표준이 아니고(Firefox 미동작,
// scroll 은 cancelable 아님) 팝업 내부 스크롤까지 막으므로 overflow 토글을 쓴다.
export function scrollDisable() {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = 'hidden';
}

export function scrollAble() {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = '';
}
