<script lang="ts">
import { getBoardList } from '@/api/board.api';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getPerfoList } from '@/api/perfo.api';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getBannerList } from '@/api/banner.api';
import { BannerEntity, SearchBannerDto } from '@/api/dto/banner.dto';
import BaseImageSet from '@/components/common/BaseImageSet.vue';
import { getApiClient } from '@/utils/apiClient';
import { defineComponent, onMounted, onUnmounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { TYPE_BOARD, TYPE_PERFO, TYPE_PERFO_CATEGORY } from '@/types';

export default defineComponent({
  name: 'Home',
  components: { BaseImageSet },
  setup() {
    const router = useRouter();
    const apiClient = getApiClient();
    const notices = ref<BoardEntity[]>([]);
    const normalPerformances = ref<PerfoEntity[]>([]);
    const nextPerformances = ref<PerfoEntity[]>([]);
    const normalLoading = ref<boolean>(true);
    const nextLoading = ref<boolean>(true);
    const banners = ref<BannerEntity[]>([]);
    const currentBannerIndex = ref<number>(0);
    let bannerIntervalId: ReturnType<typeof setInterval> | null = null;

    // 전체 배너 개수
    const totalBannerCount = computed(() => banners.value.length);

    // 현재 배너
    const currentBanner = computed(() => banners.value[currentBannerIndex.value]);

    const loadBanners = async () => {
      const param = new SearchBannerDto();
      param.activeYn = 'Y';

      await getBannerList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data) {
            // 활성화된 배너만 가져오기 (기본 배너 포함)
            banners.value = res.data.sort((a, b) => a.displayOrder - b.displayOrder);
            // 항상 자동 슬라이드 시작
            startBannerAutoSlide();
          }
        })
        .catch(err => {
          console.error('Failed to load banners:', err);
        });
    };

    const startBannerAutoSlide = () => {
      if (bannerIntervalId) {
        clearInterval(bannerIntervalId);
      }

      if (totalBannerCount.value > 1) {
        // 현재 배너의 전환 시간 사용
        const duration = currentBanner.value?.swipeDuration || 5;

        bannerIntervalId = setInterval(() => {
          nextBanner();
        }, duration * 1000);
      }
    };

    const nextBanner = () => {
      currentBannerIndex.value = (currentBannerIndex.value + 1) % totalBannerCount.value;
      startBannerAutoSlide();
    };

    const prevBanner = () => {
      currentBannerIndex.value = currentBannerIndex.value === 0 ? totalBannerCount.value - 1 : currentBannerIndex.value - 1;
      startBannerAutoSlide();
    };

    const goToBanner = (index: number) => {
      currentBannerIndex.value = index;
      startBannerAutoSlide();
    };

    const loadNormalPerformances = async () => {
      const param = new SearchPerfoDto();
      param.perType = TYPE_PERFO.NORMAL;

      normalLoading.value = true;
      await getPerfoList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data) {
            normalPerformances.value = res.data.slice(0, 6);
          }
        })
        .finally(() => {
          normalLoading.value = false;
        });
    };

    const loadNextPerformances = async () => {
      const param = new SearchPerfoDto();
      param.perType = TYPE_PERFO.NEXT;

      nextLoading.value = true;
      await getPerfoList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data) {
            nextPerformances.value = res.data.slice(0, 4);
          }
        })
        .finally(() => {
          nextLoading.value = false;
        });
    };

    const loadBoardList = async () => {
      const param = new SearchBoardDto();
      param.boardType = TYPE_BOARD.NORMAL;
      param.rows = 3; // 홈에는 3건만 노출

      await getBoardList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          notices.value = res.data;
        }
      });
    };

    const onClickRental = () => {
      router.push('/rental/info');
    };

    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      target.onerror = null; // 기본 썸네일마저 깨질 때 에러 루프 방지
      target.src = '/assets/images/common/default-thumbnail.svg';
    };

    // 배너에 마우스를 올리는 동안 자동 슬라이드 일시정지 (접근성: 움직임 제어 수단 제공)
    const pauseBannerAutoSlide = () => {
      if (bannerIntervalId) {
        clearInterval(bannerIntervalId);
        bannerIntervalId = null;
      }
    };

    const getCategoryLabel = (category: string | undefined) => {
      switch (category) {
        case TYPE_PERFO_CATEGORY.PERFO:
          return '공연';
        case TYPE_PERFO_CATEGORY.EDU:
          return '교육';
        case TYPE_PERFO_CATEGORY.EVENT:
          return '행사';
        default:
          return '';
      }
    };

    onMounted(() => {
      loadBanners();
      loadBoardList();
      loadNormalPerformances();
      loadNextPerformances();
    });

    onUnmounted(() => {
      if (bannerIntervalId) {
        clearInterval(bannerIntervalId);
      }
    });

    return {
      notices,
      normalPerformances,
      nextPerformances,
      normalLoading,
      nextLoading,
      banners,
      currentBannerIndex,
      totalBannerCount,
      currentBanner,
      dayjs,
      onClickRental,
      handleImageError,
      getCategoryLabel,
      nextBanner,
      prevBanner,
      goToBanner,
      pauseBannerAutoSlide,
      startBannerAutoSlide,
      TYPE_PERFO_CATEGORY,
    };
  },
});
</script>

