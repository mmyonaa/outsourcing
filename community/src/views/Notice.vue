<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';

export default defineComponent({
  name: 'Home',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const notices = [
      {
        id: 1,
        title: '서버 점검 안내 (6월 5일)',
        views: 152,
        author: '관리자',
        date: '2025-06-01',
      },
      {
        id: 2,
        title: '신규 기능 업데이트',
        views: 98,
        author: '운영팀',
        date: '2025-05-28',
      },
      {
        id: 3,
        title: '정책 변경 안내',
        views: 212,
        author: '관리자',
        date: '2025-05-20',
      },
    ]

    onMounted(() => {
  
    });
    return {
      notices,
      totalPage
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>공지사항</h1>
    <div class="notice-list">
    <!-- 데스크탑용 테이블 -->
    <div class="notice-header desktop-only">
      <div class="col index">#</div>
      <div class="col title">제목</div>
      <div class="col views">조회수</div>
      <div class="col author">작성자</div>
      <div class="col date">작성일</div>
    </div>

    <div
      class="notice-row"
      v-for="(notice, index) in notices"
      :key="notice.id"
    >
      <!-- 데스크탑 행 -->
      <div class="row-content desktop-only">
        <div class="col index">{{ index + 1 }}</div>
        
        <div class="col title">
          <router-link
          v-for="notice in notices.slice(0, 3)"
          :key="notice.id"
          :to="`/notice/detail?id=${notice.id}`"
          class="notice-card"
        >{{ notice.title }}</router-link></div>
        <div class="col views">{{ notice.views }}</div>
        <div class="col author">{{ notice.author }}</div>
        <div class="col date">{{ notice.date }}</div>
      </div>

      <!-- 모바일 카드 -->
      <div class="mobile-only mobile-card">
        <div class="title">{{ notice.title }}</div>
        <div class="meta">
          <span>{{ notice.author }}</span> ·
          <span>{{ notice.date }}</span> ·
          <span>조회수 {{ notice.views }}</span>
        </div>
      </div>
    </div>
    </div>
    <section class="pagination-section">
        <apoc-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>