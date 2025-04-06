<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { loadLocalData, removeLocalData } from '@/utils/common-util';
import AppConfig from '@/constants';
import ApocButton from '@/components/common/ApocButton.vue';
import { initStore } from '@/stores/store-manager';
import { useRoute, useRouter } from 'vue-router';
import SideBar from '@/components/common/SideBar.vue';
import BoardListWrapper from '@/components/board/BoardListWrapper.vue';
import { type CategoryInterface, SUB_TAB_TYPE } from '@/types';
import ProfileEdit from '@/components/myPage/ProfileEdit.vue';
import { CategoryEntityV2 } from '@/api/dto/category.dto';

export default defineComponent({
  name: 'Mypage',
  computed: {
    SUB_TAB_TYPE() {
      return SUB_TAB_TYPE;
    },
  },
  components: { ProfileEdit, BoardListWrapper, SideBar, ApocButton },
  setup() {
    const storeManager = initStore();
    const router = useRouter();
    const route = useRoute();
    const curMainTabInfo = ref<CategoryEntityV2>(); // 현재 페이지 메인탭
    const routerType = computed(() => route.query.type);
    const onClickLogout = () => {
      removeLocalData(AppConfig.KEYS.LOGIN_TOKEN);
      removeLocalData(AppConfig.KEYS.LOGIN_USER);
      storeManager.dataStore.setAuthToken('');
      // window.alert('로그아웃');
      router.push('/');
    };

    /**
     * Function
     */
    // 현재 탭에 대한 정보를 가져옵니다
    const getCategoryInfo = () => {
      const category = loadLocalData(AppConfig.KEYS.CATEGORY);
      if (category) {
        curMainTabInfo.value = JSON.parse(category).find((v: CategoryEntityV2) => v.categoryCode === (route.params.mainTab as string).toUpperCase());
        if (!curMainTabInfo.value) return;
      } else {
        console.error('category is null');
      }
    };
    watch(
      () => route.query.type,
      () => {
        if (route.query.type === SUB_TAB_TYPE.LOGOUT) {
          onClickLogout();
          router.push('/');
        }
      },
    );

    onMounted(() => {
      getCategoryInfo();
    });

    return {
      curMainTabInfo,
      routerType,
      route,
      onClickLogout,
    };
  },
});
</script>

<template>
  <section class="my-page-section">
    <div>
      <side-bar :is-drop-down="false" />
    </div>
    <board-list-wrapper v-if="routerType !== SUB_TAB_TYPE.PROFILE" :cur-main-tab-info="curMainTabInfo" />
    <profile-edit v-if="routerType === SUB_TAB_TYPE.PROFILE"></profile-edit>
  </section>
</template>
