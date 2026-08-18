<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { deleteBoard, getBoardList, updateBoard } from '@/api/board.api';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { STATE_YN } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import QuillEditor from '@/components/admin/QuillEditor.vue';

/**
 * 공지사항/보도자료 수정 공용 페이지.
 * AdminNewsDetail / AdminNoticeDetail 이 문구·경로만 다른 복붙이어서 통합.
 */
export default defineComponent({
  name: 'adminBoardEditPage',
  components: { QuillEditor },
  props: {
    /** 목록 경로 (예: '/admin/news') */
    listPath: { type: String, required: true },
    /** h1 제목 (예: '보도자료 수정') */
    title: { type: String, required: true },
    /** 체크박스 라벨 (예: '중요 보도자료 여부') */
    checkboxLabel: { type: String, required: true },
    /** 완료 문구의 항목 명칭 (예: '보도자료'/'공지') */
    msgLabel: { type: String, required: true },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const notice = ref<BoardEntity>(new BoardEntity());
    const apiClient = getApiClient();
    const bestValue = ref<boolean>(false);
    const noticeIdx = route.query.id;
    const editorRef = ref<InstanceType<typeof QuillEditor> | null>(null);

    const goBack = () => {
      router.push(props.listPath);
    };

    const loadBoardDetail = async () => {
      // id 누락·잘못된 id·삭제된 글은 편집 화면을 띄우지 않고 목록으로 돌려보낸다
      if (!noticeIdx) {
        alert('글을 찾을 수 없습니다.');
        goBack();
        return;
      }

      const param = new SearchBoardDto();
      param.boardIdx = String(noticeIdx);

      await getBoardList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data && res.data.length > 0) {
            notice.value = res.data[0];
            bestValue.value = notice.value.bestYn === STATE_YN.Y ? true : false;

            // 데이터 로드 후 기존 본문을 에디터에 반영
            if (notice.value.body) {
              editorRef.value?.setHTML(notice.value.body);
            }
          } else {
            alert('글을 찾을 수 없습니다. 삭제되었거나 잘못된 주소일 수 있습니다.');
            goBack();
          }
        })
        .catch(e => {
          console.error(e);
          alert('글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
          goBack();
        });
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

      notice.value.body = editor.getHTML();
      notice.value.bestYn = bestValue.value ? STATE_YN.Y : STATE_YN.N;

      // 실패 시에도 반드시 사용자에게 알린다 — 무반응이면 저장된 줄 알고
      // 이탈해 작성 내용을 잃을 수 있다
      await updateBoard(apiClient, notice.value)
        .then(res => {
          if (res.resultCode === 0 && res.data) {
            alert(`${props.msgLabel} 수정이 완료되었습니다.`);
            router.push(props.listPath);
          } else {
            alert('수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          }
        })
        .catch(e => {
          console.error(e);
          alert('수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        });
    };

    const delNotice = async () => {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        await deleteBoard(apiClient, { boardIdx: String(noticeIdx) })
          .then(res => {
            if (res.resultCode === 0 && res.data) {
              alert(`${props.msgLabel} 삭제가 완료되었습니다.`);
              router.push(props.listPath);
            } else {
              alert('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
            }
          })
          .catch(e => {
            console.error(e);
            alert('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          });
      }
    };

    onMounted(() => {
      loadBoardDetail();
    });

    return {
      notice,
      bestValue,
      editorRef,
      submitNotice,
      goBack,
      delNotice,
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
        <button class="back-button delete" @click="delNotice">삭제</button>
        <button class="back-button submit" @click="submitNotice">수정</button>
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
