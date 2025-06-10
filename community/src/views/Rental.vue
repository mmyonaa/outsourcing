<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {  },
  setup() {
    const activeIndex = ref<number>(0)
    const posters = [
    {
      image: '/assets/images/theater/theater-1.JPG',
      description: 'Image 1에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/theater-2.JPG',
      description: 'Image 2에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/theater-3.JPG',
      description: 'Image 3에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/theater-4.JPG',
      description: 'Image 4에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/theater-5.JPG',
      description: 'Image 5에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/theater-6.JPG',
      description: 'Image 6에 대한 설명입니다.',
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
  <div class="page-common rental-page">
    <h1>극장 상세사항</h1>
    <div class="wrapper">
      <img :src="posters[activeIndex].image" class="big-image" />
      <div class="big-image-text">{{ posters[activeIndex].description }}</div>
      <div class="poster-gallery">
        <div
          class="poster"
          v-for="(poster, index) in posters"
          :key="index"
          :class="{ active: activeIndex === index }"
          @click="activeIndex = index"
        >
          <img :src="poster.image" :alt="'Poster ' + (index + 1)" />
        </div>
    </div>
  </div>
  </div>
</template>
