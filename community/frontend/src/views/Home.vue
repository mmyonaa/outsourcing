<script lang="ts">
import { getBoardList } from '@/api/board.api';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getPerfoList } from '@/api/perfo.api';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getBannerList } from '@/api/banner.api';
import { BannerEntity, SearchBannerDto } from '@/api/dto/banner.dto';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import { getApiClient } from '@/utils/apiClient';
import { defineComponent, onMounted, onUnmounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import { TYPE_BOARD, TYPE_PERFO, TYPE_PERFO_CATEGORY } from '@/types';

export default defineComponent({
  name: 'Home',
  components: { ApocImageSet },
  setup() {
    const router = useRouter();
    const activeReserveIndex = ref<number>(0);
    const activeRentalIndex = ref<number>(0);
    const apiClient = getApiClient();
    const notices = ref<BoardEntity[]>([]);
    const normalPerformances = ref<PerfoEntity[]>([]);
    const nextPerformances = ref<PerfoEntity[]>([]);
    const banners = ref<BannerEntity[]>([]);
    const currentBannerIndex = ref<number>(0);
    let bannerIntervalId: ReturnType<typeof setInterval> | null = null;

    // 전체 배너 개수 (기본 텍스트 배너 1개 + 이미지 배너들)
    const totalBannerCount = computed(() => 1 + banners.value.length);

    // 현재 배너가 기본 텍스트 배너인지 확인 (인덱스 0)
    const isDefaultBanner = computed(() => currentBannerIndex.value === 0);

    // 현재 이미지 배너의 인덱스 (전체 인덱스 - 1)
    const currentImageBannerIndex = computed(() => currentBannerIndex.value - 1);

    const loadBanners = async () => {
      const param = new SearchBannerDto();
      param.activeYn = 'Y';

      await getBannerList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data) {
            banners.value = res.data;
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
        // 기본 배너는 5초, 이미지 배너는 설정된 시간
        const duration = isDefaultBanner.value ? 5 : banners.value[currentImageBannerIndex.value]?.swipeDuration || 5;

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

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          normalPerformances.value = res.data.slice(0, 6);
        }
      });
    };

    const loadNextPerformances = async () => {
      const param = new SearchPerfoDto();
      param.perType = TYPE_PERFO.NEXT;

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          nextPerformances.value = res.data.slice(0, 4);
        }
      });
    };

    const loadBoardLit = async () => {
      const param = new SearchBoardDto();
      param.boardType = TYPE_BOARD.NORMAL;

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
      target.src = '/assets/images/common/default-thumbnail.svg';
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
      loadBoardLit();
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
      banners,
      currentBannerIndex,
      totalBannerCount,
      isDefaultBanner,
      currentImageBannerIndex,
      activeReserveIndex,
      activeRentalIndex,
      moment,
      onClickRental,
      handleImageError,
      getCategoryLabel,
      nextBanner,
      prevBanner,
      goToBanner,
      TYPE_PERFO_CATEGORY,
    };
  },
});
</script>

<template>
  <div class="main-page-wrapper">
    <section class="home-banner-section">
      <div class="banner-slider">
        <transition name="fade" mode="out-in">
          <!-- 기본 텍스트 배너 (인덱스 0) -->
          <div v-if="isDefaultBanner" :key="'default'" class="banner-slide default-banner">
            <div class="banner-text">
              <h2>보광 극장에 오신 것을 환영합니다!</h2>
              <p>다양한 공연과 대관 서비스를 만나보세요.</p>
            </div>
          </div>
          <!-- 이미지 배너들 (인덱스 1 이상) -->
          <div v-else :key="currentImageBannerIndex" class="banner-slide">
            <img :src="banners[currentImageBannerIndex].imgUrl" alt="Banner" class="banner-image" @error="handleImageError" />
          </div>
        </transition>

        <button v-if="totalBannerCount > 1" class="banner-nav prev" @click="prevBanner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button v-if="totalBannerCount > 1" class="banner-nav next" @click="nextBanner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div v-if="totalBannerCount > 1" class="banner-indicators">
          <button
            v-for="index in totalBannerCount"
            :key="index - 1"
            :class="['indicator', { active: index - 1 === currentBannerIndex }]"
            @click="goToBanner(index - 1)"></button>
        </div>
      </div>
    </section>
    <div class="page-common home-page">
      <section class="home-section-item">
        <div class="title-wrapper">
          <div class="title">
            <img src="/assets/images/home/ticket.png" />
            자체 프로그램
          </div>
          <router-link to="/performance">+ more</router-link>
        </div>
        <div v-if="normalPerformances.length > 0" class="poster-gallery rental">
          <router-link
            v-for="(performance, index) in normalPerformances"
            :key="performance.perIdx"
            :to="`/performance/detail?id=${performance.perIdx}`"
            class="poster"
            :class="{ active: activeRentalIndex === index }"
            @mouseenter="activeRentalIndex = index">
            <div class="poster-image">
              <img :src="performance.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="performance.title" @error="handleImageError" />
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
      <section class="home-section-item">
        <div class="title-wrapper">
          <div class="title">
            <img src="/assets/images/home/theater.png" />
            대관 프로그램
          </div>
          <router-link to="/performance/next">+ more</router-link>
        </div>
        <div v-if="nextPerformances.length > 0" class="poster-gallery text">
          <router-link
            v-for="(performance, index) in nextPerformances"
            :key="performance.perIdx"
            :to="`/performance/detail?id=${performance.perIdx}`"
            class="poster"
            :class="{ active: activeReserveIndex === index }"
            @mouseenter="activeReserveIndex = index">
            <div class="poster-image">
              <img :src="performance.imgUrl || '/assets/images/common/default-thumbnail.svg'" :alt="performance.title" @error="handleImageError" />
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
      <section class="home-section-item">
        <div class="title-wrapper">
          <div class="title">
            <img src="/assets/images/home/notice.png" />
            공지사항
          </div>
          <router-link to="/notice">+ more</router-link>
        </div>
        <div class="card-grid">
          <router-link v-for="notice in notices.slice(0, 3)" :key="notice.boardIdx" :to="`/notice/detail?id=${notice.boardIdx}`" class="notice-card">
            <div class="title">{{ notice.title }}</div>
            <div class="date">{{ moment(notice.regDt).format('YY.MM.DD') }}</div>
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
