import { useCommonStore } from '@/stores/common-store';
import { useStateStore } from '@/stores/state-store';

export class StoreManager {
  _commonStore;
  _stateStore;

  constructor() {
    this._commonStore = useCommonStore();
    this._stateStore = useStateStore();
  }

  get commonStore() {
    return this._commonStore;
  }

  get stateStore() {
    return this._stateStore;
  }
}

let storeManager: StoreManager | undefined;
export const initStore = () => {
  // SSR(프리렌더)에서는 라우트마다 새 앱/pinia가 만들어지므로 모듈 싱글턴을
  // 캐시하면 첫 렌더의 스토어가 이후 페이지에 재사용된다(cross-request 오염).
  // 서버에서는 매번 현재 active pinia에 바인딩된 새 인스턴스를 만든다.
  if (import.meta.env.SSR) return new StoreManager();
  if (!storeManager) storeManager = new StoreManager();
  return storeManager;
};
