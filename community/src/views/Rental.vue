<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {  },
  setup() {

    onMounted(() => {
  
    });
    return {
    };
  },
});
</script>

<template>
  <div class="home-page">
    <section class="search-section">
      <search />
    </section>
    <section class="tutorial-section">
      <tutorial />
    </section>
    <section class="news-section">
      <news />
    </section>
    <div class="popular-section">
      <popular />
    </div>
    <div class="notice-section">
      <notice />
    </div>
    <div class="instagram-section">
    </div>
  </div>
</template>
