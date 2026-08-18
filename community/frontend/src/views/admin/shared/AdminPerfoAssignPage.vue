<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getApiClient } from '@/utils/apiClient';
import { insertPerfoForm } from '@/api/perfo.api';
import { TYPE_PERFO_CATEGORY } from '@/types';
import QuillEditor from '@/components/admin/QuillEditor.vue';

/**
 * 자체/대관 프로그램 등록 공용 페이지.
 * AdminPerformanceAssign / AdminPerformanceNextAssign 이 타입·문구만 다른 복붙이어서 통합.
 */
export default defineComponent({
  name: 'adminPerfoAssignPage',
  components: { QuillEditor },
  props: {
    /** TYPE_PERFO 값 (NORMAL/NEXT) */
    perType: { type: String, required: true },
    /** 목록 경로 (예: '/admin/performance') */
    listPath: { type: String, required: true },
    /** h1 제목 (예: '자체 프로그램 등록') */
    title: { type: String, required: true },
  },
  setup(props) {
    const router = useRouter();
    const performance = ref({
      title: '',
      titleSec: '',
      titleThird: '',
      category: '',
    });
    const selectedImage = ref<File | null>(null); // 썸네일 이미지
    const imagePreview = ref<string | null>(null);
    const apiClient = getApiClient();
    const editorRef = ref<InstanceType<typeof QuillEditor> | null>(null);

    // 카테고리 옵션
    const categoryOptions = [
      { value: TYPE_PERFO_CATEGORY.PERFO, label: '프로그램' },
      { value: TYPE_PERFO_CATEGORY.EDU, label: '교육' },
      { value: TYPE_PERFO_CATEGORY.EVENT, label: '행사' },
    ];

    const goBack = () => {
      router.push(props.listPath);
    };

    const handleImageSelect = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];

        // 이미지 파일 검증
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }

        // 파일 크기 제한 (20MB)
        if (file.size > 20 * 1024 * 1024) {
          alert('파일 크기는 20MB 이하여야 합니다.');
          return;
        }

        selectedImage.value = file;

        // 이미지 미리보기
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

    // S3에 썸네일 이미지 업로드
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

    const submitNotice = async () => {
      if (!performance.value.title || !performance.value.title.trim()) {
        alert('제목을 입력하세요.');
        return;
      }

      if (!performance.value.category) {
        alert('카테고리를 선택하세요.');
        return;
      }

      const editor = editorRef.value;
      if (!editor || !editor.getText().trim()) {
        alert('내용을 입력하세요.');
        return;
      }

      if (!selectedImage.value) {
        alert('썸네일 이미지를 선택해주세요.');
        return;
      }

      try {
        // Upload thumbnail to S3 first
        let thumbnailUrl = '';
        if (selectedImage.value) {
          thumbnailUrl = await uploadImageToS3(selectedImage.value);
        }

        const formData = new FormData();
        formData.append('title', performance.value.title || '');
        formData.append('titleSec', performance.value.titleSec || '');
        formData.append('titleThird', performance.value.titleThird || '');
        formData.append('category', performance.value.category || '');
        formData.append('body', editor.getHTML());
        formData.append('imgUrl', thumbnailUrl);
        formData.append('perType', props.perType);
        formData.append('author', '관리자');

        const res = await insertPerfoForm(apiClient, formData);

        if (res.resultCode === 0) {
          alert('프로그램이 성공적으로 등록되었습니다.');
          router.push(props.listPath);
        } else {
          alert('프로그램 등록에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error submitting performance:', error);
        alert('프로그램 등록 중 오류가 발생했습니다.');
      }
    };

    return {
      performance,
      submitNotice,
      goBack,
      selectedImage,
      imagePreview,
      handleImageSelect,
      removeImage,
      editorRef,
      categoryOptions,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page admin">
    <h1>{{ title }}</h1>
    <div class="notice-detail">
      <!-- 제목 입력 섹션 -->
      <div class="form-section">
        <label class="section-title">제목 <span class="required">*</span></label>
        <input v-model="performance.title" class="notice-input" placeholder="제목을 입력하세요" />
      </div>

      <div class="form-section">
        <label class="section-title">중제목</label>
        <input v-model="performance.titleSec" class="notice-input" placeholder="중제목 — 공연 기간 권장 (예: 2025.07.19-07.27)" />
      </div>

      <div class="form-section">
        <label class="section-title">소제목</label>
        <input v-model="performance.titleThird" class="notice-input" placeholder="소제목을 입력하세요" />
      </div>

      <!-- 카테고리 선택 -->
      <div class="form-section">
        <label class="section-title">카테고리 <span class="required">*</span></label>
        <select v-model="performance.category" class="notice-input">
          <option value="" disabled selected>카테고리를 선택하세요</option>
          <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- 썸네일 이미지 업로드 섹션 -->
      <div class="form-section">
        <label class="section-title">썸네일 이미지 <span class="required">*</span></label>

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
        <quill-editor ref="editorRef" with-blot-formatter />
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
</style>
