import { useDataStore } from '@/stores/data-store';
import { useCommonStore } from '@/stores/common-store';
import { useStateStore } from '@/stores/state-store';

export class StoreManager {
  _commonStore;
  _dataStore;
  _stateStore;

  constructor() {
    this._commonStore = useCommonStore();
    this._dataStore = useDataStore();
    this._stateStore = useStateStore();
  }

  get commonStore() {
    return this._commonStore;
  }

  get dataStore() {
    return this._dataStore;
  }

  get stateStore() {
    return this._stateStore;
  }
}

let storeManager: StoreManager | undefined;
export const initStore = () => {
  if (!storeManager) storeManager = new StoreManager();
  return storeManager;
};
