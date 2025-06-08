<script lang="ts">
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Home',
  components: { ApocImageSet, },
  setup() {
    const router=useRouter();
    const activeIndex = ref<number>(0)
    const activeReserveIndex = ref<number>(0)
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

  const notices = [
  {
    id: 1,
    title: '서버 점검 안내 (6월 5일)',
    date: '2025-06-01',
  },
  {
    id: 2,
    title: '신규 기능 업데이트',
    date: '2025-05-28',
  },
  {
    id: 3,
    title: '정책 변경 안내',
    date: '2025-05-20',
  },
  {
    id: 4,
    title: '서비스 개선 안내',
    date: '2025-05-18',
  },
]

    onMounted(() => {
  
    });
    return {
      posters,
      notices,
      activeIndex,
      activeReserveIndex
    };
  },
});
</script>

<template>
  <div class="main-page-wrapper">
  <!-- ✅ 상단 배너 영역 -->
  <section class="home-banner-section">
      <!-- <img
        src="/assets/images/home/banner.jpg"
        alt="Main Banner"
        class="banner-image"
      /> -->
      <div class="banner-text">
        <h2>보광 극장에 오신 것을 환영합니다!</h2>
        <p>다양한 공연과 대관 서비스를 만나보세요.</p>
      </div>
    </section>
  <div class="page-common home-page">
    <section class="home-section-item">
      <div class="title-wrapper">
			 <div class="title">
        <img src="/assets/images/home/performance.png"/>
          역대 공연
       </div>
       <router-link to="/performance">+ more</router-link>
      </div>
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
    </section>
    <section class="home-section-item">
      <div class="title-wrapper">
			 <div class="title">
        <img src="/assets/images/home/ticket.png"/>
          공연 예매
       </div>
       <router-link to="/performance/next">+ more</router-link>
      </div>
      <div class="poster-gallery">
        <div
          class="poster"
          v-for="(poster, index) in posters"
          :key="index"
          :class="{ active: activeReserveIndex === index }"
          @click="activeReserveIndex = index"
        >
          <img :src="poster.image" :alt="'Poster ' + (index + 1)" />
          <div class="description" v-if="activeReserveIndex === index">
            {{ poster.description }}
          </div>
        </div>
      </div>
    </section>
    <section class="home-section-item">
      <div class="title-wrapper">
			 <div class="title">
        <img src="/assets/images/home/notice.png"/>
          공지사항
       </div>
       <router-link to="/notice">+ more</router-link>
      </div>
      <div class="card-grid">
        <router-link
          v-for="notice in notices.slice(0, 3)"
          :key="notice.id"
          :to="`/notice/detail?id=${notice.id}`"
          class="notice-card"
        >
          <div class="title">{{ notice.title }}</div>
          <div class="date">{{ notice.date }}</div>
        </router-link>
      </div>
    </section>
  </div>
</div>
</template>
