<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { PerfoEntity, SearchPerfoDto } from '@/api/dto/perfo.dto';
import { getApiClient } from '@/utils/apiClient';
import { getPerfoList } from '@/api/perfo.api';
import moment from 'moment';
import { STATE_YN, TYPE_PERFO } from '@/types';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'adminPerformance',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const apiClient = getApiClient();
    const perfos = ref<PerfoEntity[]>([]);
    const router = useRouter();

    const loadPerfoList = async () => {
      const param = new SearchPerfoDto();
      param.perType = TYPE_PERFO.NORMAL;

      await getPerfoList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          perfos.value = res.data;
          totalPage.value = res.totalCount ? Math.ceil(res.totalCount / 10) : 0;
        }
      });
    };

    const assignPerfo = () => {
      router.push('/admin/performance/assign');
    };

    onMounted(() => {
      loadPerfoList();
    });
    return {
      perfos,
      totalPage,
      moment,
      STATE_YN,
      assignPerfo,
      loadPerfoList,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>역대 공연 관리</h1>
    <div class="back-button-wrapper">
      <button class="back-button" @click="assignPerfo">공연 등록</button>
    </div>
    <div class="notice-list">
      <!-- 데스크탑용 테이블 -->
      <div class="notice-header desktop-only">
        <div class="col index">#</div>
        <div class="col title">제목</div>
        <div class="col type">공연타입</div>
        <div class="col views">조회수</div>
        <div class="col date">등록일</div>
      </div>

      <div class="notice-row" v-for="(perfo, index) in perfos" :key="perfo.perIdx">
        <!-- 데스크탑 행 -->
        <div class="row-content desktop-only">
          <div class="col index">{{ index + 1 }}</div>

          <div class="col title">
            <router-link :to="`/admin/performance/detail?id=${perfo.perIdx}`" class="notice-card">{{ perfo.title }}</router-link>
          </div>
          <div class="col type">{{ perfo.perType }}</div>
          <div class="col views">{{ perfo.views }}</div>
          <div class="col date">{{ moment(perfo.regDt).format('YY.MM.DD') }}</div>
        </div>

        <!-- 모바일 카드 -->
        <div class="mobile-only mobile-card">
          <div class="title">
            {{ perfo.title }}
          </div>
          <div class="meta">
            <span>{{ perfo.perType }}</span> · <span>{{ moment(perfo.regDt).format('YY.MM.DD') }}</span> ·
            <span>조회수 {{ perfo.views }}</span>
          </div>
        </div>
      </div>
    </div>
    <section class="pagination-section">
      <apoc-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>
