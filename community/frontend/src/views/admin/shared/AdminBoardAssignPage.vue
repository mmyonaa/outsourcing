<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BoardEntity } from '@/api/dto/board.dto';
import { getApiClient } from '@/utils/apiClient';
import { insertBoard } from '@/api/board.api';
import { STATE_YN } from '@/types';
import QuillEditor from '@/components/admin/QuillEditor.vue';

/**
 * 공지사항/보도자료 등록 공용 페이지.
 * AdminNewsAssign / AdminNoticeAssign 이 문구·타입만 다른 복붙이어서 통합.
 */
export default defineComponent({
  name: 'adminBoardAssignPage',
  components: { QuillEditor },
  props: {
    /** TYPE_BOARD 값 (NORMAL/NEWS) */
    boardType: { type: String, required: true },
    /** 목록 경로 (예: '/admin/news') */
    listPath: { type: String, required: true },
    /** h1 제목 (예: '보도자료 등록') */
    title: { type: String, required: true },
    /** 체크박스 라벨 (예: '중요 보도자료 여부') */
    checkboxLabel: { type: String, required: true },
    /** 완료 문구의 항목 명칭 (예: '보도자료'/'공지') */
    msgLabel: { type: String, required: true },
  },
  setup(props) {
    const router = useRouter();
    const notice = ref<BoardEntity>(new BoardEntity());
    const apiClient = getApiClient();
    const bestValue = ref<boolean>(false);
    const editorRef = ref<InstanceType<typeof QuillEditor> | null>(null);

    const goBack = () => {
      router.push(props.listPath);
    };

    const submitNotice = async () => {
      if (!notice.value.title || !notice.value.title.trim()) {
        alert('제목을 입력하세요.');
        return;
      }

      const editor = editorRef.value;
      if (!editor || !editor.getText().trim()) {
        alert('내용을 입력하세요.');
        return;
      }

      notice.value.boardType = props.boardType;
      notice.value.body = editor.getHTML();
      notice.value.bestYn = bestValue.value ? STATE_YN.Y : STATE_YN.N;

      // 실패 시에도 반드시 사용자에게 알린다 — 무반응이면 저장된 줄 알고
      // 이탈해 작성 내용을 잃을 수 있다
      await insertBoard(apiClient, notice.value)
        .then(res => {
          if (res.resultCode === 0 && res.data) {
            alert(`${props.msgLabel} 등록이 완료되었습니다.`);
            router.push(props.listPath);
          } else {
            alert('등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          }
        })
        .catch(e => {
          console.error(e);
          alert('등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        });
    };

    return {
      notice,
      bestValue,
      editorRef,
      submitNotice,
      goBack,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page admin">
    <h1>{{ title }}</h1>
    <div class="notice-detail">
      <!-- 중요 글 여부 -->
      <div class="form-section">
        <label class="checkbox">
          <input type="checkbox" v-model="bestValue" /> {{ checkboxLabel }}
        </label>
      </div>

      <!-- 제목 -->
      <div class="form-section">
        <label class="section-title">제목</label>
        <input v-model="notice.title" class="notice-input" placeholder="제목을 입력하세요" />
      </div>

      <!-- Quill 에디터 -->
      <div class="form-section">
        <label class="section-title">내용</label>
        <quill-editor ref="editorRef" />
      </div>

      <!-- 버튼 -->
      <div class="back-button-wrapper">
        <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
        <button class="back-button submit" @click="submitNotice">등록</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 폼 섹션 공통 스타일 */
.form-section {
  margin-bottom: 1.5rem;
}

.form-section:last-of-type {
  margin-bottom: 2rem;
}

/* 라벨 스타일 */
.section-title {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 0.5rem;
  color: #333;
}

/* 체크박스 */
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.checkbox input[type='checkbox'] {
  cursor: pointer;
}
</style>
