<script lang="ts">
import { getBoardList } from '@/api/board.api';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getPerfoList } from '@/api/perfo.api';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import { getApiClient } from '@/utils/apiClient';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import { TYPE_PERFO, TYPE_PERFO_CATEGORY } from '@/types';

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

    // 자체 프로그램 목록 로드
    const loadNormalPerformances = async () => {
      const param = new SearchPerfoDto();
      param.perType = TYPE_PERFO.NORMAL;

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          normalPerformances.value = res.data.slice(0, 6); // 최대 6개만 표시
        }
      });
    };

    // 대관 프로그램 목록 로드
    const loadNextPerformances = async () => {
      const param = new SearchPerfoDto();
      param.perType = TYPE_PERFO.NEXT;

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          nextPerformances.value = res.data.slice(0, 4); // 최대 4개만 표시
        }
      });
    };

    const loadBoardLit = async () => {
      const param = new SearchBoardDto();

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
      loadBoardLit();
      loadNormalPerformances();
      loadNextPerformances();
    });
    return {
      notices,
      normalPerformances,
      nextPerformances,
      activeReserveIndex,
      activeRentalIndex,
      moment,
      onClickRental,
      handleImageError,
      getCategoryLabel,
      TYPE_PERFO_CATEGORY,
    };
  },
});
</script>

<template>
  <div class="main-page-wrapper">
    <!-- ✅ 상단 배너 영역 -->
    <section class="home-banner-section">
      <!-- <img
        src="/assets/images/home/banner.jpg"
        alt="Main Banner"
        class="banner-image"
      /> -->
      <div class="banner-text">
        <h2>보광 극장에 오신 것을 환영합니다!</h2>
        <p>다양한 공연과 대관 서비스를 만나보세요.</p>
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
              <!-- 카테고리 태그와 제목을 한 줄에 -->
              <div class="category-tag-wrapper">
                <span v-if="performance.category" class="category-tag" :class="`category-${performance.category.toLowerCase()}`">
                  {{ getCategoryLabel(performance.category) }}
                </span>
                <h3 class="poster-title">{{ performance.title }}</h3>
              </div>

              <!-- 부제목들 -->
              <div v-if="performance.titleSec" class="poster-subtitle">{{ performance.titleSec }}</div>
              <div v-if="performance.titleThird" class="poster-subtitle-small">{{ performance.titleThird }}</div>

              <!-- 메타 정보 -->
              <div class="poster-meta">
                <span>{{ moment(performance.regDt).format('YY.MM.DD') }}</span>
                <span>조회수 {{ performance.views }}</span>
              </div>
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
              <!-- 카테고리 태그와 제목을 한 줄에 -->
              <div class="category-tag-wrapper">
                <span v-if="performance.category" class="category-tag" :class="`category-${performance.category.toLowerCase()}`">
                  {{ getCategoryLabel(performance.category) }}
                </span>
                <h3 class="poster-title">{{ performance.title }}</h3>
              </div>

              <!-- 부제목들 -->
              <div v-if="performance.titleSec" class="poster-subtitle">{{ performance.titleSec }}</div>
              <div v-if="performance.titleThird" class="poster-subtitle-small">{{ performance.titleThird }}</div>

              <!-- 메타 정보 -->
              <div class="poster-meta">
                <span>{{ moment(performance.regDt).format('YY.MM.DD') }}</span>
                <span>조회수 {{ performance.views }}</span>
              </div>
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
