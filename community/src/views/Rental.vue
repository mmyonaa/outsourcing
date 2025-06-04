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
    },
    {
      image: '/assets/images/theater/theater-2.JPG',
    },
    {
      image: '/assets/images/theater/theater-3.JPG',
    },
    {
      image: '/assets/images/theater/theater-4.JPG',
    },
    {
      image: '/assets/images/theater/theater-5.JPG',
    },
    {
      image: '/assets/images/theater/theater-6.JPG',
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
