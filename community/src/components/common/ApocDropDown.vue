<script lang="ts">
import { computed, defineComponent, onMounted, type PropType, ref, watch } from 'vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import { useRoute } from 'vue-router';
import { CategoryEntityV2, ICategory } from '@/api/dto/category.dto';

export default defineComponent({
  name: 'ApocDropDown',
  components: { ApocImageSet },
  props: {
    //   options: {
    //     type: Object as PropType<any>,
    //     required: true,
    //   },
    options: {
      type: Object as PropType<CategoryEntityV2>,
      required: true,
    },
  },
  emits: ['onClickSubMenu'],
  setup(props, ctx) {
    const isBodyOpen = ref<boolean>(false);
    const { emit } = ctx;
    const route = useRoute();
    const mainTab = computed(() => (route.params.mainTab as string)?.toUpperCase());
    const borderBottom = ref<boolean>(true);

    const onClickOpenSubMenu = () => {
      isBodyOpen.value = !isBodyOpen.value;
    };

    const onClickSubMenu = (main: CategoryEntityV2, subMenu: ICategory, index: number) => {
      if (index === (props.options.subTab?.length as number) - 1) {
        borderBottom.value = false;
      } else {
        borderBottom.value = true;
      }
      emit('onClickSubMenu', main, subMenu);
    };

    // onMounted(() => {
    // if (route.params.mainTab && props.options.type && route.params.mainTab === props.options.type.toLowerCase()) {
    //   isBodyOpen.value = true;
    // }
    // });

    watch(
      () => mainTab.value,
      () => {
        if (mainTab.value !== props.options.categoryCode) {
          borderBottom.value = true;
        }
      },
    );

    return {
      isBodyOpen,
      route,
      borderBottom,
      onClickOpenSubMenu,
      onClickSubMenu,
    };
  },
});
</script>

<template>
  <div class="apoc-drop-down" :class="{ 'none-border-bottom': !borderBottom && isBodyOpen }">
    <div class="drop-down-title" @click="onClickOpenSubMenu">
      <div class="title">{{ options.categoryKrName }}</div>
      <apoc-image-set
        v-if="options.subTab"
        class="arrow-down"
        :class="{ 'is-open': isBodyOpen }"
        src="/assets/images/common/icons/arrow-down-icon.webp"
        alt="arrow-down"
        :img-sets="3" />
    </div>
    <Transition name="dropdown">
      <div class="drop-down-body" v-if="isBodyOpen && options.subTab">
        <div
          class="sub-menu-item"
          @click="onClickSubMenu(options, subMenu, index)"
          v-for="(subMenu, index) in options.subTab"
          :key="index"
          :class="{ active: subMenu.categoryCode === route.query.type }">
          {{ subMenu.categoryKrName }}
        </div>
      </div>
    </Transition>
  </div>
  <!--  <div class="apoc-drop-down">-->
  <!--    <div class="drop-down-title" @click="onClickOpenSubMenu">-->
  <!--      <div class="title">{{ options.title }}</div>-->
  <!--      <apoc-image-set-->
  <!--        v-if="options.subItems"-->
  <!--        class="arrow-down"-->
  <!--        :class="{ 'is-open': isBodyOpen }"-->
  <!--        src="/assets/images/common/icons/arrow-down-icon.webp"-->
  <!--        alt="arrow-down"-->
  <!--        :img-sets="3" />-->
  <!--    </div>-->
  <!--    <Transition name="dropdown">-->
  <!--      <div class="drop-down-body" v-if="isBodyOpen && options.subItems">-->
  <!--        <div-->
  <!--          class="sub-menu-item"-->
  <!--          @click="onClickSubMenu(options, subMenu)"-->
  <!--          v-for="(subMenu, index) in options.subItems"-->
  <!--          :key="index"-->
  <!--          :class="{ active: subMenu.type === route.query.type }">-->
  <!--          {{ subMenu.title }}-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </Transition>-->
  <!--  </div>-->
</template>

<style scoped></style>
