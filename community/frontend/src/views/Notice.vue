<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getApiClient } from '@/utils/apiClient';
import { getBoardList } from '@/api/board.api';

export default defineComponent({
  name: 'Home',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const apiClient = getApiClient();
    const notices = ref<BoardEntity[]>([])

    const loadBoardLit = async() => {
      const param = new SearchBoardDto();

      await getBoardList(apiClient, param)
      .then((res)=>{
        if(res.resultCode === 0 && res.data){
          console.log(res.data)
        }
      })
    }

    onMounted(() => {
        loadBoardLit();
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
      :key="notice.boardIdx"
    >
      <!-- 데스크탑 행 -->
      <div class="row-content desktop-only">
        <div class="col index">{{ index + 1 }}</div>
        
        <div class="col title">
          <router-link
          v-for="notice in notices.slice(0, 3)"
          :key="notice.boardIdx"
          :to="`/notice/detail?id=${notice.boardIdx}`"
          class="notice-card"
        >{{ notice.title }}</router-link></div>
        <div class="col views">{{ notice.views }}</div>
        <div class="col author">{{ notice.author }}</div>
        <div class="col date">{{ notice.regDt }}</div>
      </div>

      <!-- 모바일 카드 -->
      <div class="mobile-only mobile-card">
        <div class="title">{{ notice.title }}</div>
        <div class="meta">
          <span>{{ notice.author }}</span> ·
          <span>{{ notice.regDt }}</span> ·
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