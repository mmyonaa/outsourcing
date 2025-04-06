<script lang="ts">
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import AppConfig from '@/constants';

export default defineComponent({
  name: 'ApocPagination',
  components: { ApocImageSet },
  props: {
    totalPageNum: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const PAGES_PER_GROUP = AppConfig.KEYS.PAGING_ROW; // 한 묶음당 노출할 페이지 수
    const currentPage = computed(() => (route.query.pageNo ? Number(route.query.pageNo) : 1));
    const totalPages = computed<number>(() => (props.totalPageNum ? props.totalPageNum : 1));
    const currentGroup = computed(() => Math.ceil(currentPage.value / PAGES_PER_GROUP));
    const lastGroup = computed(() => Math.ceil(totalPages.value / PAGES_PER_GROUP));

    const goToPage = (page: number) => {
      router.push({
        query: { ...route.query, pageNo: page },
      });
    };

    const prevGroup = () => {
      if (currentGroup.value > 1) {
        const newPage = (currentGroup.value - 2) * PAGES_PER_GROUP + 1;
        router.push({
          query: { ...route.query, pageNo: newPage },
        });
      }
    };

    const nextGroup = () => {
      if (currentGroup.value < lastGroup.value) {
        const newPage = currentGroup.value * PAGES_PER_GROUP + 1;
        router.push({
          query: { ...route.query, pageNo: newPage },
        });
      }
    };

    const generatePageNumbers = () => {
      const pageNumbers: number[] = [];
      const startPage = (currentGroup.value - 1) * PAGES_PER_GROUP + 1;
      const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages.value);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      return pageNumbers;
    };

    const prevNum = () => {
      if (currentPage.value > 1) {
        const newPage = currentPage.value - 1;
        router.push({
          query: { ...route.query, pageNo: newPage },
        });
      }
    };
    const nextNum = () => {
      if (currentPage.value < totalPages.value) {
        const newPage = currentPage.value + 1;
        router.push({
          query: { ...route.query, pageNo: newPage },
        });
      }
    };

    return {
      currentPage,
      totalPages,
      PAGES_PER_GROUP,
      currentGroup,
      lastGroup,
      goToPage,
      prevGroup,
      prevNum,
      nextGroup,
      nextNum,
      generatePageNumbers,
    };
  },
});
</script>

<template>
  <!--  <div v-if="totalPages > 1" class="pagination">-->
  <div class="pagination">
    <apoc-image-set
      src="/assets/images/common/icons/left-black-arrow.webp"
      :img-sets="3"
      class="page-number"
      :class="{ noCursor: currentPage === totalPageNum }"
      @click="prevNum" />
    <section class="page-number-section">
      <span v-for="page in generatePageNumbers()" :key="page" :class="{ active: currentPage === page }" class="page-number" @click="goToPage(page)">
        {{ page }}
      </span>
    </section>
    <apoc-image-set
      src="/assets/images/common/icons/right-black-arrow.webp"
      :img-sets="3"
      class="page-number"
      :class="{ noCursor: currentPage === totalPageNum }"
      @click="nextNum" />
  </div>
</template>

<style scoped></style>
