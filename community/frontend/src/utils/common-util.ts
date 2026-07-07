import lzString from 'lz-string';

export function saveLocalData(key: string, val: string): void {
  if (typeof window === 'undefined') return;
  const storage = window.localStorage;
  if (storage) {
    try {
      storage.setItem(key, lzString.compressToUTF16(val));
    } catch (e) {
      console.error('Storage Full ... clean old data...');
      for (const k in storage) {
        if (k.indexOf('DATA_MESSAGE_DETAIL_') > -1) {
          storage.removeItem(k);
        }
      }
      storage.setItem(key, lzString.compressToUTF16(val));
    }
  }
}

export function loadLocalData(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const storage = window.localStorage;
  if (storage) {
    const keyValue = storage.getItem(key);
    if (keyValue) return lzString.decompressFromUTF16(keyValue);
  }
  return null;
}

export function removeLocalData(key: string): void {
  if (typeof window === 'undefined') return;
  const storage = window.localStorage;
  if (storage) {
    storage.removeItem(key);
  }
}

// 스크롤 비활성화
export function scrollDisable() {
  window.addEventListener('scroll', preventDefault, { passive: false });
  window.addEventListener('touchmove', preventDefault, { passive: false });
  window.addEventListener('mousewheel', preventDefault, { passive: false });
}

// 스크롤 활성화
export function scrollAble() {
  window.removeEventListener('scroll', preventDefault);
  window.removeEventListener('touchmove', preventDefault);
  window.removeEventListener('mousewheel', preventDefault);
}

function preventDefault(e: Event) {
  e.preventDefault();
}
