<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { BannerEntity, SearchBannerDto } from '@/api/dto/banner.dto';
import { getApiClient } from '@/utils/apiClient';
import { getBannerList, insertBanner, updateBanner, deleteBanner } from '@/api/banner.api';

export default defineComponent({
  name: 'adminBanner',
  components: { EmptyState },
  setup() {
    const apiClient = getApiClient();
    const banners = ref<BannerEntity[]>([]);
    const showModal = ref(false);
    const isEditMode = ref(false);
    const currentBanner = ref<BannerEntity>(new BannerEntity());
    const imageFile = ref<File | null>(null);
    const imagePreview = ref<string>('');

    const loadBanners = async () => {
      const param = new SearchBannerDto();
      // activeYn 필터 없이 모든 배너 가져오기 (백엔드에서 기본 배너 포함)
      await getBannerList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          banners.value = res.data.sort((a, b) => a.displayOrder - b.displayOrder);
        }
      });
    };

    const openCreateModal = () => {
      isEditMode.value = false;
      currentBanner.value = new BannerEntity();
      currentBanner.value.swipeDuration = 5;
      currentBanner.value.displayOrder = banners.value.length;
      imageFile.value = null;
      imagePreview.value = '';
      showModal.value = true;
    };

    const openEditModal = (banner: BannerEntity) => {
      isEditMode.value = true;
      currentBanner.value = { ...banner };
      imageFile.value = null;
      imagePreview.value = banner.imgUrl || '';
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      currentBanner.value = new BannerEntity();
      imageFile.value = null;
      imagePreview.value = '';
    };

    const handleImageSelect = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        imageFile.value = target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
          imagePreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(imageFile.value);
      }
    };

    const uploadImage = async (): Promise<string | null> => {
      if (!imageFile.value) return null;

      // 이미지 파일 유효성 검사
      if (!imageFile.value.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return null;
      }

      if (imageFile.value.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return null;
      }

      const formData = new FormData();
      formData.append('image', imageFile.value);

      try {
        const response = await apiClient.post('/banner/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.resultCode === 0 && response.data.data?.imageUrl) {
          return response.data.data.imageUrl;
        }
        throw new Error('이미지 업로드 실패');
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('이미지 업로드에 실패했습니다.');
        return null;
      }
    };

    const saveBanner = async () => {
      if (imageFile.value) {
        const imageUrl = await uploadImage();
        if (imageUrl) {
          currentBanner.value.imgUrl = imageUrl;
        } else {
          return;
        }
      }

      if (!currentBanner.value.imgUrl && !isEditMode.value) {
        alert('이미지를 선택해주세요.');
        return;
      }

      try {
        if (isEditMode.value) {
          await updateBanner(apiClient, currentBanner.value);
          alert('배너가 수정되었습니다.');
        } else {
          await insertBanner(apiClient, currentBanner.value);
          alert('배너가 등록되었습니다.');
        }
        closeModal();
        loadBanners();
      } catch (error) {
        console.error('Failed to save banner:', error);
        alert('배너 저장에 실패했습니다.');
      }
    };

    const handleDelete = async (banner: BannerEntity) => {
      if (!confirm('정말 삭제하시겠습니까?')) return;

      try {
        await deleteBanner(apiClient, { bannerIdx: banner.bannerIdx });
        alert('배너가 삭제되었습니다.');
        loadBanners();
      } catch (error) {
        console.error('Failed to delete banner:', error);
        alert('배너 삭제에 실패했습니다.');
      }
    };

    const toggleActive = async (banner: BannerEntity) => {
      const updatedBanner = { ...banner };
      updatedBanner.activeYn = banner.activeYn === 'Y' ? 'N' : 'Y';

      try {
        await updateBanner(apiClient, updatedBanner);
        loadBanners();
      } catch (error) {
        console.error('Failed to toggle active status:', error);
        alert('상태 변경에 실패했습니다.');
      }
    };

    onMounted(() => {
      loadBanners();
    });

    return {
      banners,
      showModal,
      isEditMode,
      currentBanner,
      imagePreview,
      loadBanners,
      openCreateModal,
      openEditModal,
      closeModal,
      handleImageSelect,
      saveBanner,
      handleDelete,
      toggleActive,
    };
  },
});
</script>

