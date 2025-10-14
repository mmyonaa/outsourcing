<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getApiClient } from '@/utils/apiClient';
import { getBoardList, updateBoard } from '@/api/board.api';
import moment from 'moment';
import { STATE_YN, TYPE_BOARD } from '@/types';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'news',
  components: { ApocPagination, EmptyState },
  setup() {
    const router = useRouter();
    const totalPage = ref<number>(0); // 총 페이지
    const apiClient = getApiClient();
    const notices = ref<BoardEntity[]>([]);
    const searchKeyword = ref<string>('');

    const loadBoardLit = async () => {
      const param = new SearchBoardDto();
      param.boardType = TYPE_BOARD.NEWS;
      param.keyword = searchKeyword.value || undefined;

      await getBoardList(apiClient, param).then(res => {
        if (res.resultCode === 0 && res.data) {
          notices.value = res.data;
        }
      });
    };

    const handleSearch = () => {
      loadBoardLit();
    };

    const goToDetail = (boardIdx: string | undefined) => {
      if (boardIdx) {
        router.push(`/notice/detail?id=${boardIdx}`);
      }
    };

    onMounted(() => {
      loadBoardLit();
    });
    return {
      notices,
      totalPage,
      moment,
      STATE_YN,
      searchKeyword,
      handleSearch,
      goToDetail,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>보도자료</h1>

    <!-- 검색바 -->
    <div class="search-bar-wrapper">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="제목으로 검색..."
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">검색</button>
    </div>

    <!-- 결과가 있을 때 -->
    <div v-if="notices.length > 0" class="notice-list">
      <!-- 데스크탑용 테이블 -->
      <div class="notice-header desktop-only">
        <div class="col important"></div>
        <div class="col index">#</div>
        <div class="col title">제목</div>
        <div class="col views">조회수</div>
        <div class="col author">작성자</div>
        <div class="col date">작성일</div>
      </div>

      <div class="notice-row" v-for="(notice, index) in notices" :key="notice.boardIdx">
        <!-- 데스크탑 행 -->
        <div class="row-content desktop-only clickable" :class="{ important: notice.bestYn === STATE_YN.Y }" @click="goToDetail(notice.boardIdx)">
          <div class="col important">
            <img v-if="notice.bestYn === STATE_YN.Y" src="/assets/images/board/important.png" />
            <div v-else></div>
          </div>
          <div class="col index">{{ index + 1 }}</div>

          <div class="col title">{{ notice.title }}</div>
          <div class="col views">{{ notice.views }}</div>
          <div class="col author">{{ notice.author }}</div>
          <div class="col date">{{ moment(notice.regDt).format('YY.MM.DD') }}</div>
        </div>

        <!-- 모바일 카드 -->
        <div class="mobile-only mobile-card clickable" :class="{ important: notice.bestYn === STATE_YN.Y }" @click="goToDetail(notice.boardIdx)">
          <div class="title">
            <img class="impor-icon" v-if="notice.bestYn === STATE_YN.Y" src="/assets/images/board/important.png" />
            {{ notice.title }}
          </div>
          <div class="meta">
            <span>{{ notice.author }}</span> · <span>{{ notice.regDt }}</span> ·
            <span>조회수 {{ notice.views }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 결과가 없을 때 -->
    <empty-state v-else message="등록된 보도자료가 없습니다" />
    <section class="pagination-section">
      <apoc-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>
