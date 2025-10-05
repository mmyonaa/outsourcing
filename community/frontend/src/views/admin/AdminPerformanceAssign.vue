<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { useRoute, useRouter } from 'vue-router';
import { PerfoEntity } from '@/api/dto/perfo.dto';
import { insertPerfo } from '@/api/perfo.api';
import { apiClient } from '@/utils/apiClient';

export default defineComponent({
  name: 'adminPerformance',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const route = useRoute();
    const router = useRouter();
    const performance = ref<PerfoEntity>(new PerfoEntity());
    const selectedImage = ref<File | null>(null);
    const imagePreview = ref<string | null>(null);

    const goBack = () => {
      router.push('/performance') // 공연 목록 페이지 경로
    }

    const handleImageSelect = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];

        // 이미지 파일 검증
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }

        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB 이하여야 합니다.');
          return;
        }

        selectedImage.value = file;

        // 이미지 미리보기
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };

    const removeImage = () => {
      selectedImage.value = null;
      imagePreview.value = null;
    };

    const submitNotice = async () => {
      try {
        // 제목과 내용 검증
        if (!performance.value.title || !performance.value.body) {
          alert('제목과 내용을 입력해주세요.');
          return;
        }

        // FormData 생성
        const formData = new FormData();
        formData.append('title', performance.value.title);
        formData.append('body', performance.value.body);

        if (selectedImage.value) {
          formData.append('image', selectedImage.value);
        }

        // API 호출
        const response = await apiClient.post('/perfo/insertperfo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.resultCode === 0) {
          alert('공연이 성공적으로 등록되었습니다.');
          router.push('/performance');
        } else {
          alert('공연 등록에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error submitting performance:', error);
        alert('공연 등록 중 오류가 발생했습니다.');
      }
    };

    onMounted(() => {
      performance.value.body = '';
    });

    return {
      performance,
      totalPage,
      submitNotice,
      goBack,
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
    <h1>역대 공연 등록</h1>
    <div class="notice-detail">
      <input
        v-model="performance.title"
        class="notice-input"
        placeholder="제목을 입력하세요"
      />

      <!-- 이미지 업로드 섹션 -->
      <div class="image-upload-section">
        <label class="image-upload-label">
          <input
            type="file"
            accept="image/*"
            @change="handleImageSelect"
            style="display: none"
          />
          <span class="upload-button">📷 이미지 선택</span>
        </label>

        <!-- 이미지 미리보기 -->
        <div v-if="imagePreview" class="image-preview-container">
          <img :src="imagePreview" alt="Preview" class="image-preview" />
          <button class="remove-image-button" @click="removeImage">✕ 삭제</button>
        </div>
      </div>

      <textarea
        v-model="performance.body"
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

<style scoped>
.image-upload-section {
  margin: 20px 0;
}

.image-upload-label {
  cursor: pointer;
}

.upload-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #45a049;
}

.image-preview-container {
  margin-top: 15px;
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
  transition: background-color 0.3s;
}

.remove-image-button:hover {
  background-color: rgba(255, 0, 0, 1);
}
</style>