import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDataStore = defineStore('data', () => {
  const authToken = ref(''); // 로그인 인증 토큰

  function setAuthToken(v: string) {
    authToken.value = v;
  }

  return {
    authToken,
    setAuthToken,
  };
});
