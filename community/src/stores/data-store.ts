import { ICategory } from '@/api/dto/category.dto';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDataStore = defineStore('data', () => {
  const authToken = ref(''); // 로그인 인증 토큰
  const beforePageCategory = ref<ICategory>();

  function setAuthToken(v: string) {
    authToken.value = v;
  }

  function setBeforePageCategory(v: ICategory) {
    beforePageCategory.value = v;
  }

  return {
    authToken,
    beforePageCategory,
    setAuthToken,
    setBeforePageCategory,
  };
});
