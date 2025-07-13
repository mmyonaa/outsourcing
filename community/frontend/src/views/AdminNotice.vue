<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { useRoute, useRouter } from 'vue-router';
import { BoardEntity } from '@/api/dto/board.dto';

export default defineComponent({
  name: 'adminNotice',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const route = useRoute();
    const router = useRouter();
    const notice = ref<BoardEntity>(new BoardEntity())

    const goBack = () => {
      router.push('/notice') // 공지 목록 페이지 경로
    }

    const submitNotice = () => {
      // TODO
    }

    onMounted(() => {
      notice.value.body = ''
      
    });
    return {
      notice,
      totalPage,
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