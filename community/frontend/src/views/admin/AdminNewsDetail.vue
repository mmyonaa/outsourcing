<script lang="ts">
import { deleteBoard, getBoardList, updateBoard } from '@/api/board.api';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { STATE_YN } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'adminNewsDetail',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const route = useRoute();
    const router = useRouter();
    const notice = ref<BoardEntity>(new BoardEntity());
    const apiClient = getApiClient();
    const bestValue = ref<boolean>(false);
    const noticeIdx = route.query.id;

    const goBack = () => {
      router.push('/admin/notice'); // 공지 목록 페이지 경로
    };

    const loadBoardDetail = async () => {
      const param = new SearchBoardDto();
      param.boardIdx = String(noticeIdx);

      await getBoardList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          notice.value = res.data[0];
          bestValue.value = notice.value.bestYn === STATE_YN.Y ? true : false;
        }
      });
    };

    const submitNotice = async () => {
      notice.value.bestYn = bestValue.value ? STATE_YN.Y : STATE_YN.N;
      await updateBoard(apiClient, notice.value).then(res => {
        if (res.resultCode === 0 && res.data) {
          alert('보도자료 수정이 완료되었습니다.');
          router.push('/admin/news');
        }
      });
    };

    const delNotice = async () => {
      const param = new SearchBoardDto();
      param.boardIdx = String(noticeIdx);

      if (window.confirm('정말 삭제하시겠습니까?')) {
        await deleteBoard(apiClient, param).then(res => {
          if (res.resultCode === 0 && res.data) {
            alert('보도자료 삭제가 완료되었습니다.');
            router.push('/admin/news');
          }
        });
      }
    };

    onMounted(() => {
      loadBoardDetail();
    });
    return {
      notice,
      totalPage,
      bestValue,
      submitNotice,
      goBack,
      delNotice,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page admin">
    <h1>보도자료 수정</h1>
    <div class="notice-detail">
      <label class="checkbox"> <input type="checkbox" v-model="bestValue" /> 중요 보도자료 여부 </label>
      <input v-model="notice.title" class="notice-input" placeholder="제목을 입력하세요" />
      <textarea v-model="notice.body" class="notice-textarea" placeholder="내용을 입력하세요"></textarea>

      <!-- 🔽 등록 버튼 -->
      <div class="back-button-wrapper">
        <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
        <button class="back-button" @click="delNotice">삭제</button>
        <button class="back-button" @click="submitNotice">수정</button>
      </div>
    </div>
  </div>
</template>
