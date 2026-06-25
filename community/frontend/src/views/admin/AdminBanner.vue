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
/* 관리자 액센트 컬러 (다른 admin 페이지와 통일) */
.banner-admin-page {
  --accent: #736e92;
  --accent-dark: #5f5a7a;
  --accent-soft: #f3f2f8;
  --line: #ececf1;
}

.action-wrapper {
  display: flex;
  justify-content: flex-end;
  margin: 1.5rem 0 2rem;
}

.register-button {
  padding: 0.85rem 1.75rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.register-button:hover {
  background: var(--accent-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(115, 110, 146, 0.3);
}

.register-button:active {
  transform: translateY(0);
}

.banner-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.banner-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: white;
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.banner-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.banner-card.inactive {
  opacity: 0.65;
  background: #fafafa;
}

.banner-card.inactive .banner-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  pointer-events: none;
}

.banner-image {
  position: relative;
  width: 220px;
  height: 124px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f1f4;
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
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  backdrop-filter: blur(2px);
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.92);
  color: white;
}

.status-badge.inactive {
  background: rgba(120, 120, 130, 0.9);
  color: white;
}

.default-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: var(--accent);
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
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 0.4rem;
  line-height: 1.4;
}

.default-banner-content p {
  font-size: 11px;
  opacity: 0.9;
}

.default-banner-card {
  border: 1.5px solid var(--accent);
  background: var(--accent-soft);
}

.banner-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  min-width: 0;
}

.banner-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.banner-meta span {
  display: inline-flex;
  align-items: center;
}

.banner-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.banner-actions button {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  background: #fff;
}

/* 액션 버튼: 평소엔 연한 톤 + 컬러 글자, 호버 시 채움 */
.btn-toggle {
  border-color: #cdd9ee;
  background: #eef3fc;
  color: #2563eb;
}

.btn-toggle:hover {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.btn-edit {
  border-color: #f0dcc2;
  background: #fbf3e8;
  color: #c77700;
}

.btn-edit:hover {
  background: #e08a00;
  color: white;
  border-color: #e08a00;
}

.btn-delete {
  border-color: #f3cfcf;
  background: #fdeeee;
  color: #d12f2f;
}

.btn-delete:hover {
  background: #d12f2f;
  color: white;
  border-color: #d12f2f;
}

/* ── 모달 ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 18, 30, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  animation: overlay-in 0.18s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
  animation: modal-in 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-in {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--line);
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #2a2733;
}

.close-btn {
  background: none;
  border: none;
  font-size: 26px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  color: #999;
  line-height: 1;
  transition: all 0.15s ease;
}

.close-btn:hover {
  color: #333;
  background: #f1f1f4;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.65rem;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.form-group input[type='text'],
.form-group input[type='number'] {
  width: 100%;
  padding: 0.7rem 0.85rem;
  border: 1px solid #dcdce2;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(115, 110, 146, 0.15);
}

.form-group input[type='file'] {
  width: 100%;
  font-size: 14px;
  color: #666;
}

.form-group input[type='file']::file-selector-button {
  margin-right: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--accent);
  border-radius: 8px;
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.form-group input[type='file']::file-selector-button:hover {
  background: var(--accent);
  color: white;
}

.image-guide {
  margin: 0 0 1rem 0;
  padding: 0.75rem 0.95rem;
  background: var(--accent-soft);
  border-left: 3px solid var(--accent);
  border-radius: 6px;
  font-size: 13px;
  color: #5a5570;
  font-weight: 500;
  line-height: 1.5;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.image-preview {
  margin-top: 1rem;
  width: 100%;
  aspect-ratio: 16 / 6;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  background: #f1f1f4;
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
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--line);
}

.modal-footer button {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 9px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
}

.btn-cancel {
  background: #eeeef1;
  color: #444;
}

.btn-cancel:hover {
  background: #e2e2e7;
}

.btn-save {
  background: var(--accent);
  color: white;
}

.btn-save:hover {
  background: var(--accent-dark);
  box-shadow: 0 4px 12px rgba(115, 110, 146, 0.3);
}

@media (max-width: 768px) {
  .banner-card {
    flex-direction: column;
    align-items: stretch;
  }

  .banner-image {
    width: 100%;
    height: 180px;
  }

  .banner-actions {
    flex-direction: row;
  }

  .banner-actions button {
    flex: 1;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
