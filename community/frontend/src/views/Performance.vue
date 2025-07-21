<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'performance',
  components: {  },
  setup() {

  const activeIndex = ref<number>(0)

  const posters = [
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: '사이트 준비 중입니다',
    },
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: '사이트 준비 중입니다',
    },
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: '사이트 준비 중입니다',
    },
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: '사이트 준비 중입니다',
    },
  ]

    onMounted(() => {
  
    });
    return {
      posters,
      activeIndex
    };
  },
});
</script>

<template>
  <div class="page-common introduce-page">
    <h1>역대 공연</h1>
    <div class="wrapper">
    <div class="poster-gallery">
    <div
      class="poster"
      v-for="(poster, index) in posters"
      :key="index"
      :class="{ active: activeIndex === index }"
      @click="activeIndex = index"
    >
      <img :src="poster.image" :alt="'Poster ' + (index + 1)" />
      <div class="description" v-if="activeIndex === index">
        {{ poster.description }}
      </div>
    </div>
  </div>
  </div>
</div>
</template>