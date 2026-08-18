<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import SectionTabs from '@/components/common/SectionTabs.vue';

export default defineComponent({
  name: 'RentalSchedule',
  components: { SectionTabs },
  setup() {
    // 구글 캘린더 ID를 여기에 설정합니다
    // 설정 방법은 google-calendar-setup.md 참조
    const CALENDAR_ID = 'bokwangtheater@gmail.com';

    // 모바일에서는 월(Month) 뷰가 좁아 일정 라벨이 잘리므로 일정 목록(AGENDA) 뷰로 전환
    const isMobile = ref(false);
    const updateIsMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    const calendarSrc = computed(() => {
      const base = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=Asia%2FSeoul`;
      return isMobile.value ? `${base}&mode=AGENDA` : base;
    });

    onMounted(() => {
      updateIsMobile();
      window.addEventListener('resize', updateIsMobile);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', updateIsMobile);
    });

    return {
      CALENDAR_ID,
      calendarSrc,
    };
  },
});
</script>

<template>
  <div class="page-common rental-page">
    <h1>대관 스케줄</h1>
    <section-tabs />

    <div class="google-calendar-container">
      <iframe :src="calendarSrc" width="100%" height="600" frameborder="0" scrolling="no"></iframe>
    </div>

    <!-- 스케줄 확인 → 대관 신청 유도 -->
    <div class="schedule-cta">
      <p>원하시는 날짜가 비어 있나요?</p>
      <router-link to="/rental/info" class="schedule-cta-btn">대관 신청 안내 바로가기 →</router-link>
    </div>
  </div>
</template>

<style scoped>
.rental-page {
  font-family: 'Pretendard', sans-serif;
}

.google-calendar-container {
  width: 100%;
  margin: 0 auto 3rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-calendar-container iframe {
  display: block;
  border-radius: 12px;
}

.schedule-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  margin: 0 auto 4rem;
  padding: 2.5rem 2rem;
  background: #fdf3f5;
  border-radius: 12px;
  max-width: 800px;
}

.schedule-cta p {
  font-size: 16px;
  color: #555;
}

.schedule-cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 1.1rem 2.4rem;
  border-radius: 999px;
  background: #e34363;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.18s ease, transform 0.18s ease;
}

.schedule-cta-btn:hover {
  background: #c93753;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .google-calendar-container {
    margin: 0 1rem 2rem;
  }

  .schedule-cta {
    margin: 0 1rem 3rem;
  }

  .google-calendar-container iframe {
    height: 500px;
  }
}
</style>
