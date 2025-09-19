<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { useRoute, useRouter } from 'vue-router';
import { BoardEntity } from '@/api/dto/board.dto';
import { getApiClient } from '@/utils/apiClient';
import { insertBoard } from '@/api/board.api';
import { STATE_YN } from '@/types';

export default defineComponent({
  name: 'adminNoticeAssign',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const route = useRoute();
    const router = useRouter();
    const notice = ref<BoardEntity>(new BoardEntity())
    const apiClient = getApiClient();
    const bestValue = ref<boolean>(false)

    const goBack = () => {
      router.push('/admin/notice') // 공지 목록 페이지 경로
    }

    const submitNotice = async () => {
      notice.value.bestYn = bestValue ? STATE_YN.Y : STATE_YN.N;
      await insertBoard(apiClient, notice.value)
      .then((res)=>{
        if(res.resultCode === 0 && res.data){
          alert('공지 등록이 완료되었습니다.')
        }
      })
    }

    onMounted(() => {
      notice.value.body = ''
      
    });
    return {
      notice,
      totalPage,
      bestValue,
      submitNotice,
      goBack
    };
  },
});
</script>

<template>
  <div class="page-common notice-page admin">
    <h1>공지사항 등록</h1>
    <div class="notice-detail">
      <label class="checkbox">
        <input type="checkbox" v-model="bestValue" /> 중요 공지 여부
      </label>
      <input
        v-model="notice.title"
        class="notice-input"
        placeholder="제목을 입력하세요"
      />
      <textarea
        v-model="notice.body"
        class="notice-textarea"
        placeholder="내용을 입력하세요"
      ></textarea>

      <!-- 🔽 등록 버튼 -->
      <div class="back-button-wrapper">
        <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
        <button class="back-button" @click="submitNotice">등록</button>
      </div>
    </div>
  </div>
</template>