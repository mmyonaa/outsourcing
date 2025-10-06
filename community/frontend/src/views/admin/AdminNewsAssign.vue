<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { useRoute, useRouter } from 'vue-router';
import { BoardEntity } from '@/api/dto/board.dto';
import { getApiClient } from '@/utils/apiClient';
import { insertBoard } from '@/api/board.api';
import { STATE_YN } from '@/types';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default defineComponent({
  name: 'adminNewsAssign',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const route = useRoute();
    const router = useRouter();
    const notice = ref<BoardEntity>(new BoardEntity());
    const apiClient = getApiClient();
    const bestValue = ref<boolean>(false);
    const editorRef = ref<HTMLElement | null>(null);
    let quillInstance: Quill | null = null;

    const goBack = () => {
      router.push('/admin/notice'); // 공지 목록 페이지 경로
    };

    // S3에 이미지 업로드
    const uploadImageToS3 = async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await apiClient.post('/board/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.resultCode === 0 && response.data.data) {
          return response.data.data.imageUrl;
        }
        throw new Error('이미지 업로드 실패');
      } catch (error) {
        console.error('Image upload error:', error);
        alert('이미지 업로드에 실패했습니다.');
        throw error;
      }
    };

    // S3에 파일 업로드
    const uploadFileToS3 = async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiClient.post('/board/upload-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.resultCode === 0 && response.data.data) {
          return response.data.data.fileUrl;
        }
        throw new Error('파일 업로드 실패');
      } catch (error) {
        console.error('File upload error:', error);
        alert('파일 업로드에 실패했습니다.');
        throw error;
      }
    };

    // Quill 이미지 핸들러
    const imageHandler = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB 이하여야 합니다.');
          return;
        }

        try {
          const imageUrl = await uploadImageToS3(file);
          const range = quillInstance?.getSelection();
          if (range) {
            quillInstance?.insertEmbed(range.index, 'image', imageUrl);
            quillInstance?.setSelection(range.index + 1, 0);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
    };

    // 파일 첨부 핸들러
    const fileHandler = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
          alert('파일 크기는 10MB 이하여야 합니다.');
          return;
        }

        try {
          const fileUrl = await uploadFileToS3(file);
          const range = quillInstance?.getSelection();
          if (range) {
            // 파일 링크를 텍스트로 삽입
            quillInstance?.insertText(range.index, file.name, 'link', fileUrl);
            quillInstance?.setSelection(range.index + file.name.length, 0);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
    };

    // Quill 에디터 초기화
    const initQuillEditor = () => {
      if (!editorRef.value) return;

      // 커스텀 파일 첨부 버튼 추가
      const icons = Quill.import('ui/icons');
      icons['file'] = '<svg viewBox="0 0 18 18"><path class="ql-stroke" d="M9,3V15M3,9H15"></path></svg>';

      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image', 'file'],
        ['clean'],
      ];

      quillInstance = new Quill(editorRef.value, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: imageHandler,
              file: fileHandler,
            },
          },
        },
        placeholder: '내용을 입력하세요...',
      });

      // 콘텐츠 변경 시 notice.body 업데이트
      quillInstance.on('text-change', () => {
        notice.value.body = quillInstance?.root.innerHTML || '';
      });
    };

    const submitNotice = async () => {
      if (!notice.value.title.trim()) {
        alert('제목을 입력하세요.');
        return;
      }

      if (!quillInstance || !quillInstance.getText().trim()) {
        alert('내용을 입력하세요.');
        return;
      }

      notice.value.body = quillInstance.root.innerHTML;
      notice.value.bestYn = bestValue.value ? STATE_YN.Y : STATE_YN.N;

      await insertBoard(apiClient, notice.value).then(res => {
        if (res.resultCode === 0 && res.data) {
          alert('보도자료 등록이 완료되었습니다.');
          router.push('/admin/notice');
        }
      });
    };

    onMounted(() => {
      notice.value.body = '';
      initQuillEditor();
    });

    return {
      notice,
      totalPage,
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
    <h1>보도자료 등록</h1>
    <div class="notice-detail">
      <label class="checkbox"> <input type="checkbox" v-model="bestValue" /> 중요 보도자료 여부 </label>
      <input v-model="notice.title" class="notice-input" placeholder="제목을 입력하세요" />

      <!-- Quill 에디터 -->
      <div ref="editorRef" class="quill-editor"></div>

      <!-- 🔽 등록 버튼 -->
      <div class="back-button-wrapper">
        <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
        <button class="back-button" @click="submitNotice">등록</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quill-editor {
  min-height: 400px;
  background: white;
  margin-bottom: 20px;
}

:deep(.ql-toolbar) {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px 4px 0 0;
  padding: 12px;
}

/* 툴바 버튼 크기 증가 */
:deep(.ql-toolbar button) {
  width: 32px !important;
  height: 32px !important;
  padding: 4px !important;
}

:deep(.ql-toolbar .ql-picker) {
  height: 32px !important;
}

:deep(.ql-toolbar .ql-picker-label) {
  height: 32px !important;
  line-height: 32px !important;
  padding: 0 8px !important;
}

/* 아이콘 크기 증가 */
:deep(.ql-toolbar button svg) {
  width: 20px !important;
  height: 20px !important;
}

:deep(.ql-toolbar .ql-stroke) {
  stroke-width: 2 !important;
}

:deep(.ql-toolbar .ql-fill) {
  fill: currentColor !important;
}

:deep(.ql-container) {
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  font-size: 16px;
  min-height: 400px;
}

:deep(.ql-editor) {
  min-height: 400px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
}

:deep(.ql-editor.ql-blank::before) {
  color: #999;
  font-style: normal;
}

/* 링크 스타일 */
:deep(.ql-editor a) {
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
}

:deep(.ql-editor a:hover) {
  color: #0052a3;
}
</style>
