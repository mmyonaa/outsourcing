<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import BoardListWrapper from '@/components/board/BoardListWrapper.vue';
import SideBar from '@/components/common/SideBar.vue';
import { useRoute } from 'vue-router';
import { type CategoryInterface } from '@/types';
import BoardDetail from '@/components/board/BoardDetail.vue';
import { initStore } from '@/stores/store-manager';
import { getApiClient } from '@/utils/apiClient';
import AppConfig from '@/constants';
import { loadLocalData } from '@/utils/common-util';
import { CategoryEntityV2 } from '@/api/dto/category.dto';

export default defineComponent({
  name: 'Board',
  components: { BoardDetail, BoardListWrapper, SideBar },
  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);

    const route = useRoute();
    // const categoryInfo = CATEGORY_INFO;
    const curMainTabInfo = ref<CategoryEntityV2>(); // 현재 페이지 메인탭
    // const menuItems = ref<CategoryEntityV2[]>([]); // 사이드바 탭 정보
    // const boardIdx = computed(() => route.query.boardIdx);
    const boardIdx = computed(() => route.params.boardIdx);

    /**
     * Function
     */
    // 현재 탭에 대한 정보를 가져옵니다
    // const getCategoryInfo = async () => {
    //   if (route.params && route.query.type) {
    //     curMainTabInfo.value = categoryInfo.find(v => v.type === (route.params.mainTab as string).toUpperCase());
    //     if (!curMainTabInfo.value) return;
    //     // 사이드바 값 받아오기
    //     menuItems.value = [];
    //     menuItems.value.push(curMainTabInfo.value);
    //   }
    // };
    /**
     * 카테고리 정보 가져오기
     */
    const getCategoryInfo = () => {
      const category = loadLocalData(AppConfig.KEYS.CATEGORY);
      if (category) {
        curMainTabInfo.value = JSON.parse(category).find((v: CategoryEntityV2) => v.categoryCode === (route.params.mainTab as string).toUpperCase());
        if (!curMainTabInfo.value) return;
      } else {
        console.error('category is null');
      }
    };

    /**
     * Watch
     */
    // 메인탭과 쿼리 변경시 데이터 새로 수집
    watch(
      () => route.params.mainTab,
      () => {
        if (route.params.mainTab) {
          getCategoryInfo();
        }
      },
    );

    onMounted(() => {
      getCategoryInfo();
    });

    return { curMainTabInfo, boardIdx };
  },
});
</script>

<template>
  <div class="board-page">
    <section class="board-side-bar-section">
      <side-bar :is-drop-down="false" />
    </section>
    <board-list-wrapper v-if="!boardIdx" :cur-main-tab-info="curMainTabInfo" />
    <board-detail v-else />
  </div>
</template>
