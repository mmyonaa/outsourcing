<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { useRoute, useRouter } from 'vue-router';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getBoardList } from '@/api/board.api';
import moment from 'moment';
import { getApiClient } from '@/utils/apiClient';

export default defineComponent({
  name: 'noticeDetail',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const route = useRoute();
    const router = useRouter();
    const noticeIdx = route.query.id
    const notice = ref<BoardEntity>(new BoardEntity())
    const apiClient = getApiClient();

    const goBack = () => {
      router.push('/notice') // 공지 목록 페이지 경로
    }

    const loadBoardDetail = async() => {
      const param = new SearchBoardDto();
      param.boardIdx = String(noticeIdx);
      
      await getBoardList(apiClient, param)
      .then((res)=>{
        if(res.resultCode === 0 && res.data){
          notice.value = res.data[0]
        }
      })
    }

    onMounted(() => {
      loadBoardDetail();
    });
    return {
      notice,
      totalPage,
      moment,
      goBack
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>공지사항 상세</h1>
    <div class="notice-detail">
    <div class="notice-title"># {{ notice.title}}</div>

    <div class="notice-meta">
      <span>작성자: {{ notice.author }}</span>
      <span>작성일: {{ moment(notice.regDt).format('YY.MM.DD') }}</span>
      <span>조회수: {{ notice.views }}</span>
    </div>
    <div class="notice-content" v-html="notice.body"></div>

    <!-- 🔽 돌아가기 버튼 -->
    <div class="back-button-wrapper">
      <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
    </div>
  </div>
  </div>
</template>