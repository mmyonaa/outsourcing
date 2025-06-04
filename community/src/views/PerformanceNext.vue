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
      description: 'Poster 1에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: 'Poster 2에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: 'Poster 3에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: 'Poster 4에 대한 설명입니다.',
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
    <h1>예정 공연</h1>
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
