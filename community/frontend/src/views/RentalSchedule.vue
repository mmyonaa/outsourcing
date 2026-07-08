<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RentalSchedule',
  setup() {
    // 구글 캘린더 ID를 여기에 설정합니다
    // 설정 방법은 google-calendar-setup.md 참조
    const CALENDAR_ID = 'bokwangtheater@gmail.com';

    return {
      CALENDAR_ID,
    };
  },
});
</script>

<template>
  <div class="page-common rental-page">
    <h1>대관 스케줄</h1>

    <div class="google-calendar-container">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=bokwangtheater%40gmail.com&ctz=Asia%2FSeoul"

        width="100%"
        height="600"
        frameborder="0"
        scrolling="no"></iframe>
    </div>
  </div>
</template>

<style scoped>
.rental-page {
  font-family: 'Pretendard', sans-serif;
}

.calendar-notice {
  text-align: center;
  margin: 2rem auto 3rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  max-width: 800px;
}

.calendar-notice p {
  margin: 0.5rem 0;
  font-size: 16px;
  color: #333;
}

.calendar-notice a {
  color: #e34363;
  font-weight: 600;
  text-decoration: none;
}

.calendar-notice a:hover {
  text-decoration: underline;
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

.calendar-guide {
  max-width: 800px;
  margin: 0 auto 3rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.calendar-guide h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e34363;
}

.calendar-guide ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.calendar-guide li {
  font-size: 15px;
  color: #555;
  padding: 0.75rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.calendar-guide li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #e34363;
  font-size: 20px;
}

@media (max-width: 768px) {
  .google-calendar-container {
    margin: 0 1rem 2rem;
  }

  .calendar-notice,
  .calendar-guide {
    margin: 0 1rem 2rem;
  }

  .google-calendar-container iframe {
    height: 500px;
  }
}
</style>
