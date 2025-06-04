<script lang="ts">
import News from '@/components/home/News.vue';
import Notice from '@/components/home/Notice.vue';
import Popular from '@/components/home/Popular.vue';
import Search from '@/components/home/Search.vue';
import Tutorial from '@/components/home/Tutorial.vue';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'Home',
  components: { Notice, Popular, Tutorial, Search, News },
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
  </div>
</template>