<template>
  <div class="main-page-wrapper">
    <section class="home-banner-section" aria-label="홈 배너">
      <div class="banner-slider" @mouseenter="pauseBannerAutoSlide" @mouseleave="startBannerAutoSlide">
        <transition name="fade" mode="out-in">
          <div v-if="currentBanner" :key="currentBannerIndex" class="banner-slide" :class="{ 'default-banner': currentBanner.isDefault }">
            <!-- 기본 텍스트 배너 -->
            <div v-if="currentBanner.isDefault" class="banner-text">
              <h2>보광극장에 오신 것을<br />환영합니다</h2>
              <p>창작과 실험을 응원하는 극장입니다</p>
            </div>
            <!-- 이미지 배너 -->
            <img v-else :src="currentBanner.imgUrl" alt="Banner" class="banner-image" @error="handleImageError" />
          </div>
        </transition>

        <button v-if="totalBannerCount > 1" class="banner-nav prev" aria-label="이전 배너" @click="prevBanner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button v-if="totalBannerCount > 1" class="banner-nav next" aria-label="다음 배너" @click="nextBanner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div v-if="totalBannerCount > 1" class="banner-indicators">
          <button
            v-for="index in totalBannerCount"
            :key="index - 1"
            :class="['indicator', { active: index - 1 === currentBannerIndex }]"
            :aria-label="`${index}번째 배너로 이동`"
            :aria-current="index - 1 === currentBannerIndex"
            @click="goToBanner(index - 1)"></button>
        </div>
      </div>
    </section>
    <div class="page-common home-page">
      <section v-reveal class="home-section-item">
        <div class="title-wrapper">
          <div class="title">
            <img src="/assets/images/home/ticket.png" />
            자체 프로그램
          </div>
          <router-link to="/performance">더보기 +</router-link>
        </div>
        <div v-if="normalLoading" class="poster-gallery rental">
          <div v-for="n in 4" :key="`sk-n-${n}`" class="poster">
            <div class="poster-image"><span class="skeleton" style="display:block;width:100%;height:100%"></span></div>
            <div class="poster-content">
              <div class="category-tag-wrapper">
                <span class="skeleton" style="width: 44px; height: 24px; border-radius: 999px; flex-shrink: 0"></span>
                <span class="skeleton" style="flex: 1; height: 16px; border-radius: 5px"></span>
              </div>
              <span class="skeleton" style="width: 65%; height: 14px; border-radius: 5px"></span>
            </div>
          </div>
        </div>
        <div v-else-if="normalPerformances.length > 0" class="poster-gallery rental">
          <router-link
            v-for="performance in normalPerformances"
            :key="performance.perIdx"
            :to="`/performance/${performance.perIdx}`"
            class="poster">
            <div class="poster-image">
              <img loading="lazy" :src="performance.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="performance.title" @error="handleImageError" />
            </div>
            <div class="poster-content">
              <div class="category-tag-wrapper">
                <span v-if="performance.category" class="category-tag" :class="`category-${performance.category.toLowerCase()}`">
                  {{ getCategoryLabel(performance.category) }}
                </span>
                <h3 class="poster-title">{{ performance.title }}</h3>
              </div>
              <div v-if="performance.titleSec" class="poster-subtitle">{{ performance.titleSec }}</div>
              <div v-if="performance.titleThird" class="poster-subtitle-small">{{ performance.titleThird }}</div>
            </div>
          </router-link>
        </div>
        <div v-else class="empty-message">등록된 프로그램이 없습니다</div>
      </section>
      <section v-reveal class="home-section-item">
        <div class="title-wrapper">
          <div class="title">
            <img src="/assets/images/home/theater.png" />
            대관 프로그램
          </div>
          <router-link to="/performance/next">더보기 +</router-link>
        </div>
        <div v-if="nextLoading" class="poster-gallery text">
          <div v-for="n in 4" :key="`sk-x-${n}`" class="poster">
            <div class="poster-image"><span class="skeleton" style="display:block;width:100%;height:100%"></span></div>
            <div class="poster-content">
              <div class="category-tag-wrapper">
                <span class="skeleton" style="width: 44px; height: 24px; border-radius: 999px; flex-shrink: 0"></span>
                <span class="skeleton" style="flex: 1; height: 16px; border-radius: 5px"></span>
              </div>
              <span class="skeleton" style="width: 65%; height: 14px; border-radius: 5px"></span>
            </div>
          </div>
        </div>
        <div v-else-if="nextPerformances.length > 0" class="poster-gallery text">
          <router-link
            v-for="performance in nextPerformances"
            :key="performance.perIdx"
            :to="`/performance/next/${performance.perIdx}`"
            class="poster">
            <div class="poster-image">
              <img loading="lazy" :src="performance.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="performance.title" @error="handleImageError" />
            </div>
            <div class="poster-content">
              <div class="category-tag-wrapper">
                <span v-if="performance.category" class="category-tag" :class="`category-${performance.category.toLowerCase()}`">
                  {{ getCategoryLabel(performance.category) }}
                </span>
                <h3 class="poster-title">{{ performance.title }}</h3>
              </div>
              <div v-if="performance.titleSec" class="poster-subtitle">{{ performance.titleSec }}</div>
              <div v-if="performance.titleThird" class="poster-subtitle-small">{{ performance.titleThird }}</div>
            </div>
          </router-link>
        </div>
        <div v-else class="empty-message">등록된 프로그램이 없습니다</div>
      </section>
      <section v-reveal class="home-section-item">
        <div class="title-wrapper">
          <div class="title">
            <img src="/assets/images/home/notice.png" />
            알림
          </div>
          <router-link to="/notice">더보기 +</router-link>
        </div>
        <div class="card-grid">
          <router-link v-for="notice in notices.slice(0, 3)" :key="notice.boardIdx" :to="`/notice/${notice.boardIdx}`" class="notice-card">
            <div class="title">{{ notice.title }}</div>
            <div class="date">{{ dayjs(notice.regDt).format('YY.MM.DD') }}</div>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-banner-section {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;

  .banner-slider {
    position: relative;
    width: 100%;
    height: 100%;

    .banner-slide {
      position: relative;
      width: 100%;
      height: 100%;

      &.default-banner {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .banner-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .banner-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: white;
      z-index: 2;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);

      h2 {
        font-size: 3.5rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
      }

      p {
        font-size: 2.2rem;
      }
    }

    .banner-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.3);
      border: none;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 3;
      transition: background 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(0, 0, 0, 0.5);
      }

      &.prev {
        left: 20px;
      }

      &.next {
        right: 20px;
      }
    }

    .banner-indicators {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 3;

      .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        border: none;
        cursor: pointer;
        transition: background 0.3s ease;

        &.active {
          background: white;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .home-banner-section {
    height: 300px;

    .banner-text h2 {
      font-size: 2.2rem;
    }

    .banner-text p {
      font-size: 1.3rem;
    }

    .banner-nav {
      width: 40px;
      height: 40px;

      &.prev {
        left: 10px;
      }

      &.next {
        right: 10px;
      }
    }
  }
}
</style>
