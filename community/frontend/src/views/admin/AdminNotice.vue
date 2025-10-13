<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocPagination from '@/components/common/ApocPagination.vue';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getApiClient } from '@/utils/apiClient';
import { getBoardList } from '@/api/board.api';
import moment from 'moment';
import { STATE_YN } from '@/types';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'adminNotice',
  components: { ApocPagination },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const apiClient = getApiClient();
    const notices = ref<BoardEntity[]>([])
    const router = useRouter();
    const searchKeyword = ref<string>('');

    const loadBoardLit = async() => {
      const param = new SearchBoardDto();
      param.keyword = searchKeyword.value || undefined;

      await getBoardList(apiClient, param)
      .then((res)=>{
        if(res.resultCode === 0 && res.data){
          notices.value = res.data
        }
      })
    }

    const handleSearch = () => {
      loadBoardLit();
    };

    const assignNotice = () => {
      router.push('/admin/notice/assign')
    }

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
      assignNotice
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>공지사항</h1>

    <!-- 검색바와 등록 버튼 -->
    <div class="search-action-wrapper">
      <div class="search-bar-wrapper">
        <input v-model="searchKeyword" type="text" placeholder="제목으로 검색..." class="search-input" @keyup.enter="handleSearch" />
        <button class="search-button" @click="handleSearch">검색</button>
      </div>
      <button class="register-button" @click="assignNotice">공지사항 등록</button>
    </div>

    <div class="notice-list">
    <!-- 데스크탑용 테이블 -->
    <div class="notice-header desktop-only">
      <div class="col important"></div>
      <div class="col index">#</div>
      <div class="col title">제목</div>
      <div class="col views">조회수</div>
      <div class="col author">작성자</div>
      <div class="col date">작성일</div>
    </div>

    <div
      class="notice-row"
      v-for="(notice, index) in notices"
      :key="notice.boardIdx"

    >
      <!-- 데스크탑 행 -->
      <div class="row-content desktop-only" :class="{important:notice.bestYn === STATE_YN.Y}">
        <div class="col important">
          <img v-if="notice.bestYn === STATE_YN.Y" src="/assets/images/board/important.png"/>
          <div v-else></div>
        </div>
        <div class="col index">{{ index + 1 }}</div>
        
        <div class="col title">
          <router-link
          :to="`/admin/notice/detail?id=${notice.boardIdx}`"
          class="notice-card"
        >{{ notice.title }}</router-link></div>
        <div class="col views">{{ notice.views }}</div>
        <div class="col author">{{ notice.author }}</div>
        <div class="col date">{{ moment(notice.regDt).format('YY.MM.DD') }}</div>
      </div>

      <!-- 모바일 카드 -->
      <div class="mobile-only mobile-card" :class="{important:notice.bestYn === STATE_YN.Y}">
        <div class="title">
          <img class="impor-icon" v-if="notice.bestYn === STATE_YN.Y" src="/assets/images/board/important.png"/>
          {{ notice.title }}</div>
        <div class="meta">
          <span>{{ notice.author }}</span> ·
          <span>{{ notice.regDt }}</span> ·
          <span>조회수 {{ notice.views }}</span>
        </div>
      </div>
    </div>
    </div>
    <section class="pagination-section">
        <apoc-pagination :total-page-num="totalPage" />
    </section>
  </div>
</template>

<style scoped>
/* 검색바와 등록 버튼을 감싸는 래퍼 */
.search-action-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem auto 3rem;
  padding: 0 1rem;
}

.search-bar-wrapper {
  max-width: 600px;
  flex: 0 1 600px;
  margin: 0;
}

/* 등록 버튼 */
.register-button {
  padding: 1.2rem 2rem;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  background: #736e92;
  color: white;
  border: none;
}

.register-button:hover {
  background: #5f5a7a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(115, 110, 146, 0.3);
}

.register-button:active {
  transform: translateY(0);
}

/* 반응형 */
@media (max-width: 768px) {
  .search-action-wrapper {
    flex-direction: column;
    width: 100%;
  }

  .search-bar-wrapper {
    flex: 1;
    max-width: 100%;
    width: 100%;
  }

  .register-button {
    width: 100%;
  }
}
</style>