<template>
  <div class="page-common banner-admin-page">
    <h1>배너 관리</h1>

    <div class="action-wrapper">
      <button class="register-button" @click="openCreateModal">배너 등록</button>
    </div>

    <div v-if="banners.length > 0" class="banner-list">
      <div v-for="banner in banners" :key="banner.bannerIdx" :class="['banner-card', { inactive: banner.activeYn === 'N', 'default-banner-card': banner.isDefault }]">
        <div class="banner-image">
          <div v-if="banner.isDefault" class="default-banner-preview">
            <div class="default-banner-content">
              <h2>보광극장에 오신 것을<br />환영합니다</h2>
              <p>창작과 실험을 응원하는 극장입니다</p>
            </div>
          </div>
          <img v-else :src="banner.imgUrl" alt="Banner" />
          <span :class="['status-badge', banner.activeYn === 'Y' ? 'active' : 'inactive']">
            {{ banner.activeYn === 'Y' ? '활성' : '비활성' }}
          </span>
          <span v-if="banner.isDefault" class="default-badge">기본 배너</span>
        </div>
        <div class="banner-info">
          <div class="banner-meta">
            <span v-if="!banner.isDefault">순서: {{ banner.displayOrder }}</span>
            <span v-else>기본 핑크색 배너</span>
            <span>전환 시간: {{ banner.swipeDuration }}초</span>
          </div>
        </div>
        <div class="banner-actions">
          <button class="btn-toggle" @click="toggleActive(banner)">
            {{ banner.activeYn === 'Y' ? '비활성화' : '활성화' }}
          </button>
          <button v-if="!banner.isDefault" class="btn-edit" @click="openEditModal(banner)">수정</button>
          <button v-if="!banner.isDefault" class="btn-delete" @click="handleDelete(banner)">삭제</button>
        </div>
      </div>
    </div>

    <empty-state v-else message="등록된 배너가 없습니다" />

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditMode ? '배너 수정' : '배너 등록' }}</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>이미지 *</label>
            <p class="image-guide">권장 이미지 사이즈: 1920 x 600px (가로로 긴 형태)</p>
            <input type="file" accept="image/*" @change="handleImageSelect" />
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>전환 시간 (초)</label>
              <input v-model.number="currentBanner.swipeDuration" type="number" min="1" />
            </div>

            <div class="form-group">
              <label>표시 순서</label>
              <input v-model.number="currentBanner.displayOrder" type="number" min="0" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">취소</button>
          <button class="btn-save" @click="saveBanner">{{ isEditMode ? '수정' : '등록' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-wrapper {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.register-button {
  padding: 1rem 2rem;
  background: #736e92;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.register-button:hover {
  background: #5f5a7a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(115, 110, 146, 0.3);
}

.banner-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.banner-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.banner-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.banner-card.inactive {
  opacity: 0.5;
  background: #f5f5f5;
}

.banner-card.inactive .banner-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.banner-image {
  position: relative;
  width: 200px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.banner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: #4caf50;
  color: white;
}

.status-badge.inactive {
  background: #f44336;
  color: white;
}

.default-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: #736e92;
  color: white;
}

.default-banner-preview {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-banner-content {
  text-align: center;
  color: white;
  padding: 1rem;
}

.default-banner-content h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.default-banner-content p {
  font-size: 12px;
  opacity: 0.9;
}

.default-banner-card {
  border: 2px solid #736e92;
}

.banner-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.banner-meta {
  display: flex;
  gap: 1rem;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.banner-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.banner-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-toggle {
  background: #2196f3;
  color: white;
}

.btn-toggle:hover {
  background: #1976d2;
}

.btn-edit {
  background: #ff9800;
  color: white;
}

.btn-edit:hover {
  background: #f57c00;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.form-group input[type='text'],
.form-group input[type='number'],
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input[type='file'] {
  width: 100%;
  padding: 0.5rem;
  font-size: 16px;
}

.image-guide {
  margin: 0 0 0.75rem 0;
  padding: 0.75rem;
  background: #f5f5f5;
  border-left: 3px solid #736e92;
  border-radius: 4px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.image-preview {
  margin-top: 1rem;
  width: 100%;
  max-height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.modal-footer button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #e0e0e0;
  color: #333;
}

.btn-cancel:hover {
  background: #d0d0d0;
}

.btn-save {
  background: #736e92;
  color: white;
}

.btn-save:hover {
  background: #5f5a7a;
}

@media (max-width: 768px) {
  .banner-card {
    flex-direction: column;
  }

  .banner-image {
    width: 100%;
    height: 200px;
  }

  .banner-actions {
    flex-direction: row;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
