<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { useRoute, useRouter } from 'vue-router';
import { BoardEntity } from '@/api/dto/board.dto';

export default defineComponent({
  name: 'noticeDetail',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const route = useRoute();
    const router = useRouter();
    const noticeIdx = route.query.id
    const notice = ref<BoardEntity>(new BoardEntity())

    const goBack = () => {
      router.push('/notice') // 공지 목록 페이지 경로
    }

    onMounted(() => {
      notice.value.body = 'bodybodybodybodybodybody'
      
    });
    return {
      notice,
      totalPage,
      goBack
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>공지사항 상세</h1>
    <div class="notice-detail">
    <h1 class="notice-title">{{ 'title'}}</h1>

    <div class="notice-meta">
      <span>작성자: {{ 'author' }}</span>
      <span>작성일: {{ 'date' }}</span>
      <span>조회수: {{ 'views' }}</span>
    </div>
    <div class="notice-content" v-html="notice.body"></div>

    <!-- 🔽 돌아가기 버튼 -->
    <div class="back-button-wrapper">
      <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
    </div>
  </div>
  </div>
</template>