<script lang="ts">
import { CategoryEntityV2, ICategory } from '@/api/dto/category.dto';
import ApocDropDown from '@/components/common/ApocDropDown.vue';
import AppConfig from '@/constants';
import { loadLocalData } from '@/utils/common-util';
import { type PropType, computed, defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
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
    const { t } = useI18n({ useScope: 'global' });
    const lang = ref<string>('');

    // const onClickSubMenu = (main: CategoryInterface, subItem: CategorySubInterface) => {
    //   const name = route.name !== 'Mypage' ? 'Board' : 'Mypage';
    //   router.push({
    //     name,
    //     params: {
    //       mainTab: (main.type as string).toLowerCase(),
    //     },
    //     query: {
    //       type: subItem.type,
    //     },
    //   });
    // };
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
    /**
     * 카테고리 정보 가져오기
     */
    const getCategoryInfo = () => {
      const category = loadLocalData(AppConfig.KEYS.CATEGORY);
      if (category) {
        if (!props.isDropDown) {
          categoryList.value = JSON.parse(category)?.filter(
            (item: CategoryEntityV2) => route.params.mainTab && item.categoryCode === (route.params.mainTab as string).toUpperCase(),
          );
        } else {
          categoryList.value = JSON.parse(category);
        }
      }
    };

    onMounted(() => {
      getCategoryInfo();
      lang.value = loadLocalData(AppConfig.KEYS.LANG) as string;
    });
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
      <!--      <li class="menu-item" v-for="(menu, index1) in menuList" :key="index1">-->
      <!--        <div class="default-menu-list" v-if="!isDropDown">-->
      <!--          <div class="top-menu-title title">{{ menu.title }}</div>-->
      <!--          <div-->
      <!--            v-for="(subMenu, subIndex) in menu.subItems"-->
      <!--            :key="subIndex"-->
      <!--            class="sub-menu-title title"-->
      <!--            :class="{ active: subMenu.type === compType }"-->
      <!--            @click="onClickSubMenu(menu, subMenu)">-->
      <!--            <div>{{ subMenu.title }}</div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="drop-down-list" v-else>-->
      <!--          <apoc-drop-down :options="menu" @on-click-sub-menu="onClickSubMenu" />-->
      <!--        </div>-->
      <!--      </li>-->
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
