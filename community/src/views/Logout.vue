<script lang="ts">
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { setApiToken } from '@/utils/apiClient';
import { loadLocalData, removeLocalData } from '@/utils/common-util';
import { defineComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Logout',
  setup() {
    const storeManager = initStore();
    const route = useRoute();
    onMounted(() => {
      removeLocalData(AppConfig.KEYS.LOGIN_TOKEN);
      removeLocalData(AppConfig.KEYS.LOGIN_USER);
      storeManager.dataStore.setAuthToken('');
      setApiToken('');
      localStorage.clear();
      /* 추가 코드 */
      if (route.path.split('/').includes('v2') && route.query.ru) {
        const ru = route.query.ru as string;
        window.location.replace(atob(ru));
      }
    });
  },
});
</script>

<template>
</template>
