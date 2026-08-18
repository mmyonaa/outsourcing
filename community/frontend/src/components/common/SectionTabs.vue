<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

interface SectionTab {
  label: string;
  to: string;
}

// 섹션별 하위 페이지 탭. 현재 경로가 속한 그룹을 자동으로 골라 렌더링한다.
const TAB_GROUPS: SectionTab[][] = [
  [
    { label: '극장 소개', to: '/introduce' },
    { label: '단체 소개', to: '/introduce/org' },
    { label: '오시는 길', to: '/introduce/route' },
  ],
  [
    { label: '자체 프로그램', to: '/performance' },
    { label: '대관 프로그램', to: '/performance/next' },
  ],
  [
    { label: '공간 안내', to: '/rental' },
    { label: '대관 일정', to: '/rental/schedule' },
    { label: '대관 신청', to: '/rental/info' },
  ],
  [
    { label: '공지사항', to: '/notice' },
    { label: '보도자료', to: '/news' },
  ],
];

export default defineComponent({
  name: 'SectionTabs',
  setup() {
    const route = useRoute();

    const tabs = computed(() => TAB_GROUPS.find(group => group.some(tab => tab.to === route.path)) || null);

    const isActive = (tab: SectionTab) => tab.to === route.path;

    return { tabs, isActive };
  },
});
</script>

<template>
  <nav v-if="tabs" class="section-tabs" aria-label="섹션 하위 메뉴">
    <router-link v-for="tab in tabs" :key="tab.to" :to="tab.to" class="section-tab" :class="{ active: isActive(tab) }">
      {{ tab.label }}
    </router-link>
  </nav>
</template>

<style scoped>
.section-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 0 auto 3rem;
  font-family: 'Pretendard', sans-serif;
}

.section-tab {
  display: inline-flex;
  align-items: center;
  padding: 0.85rem 1.8rem;
  border: 1.5px solid #e6e6e6;
  border-radius: 999px;
  background: #fff;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
}

.section-tab:hover {
  border-color: #e34363;
  color: #e34363;
}

.section-tab.active {
  border-color: #e34363;
  background: #e34363;
  color: #fff;
}

@media (max-width: 480px) {
  .section-tab {
    padding: 0.8rem 1.4rem;
    font-size: 13px;
  }
}
</style>
