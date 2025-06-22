<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { ref, computed } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {  },
  setup() {

const today = new Date()
const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())

const weekDays = ['일', '월', '화', '수', '목', '금', '토']

const getCalendarDays = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  const prevMonthLastDay = new Date(year, month, 0)

  const startDay = firstDayOfMonth.getDay()
  const endDay = lastDayOfMonth.getDate()

  const calendar = []

  // 이전 달 날짜 채우기
  for (let i = startDay - 1; i >= 0; i--) {
    calendar.push({
      date: new Date(year, month - 1, prevMonthLastDay.getDate() - i),
      currentMonth: false,
    })
  }

  // 현재 달 날짜
  for (let i = 1; i <= endDay; i++) {
    calendar.push({
      date: new Date(year, month, i),
      currentMonth: true,
    })
  }

  // 다음 달 날짜 채우기 (42칸 유지)
  while (calendar.length < 42) {
    const nextDate = calendar.length - (startDay + endDay) + 1
    calendar.push({
      date: new Date(year, month + 1, nextDate),
      currentMonth: false,
    })
  }

  return calendar
}

const calendarDays = computed(() => getCalendarDays(currentDate.value))

const goToPrevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const goToNextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

    onMounted(() => {
  
    });
    return {
      goToPrevMonth,
      currentYear,
      goToNextMonth,
      currentMonth,
      weekDays,
      calendarDays
    };
  },
});
</script>

<template>
  <div class="page-common rental-page">
    <h1>대관 스케줄</h1>
    <div class="calendar">
    <div class="calendar-header">
      <button @click="goToPrevMonth">&lt;</button>
      <h2>{{ currentYear }}년 {{ currentMonth + 1 }}월</h2>
      <button @click="goToNextMonth">&gt;</button>
    </div>

    <div class="calendar-grid">
      <div class="day-name" v-for="day in weekDays" :key="day">{{ day }}</div>
      <div
        class="day-cell"
        v-for="(day, index) in calendarDays"
        :key="index"
        :class="{ 'not-current-month': !day.currentMonth }"
      >
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</div>
</template>
