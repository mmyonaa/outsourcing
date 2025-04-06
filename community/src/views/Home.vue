<script lang="ts">
import { CategoryEntityV2 } from '@/api/dto/category.dto';
import Instagram from '@/components/home/Instagram.vue';
import News from '@/components/home/News.vue';
import Notice from '@/components/home/Notice.vue';
import Popular from '@/components/home/Popular.vue';
import Search from '@/components/home/Search.vue';
import Tutorial from '@/components/home/Tutorial.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { getFirstImageSrc, setOpenGraph, setSeoMeta } from '@/utils/common-util';
import AppConfig from '@/constants';

export default defineComponent({
  name: 'Home',
  components: { Instagram, Notice, Popular, Tutorial, Search, News },
  setup() {
    const count = 0;
    const categoryList = ref<CategoryEntityV2[]>();

    fetch('https://www.famppy.com/famppy-data/run.yaml', { credentials: 'omit' }).then(async res => {
      const runStat = await res.text();
      if (Number(runStat ?? 0) < 1) {
        window.location.href = 'https://opening.apoc.day';
        // const oIp = '112.158.249.33';
        // fetch('https://api.ipify.org?format=json').then(async res => {
        // 	const ipResult = await res.json();
        // 	if (ipResult.ip !== oIp) {
        // 		window.location.href = 'https://opening.apoc.day';
        // 	}
        // });
      }
    });

    // /**
    //  * 카테고리 정보 가져오기
    //  */
    // const getCategoryInfo = () => {
    //   const category = loadLocalData(AppConfig.KEYS.CATEGORY);
    //   if (category) categoryList.value = JSON.parse(category);
    //   else {
    //     console.error('category is null');
    //   }
    // };
    //
    onMounted(() => {
      setSeoMeta('APOC COMMUNITY', 'Interactive XR content platform that empowers world to bridge the experiential gap in Metaverse');
      setOpenGraph('APOC COMMUNITY', '');
    });
    return {
      count,
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
      <instagram />
    </div>
  </div>
</template>
