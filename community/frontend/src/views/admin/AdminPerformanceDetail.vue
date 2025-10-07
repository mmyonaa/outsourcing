<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { useRoute, useRouter } from 'vue-router';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { deletePerfo, getPerfoList, updatePerfo } from '@/api/perfo.api';
import { getApiClient } from '@/utils/apiClient';
import { TYPE_PERFO_CATEGORY } from '@/types';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default defineComponent({
  name: 'adminPerformanceDetail',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0);
    const route = useRoute();
    const router = useRouter();
    const performance = ref<PerfoEntity>(new PerfoEntity());
    const apiClient = getApiClient();
    const perfoIdx = route.query.id;
    const editorRef = ref<HTMLElement | null>(null);
    let quillInstance: Quill | null = null;

    // 카테고리 옵션
    const categoryOptions = [
      { value: TYPE_PERFO_CATEGORY.A, label: '카테고리 A' },
      { value: TYPE_PERFO_CATEGORY.B, label: '카테고리 B' },
      { value: TYPE_PERFO_CATEGORY.C, label: '카테고리 C' },
    ];

    const goBack = () => {
      router.push('/admin/performance');
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

        if (response.data.resultCode === 0 && response.data.data?.imageUrl) {
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

        if (response.data.resultCode === 0 && response.data.data?.fileUrl) {
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

      const icons = Quill.import('ui/icons') as Record<string, string>;
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

      // 기존 내용을 Quill에 로드
      if (performance.value.body) {
        quillInstance.root.innerHTML = performance.value.body;
      }

      // 콘텐츠 변경 시 performance.body 업데이트
      quillInstance.on('text-change', () => {
        performance.value.body = quillInstance?.root.innerHTML || '';
      });
    };

    const loadPerfoDetail = async () => {
      const param = new SearchPerfoDto();
      param.perIdx = String(perfoIdx);

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          performance.value = res.data[0];

          // 데이터 로드 후 Quill 에디터 초기화
          initQuillEditor();
        }
      });
    };

    const submitPerformance = async () => {
      if (!performance.value.title || !performance.value.title.trim()) {
        alert('제목을 입력하세요.');
        return;
      }

      if (!performance.value.category) {
        alert('카테고리를 선택하세요.');
        return;
      }

      if (!quillInstance || !quillInstance.getText().trim()) {
        alert('내용을 입력하세요.');
        return;
      }

      performance.value.body = quillInstance.root.innerHTML;

      await updatePerfo(apiClient, performance.value).then(res => {
        if (res.resultCode === 0 && res.data) {
          alert('공연 수정이 완료되었습니다.');
          router.push('/admin/performance');
        }
      });
    };

    const delPerformance = async () => {
      const param = new SearchPerfoDto();
      param.perIdx = String(perfoIdx);

      if (window.confirm('정말 삭제하시겠습니까?')) {
        await deletePerfo(apiClient, param).then(res => {
          if (res.resultCode === 0 && res.data) {
            alert('공연 삭제가 완료되었습니다.');
            router.push('/admin/performance');
          }
        });
      }
    };

    onMounted(() => {
      loadPerfoDetail();
    });

    return {
      performance,
      totalPage,
      editorRef,
      submitPerformance,
      goBack,
      delPerformance,
      categoryOptions,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page admin">
    <h1>역대 공연 수정</h1>
    <div class="notice-detail">
      <input v-model="performance.title" class="notice-input" placeholder="제목을 입력하세요" />

      <!-- 카테고리 선택 -->
      <div class="category-section">
        <label class="section-title">카테고리</label>
        <select v-model="performance.category" class="category-select">
          <option value="" disabled>카테고리를 선택하세요</option>
          <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Quill 에디터 -->
      <div ref="editorRef" class="quill-editor"></div>

      <!-- 🔽 버튼 -->
      <div class="back-button-wrapper">
        <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
        <button class="back-button" @click="delPerformance">삭제</button>
        <button class="back-button" @click="submitPerformance">수정</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-title {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: #333;
}

.category-section {
  margin: 20px 0;
}

.category-select {
  width: 100%;
  padding: 12px 15px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s;
  font-family: 'Pretendard', sans-serif;
}

.category-select:focus {
  outline: none;
  border-color: #4caf50;
}

.category-select:hover {
  border-color: #999;
}

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

:deep(.ql-editor a) {
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
}

:deep(.ql-editor a:hover) {
  color: #0052a3;
}
</style>
