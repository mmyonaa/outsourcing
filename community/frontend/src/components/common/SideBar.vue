<script lang="ts">
import ApocDropDown from '@/components/common/ApocDropDown.vue';
import AppConfig from '@/constants';
import { loadLocalData } from '@/utils/common-util';
import { type PropType, computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'SideBar',
  components: { ApocDropDown },
  props: {
    type: {
      type: String as PropType<string>,
      required: false,
    },
    // menuList: {
    //   type: Array as PropType<CategoryInterface[]>,
    //   required: true,
    //   default: () => [],
    // },
    isDropDown: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const categoryList = ref<CategoryEntityV2[]>();
    const compType = computed(() => route.query.type);
    const lang = ref<string>('');

    const onClickSubMenu = (main: CategoryEntityV2, subMenu: ICategory) => {
      const name = route.name !== 'Mypage' ? 'Board' : 'Mypage';
      router.push({
        name,
        params: {
          mainTab: (main.categoryCode as string).toLowerCase(),
        },
        query: {
          type: subMenu.categoryCode,
        },
      });
    };

    return {
      onClickSubMenu,
      compType,
      categoryList,
      lang,
    };
  },
});
</script>

<template>
  <div class="side-bar-wrapper">
    <ul class="side-menu-list">
      <li class="menu-item" v-for="(menu, index1) in categoryList" :key="index1">
        <div class="default-menu-list" v-if="!isDropDown">
          <div class="top-menu-title title">{{ lang === 'ko' ? menu.categoryKrName : menu.categoryEnName}}</div>
          <div
            v-for="(subMenu, subIndex) in menu.subTab"
            :key="subIndex"
            class="sub-menu-title title"
            :class="{ active: subMenu.categoryCode === compType }"
            @click="onClickSubMenu(menu, subMenu)">
            <div>{{ lang === 'ko' ? subMenu.categoryKrName : subMenu.categoryEnName }}</div>
          </div>
        </div>
        <div class="drop-down-list" v-else>
          <apoc-drop-down :options="menu" @on-click-sub-menu="onClickSubMenu" />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
