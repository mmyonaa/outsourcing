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
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';

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
    const selectedImage = ref<File | null>(null); // 썸네일 이미지
    const imagePreview = ref<string | null>(null);

    // 카테고리 옵션
    const categoryOptions = [
      { value: TYPE_PERFO_CATEGORY.PERFO, label: '프로그램' },
      { value: TYPE_PERFO_CATEGORY.EDU, label: '교육' },
      { value: TYPE_PERFO_CATEGORY.EVENT, label: '행사' },
    ];

    const goBack = () => {
      router.push('/admin/performance');
    };

    // 썸네일 이미지 선택
    const handleImageSelect = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];

        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB 이하여야 합니다.');
          return;
        }

        selectedImage.value = file;

        const reader = new FileReader();
        reader.onload = e => {
          imagePreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };

    const removeImage = () => {
      selectedImage.value = null;
      imagePreview.value = null;
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
    const uploadFileToS3 = async (file: File): Promise<{ fileUrl: string; fileName: string }> => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiClient.post('/board/upload-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.resultCode === 0 && response.data.data?.fileUrl) {
          return {
            fileUrl: response.data.data.fileUrl,
            fileName: response.data.data.fileName || file.name
          };
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
          const { fileUrl } = await uploadFileToS3(file);
          const range = quillInstance?.getSelection();
          if (range) {
            // 원본 파일명(file.name)을 사용하여 한글 파일명 보존
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

      // BlotFormatter 모듈 등록 (있는 경우에만)
      try {
        if (BlotFormatter) {
          Quill.register('modules/blotFormatter', BlotFormatter);
        }
      } catch (e) {
        console.warn('BlotFormatter 모듈 등록 실패:', e);
      }

      const icons = Quill.import('ui/icons') as Record<string, string>;
      icons['file'] = '<svg viewBox="0 0 18 18"><path class="ql-stroke" d="M9,3V15M3,9H15"></path></svg>';

      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'file'],
        ['clean'],
      ];

      const modules: any = {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            image: imageHandler,
            file: fileHandler,
          },
        },
      };

      // BlotFormatter가 등록되었으면 추가
      try {
        if (Quill.imports['modules/blotFormatter']) {
          modules.blotFormatter = {};
        }
      } catch (e) {
        // 등록 안됨, 무시
      }

      quillInstance = new Quill(editorRef.value, {
        theme: 'snow',
        modules,
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

      // 파일 버튼에 클릭 이벤트 직접 바인딩
      setTimeout(() => {
        const fileButton = document.querySelector('.ql-file');
        if (fileButton) {
          fileButton.addEventListener('click', () => {
            fileHandler();
          });
        }
      }, 100);
    };

    const loadPerfoDetail = async () => {
      const param = new SearchPerfoDto();
      param.perIdx = String(perfoIdx);

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          performance.value = res.data[0];

          // 기존 썸네일 이미지 로드
          if (performance.value.imgUrl) {
            imagePreview.value = performance.value.imgUrl;
          }

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

      try {
        // 1. 새로운 썸네일 이미지가 있으면 S3에 업로드
        if (selectedImage.value) {
          const uploadedUrl = await uploadImageToS3(selectedImage.value);
          performance.value.imgUrl = uploadedUrl;
        }

        // 2. Quill 에디터 내용 저장
        performance.value.body = quillInstance.root.innerHTML;

        // 3. API 호출
        await updatePerfo(apiClient, performance.value).then(res => {
          if (res.resultCode === 0 && res.data) {
            alert('프로그램 수정이 완료되었습니다.');
            router.push('/admin/performance');
          }
        });
      } catch (error) {
        console.error('Update error:', error);
        alert('프로그램 수정에 실패했습니다.');
      }
    };

    const delPerformance = async () => {
      const param = new SearchPerfoDto();
      param.perIdx = String(perfoIdx);

      if (window.confirm('정말 삭제하시겠습니까?')) {
        await deletePerfo(apiClient, param).then(res => {
          if (res.resultCode === 0 && res.data) {
            alert('프로그램 삭제가 완료되었습니다.');
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
      selectedImage,
      imagePreview,
      handleImageSelect,
      removeImage,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page admin">
    <h1>자체 프로그램 수정</h1>
    <div class="notice-detail">
      <!-- 제목 입력 섹션 -->
      <div class="form-section">
        <label class="section-title">제목 <span class="required">*</span></label>
        <input v-model="performance.title" class="notice-input" placeholder="제목을 입력하세요" />
      </div>

      <div class="form-section">
        <label class="section-title">중제목</label>
        <input v-model="performance.titleSec" class="notice-input" placeholder="중제목을 입력하세요" />
      </div>

      <div class="form-section">
        <label class="section-title">소제목</label>
        <input v-model="performance.titleThird" class="notice-input" placeholder="소제목을 입력하세요" />
      </div>

      <!-- 카테고리 선택 -->
      <div class="form-section">
        <label class="section-title">카테고리 <span class="required">*</span></label>
        <select v-model="performance.category" class="notice-input">
          <option value="" disabled>카테고리를 선택하세요</option>
          <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- 썸네일 이미지 업로드 섹션 -->
      <div class="form-section">
        <label class="section-title">썸네일 이미지</label>

        <!-- 이미지 선택 버튼 (이미지가 없을 때만 표시) -->
        <label v-if="!imagePreview" class="image-upload-label">
          <input type="file" accept="image/*" @change="handleImageSelect" style="display: none" />
          <span class="upload-button">📷 이미지 선택</span>
        </label>

        <!-- 이미지 미리보기 -->
        <div v-if="imagePreview" class="image-preview-container">
          <img :src="imagePreview" alt="Preview" class="image-preview" />
          <button class="remove-image-button" @click="removeImage">✕</button>
        </div>
      </div>

      <!-- Quill 에디터 -->
      <div class="form-section">
        <label class="section-title">프로그램 상세 내용 <span class="required">*</span></label>
        <div ref="editorRef" class="quill-editor"></div>
      </div>

      <!-- 버튼 -->
      <div class="back-button-wrapper">
        <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
        <button class="back-button delete" @click="delPerformance">삭제</button>
        <button class="back-button submit" @click="submitPerformance">수정</button>
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

.required {
  color: #e34363;
  margin-left: 2px;
}

/* 이미지 업로드 */
.image-upload-label {
  cursor: pointer;
  display: inline-block;
}

.upload-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-size: 14px;
}

.upload-button:hover {
  background-color: #45a049;
}

.image-preview-container {
  margin-top: 0.75rem;
  position: relative;
  display: inline-block;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remove-image-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.remove-image-button:hover {
  background-color: rgba(255, 0, 0, 1);
}

/* Quill 에디터 */
.quill-editor {
  min-height: 400px;
  background: white;
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
