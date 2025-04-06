<!--<script lang="ts">-->
<!--import { defineComponent, onMounted, onUnmounted, ref } from 'vue';-->
<!--import BoardListItem from '@/components/board/BoardListItem.vue';-->
<!--import SideBar from '@/components/common/SideBar.vue';-->
<!--import BoardListCardItem from '@/components/board/BoardListCardItem.vue';-->
<!--import ApocImageSet from '@/components/common/ApocImageSet.vue';-->
<!--import moment from 'moment';-->
<!--import { CategoryInterface } from '@/types';-->

<!--export default defineComponent({-->
<!--  name: 'Now',-->
<!--  components: { SideBar, BoardListCardItem, ApocImageSet, BoardListItem },-->
<!--  setup() {-->
<!--    // 메인 아이콘 주소-->
<!--    const tagList = ref<string[]>(['STUDIO', 'KIT', 'APOC']);-->
<!--    const isLike = ref<boolean>(false);-->
<!--    const isComment = ref<boolean>(false);-->
<!--    const isRegrUser = ref<boolean>(true);-->
<!--    const isRegDt = ref<boolean>(true);-->
<!--    const boardDatas = [-->
<!--      {-->
<!--        boardIdx: 'abc123',-->
<!--        title: 'APOC과 함께하는 용인시 공유학교',-->
<!--        body: '화창한 6월에 APOC이 용인시 환경부와 함께 공유학교를 개최했어요. 초등학생부터 부모님까지 모두가 함께 할 수 있는 인터렉티브 콘텐츠! 학생, 부모님 한 명도 빠짐없이 APOC 콘텐츠를 즐겨주셨어요. 이번 공유학교에 참여한 학생 및 부모님들은 환경에 대해 더 알 수 있었다는 소감을 남겨주시기도 했답니다.',-->
<!--        tag: 'STUDIO',-->
<!--        thumbnail: '/assets/images/common/default-img.webp',-->
<!--        regDt: '2022-11-21',-->
<!--        regrUser: 'neck',-->
<!--        likeCount: 0,-->
<!--        commentCount: 0,-->
<!--        isLike: null,-->
<!--        playTime: 0,-->
<!--      },-->
<!--      {-->
<!--        boardIdx: 'abc124',-->
<!--        title: 'APOC과 함께하는 용인시 공유학교',-->
<!--        body: '화창한 6월에 APOC이 용인시 환경부와 함께 공유학교를 개최했어요. 초등학생부터 부모님까지 모두가 함께 할 수 있는 인터렉티브 콘텐츠! 학생, 부모님 한 명도 빠짐없이 APOC 콘텐츠를 즐겨주셨어요. 이번 공유학교에 참여한 학생 및 부모님들은 환경에 대해 더 알 수 있었다는 소감을 남겨주시기도 했답니다.',-->
<!--        tag: 'APOC',-->
<!--        thumbnail: null,-->
<!--        regDt: '2022-11-20',-->
<!--        regrUser: 'neck',-->
<!--        likeCount: 0,-->
<!--        commentCount: 0,-->
<!--        isLike: null,-->
<!--        playTime: 0,-->
<!--      },-->
<!--    ];-->

<!--    const menuItems = ref<CategoryInterface[]>([-->
<!--      { title: 'APOC 뉴스', subItems: [{ title: '지금 아폭은' }, { title: '고객사례' }, { title: '뉴스룸' }, { title: '릴리즈 노트' }] },-->
<!--    ]);-->

<!--    const boardHeaderEl = ref<HTMLElement | null>(null);-->
<!--    const boardMainEl = ref<HTMLElement | null>(null);-->
<!--    const handleScroll = () => {-->
<!--      // 스크롤 동작에 따른 화면 애니메이션-->
<!--      if (!(boardHeaderEl.value instanceof HTMLElement)) return;-->
<!--      if (typeof Window === 'undefined') return;-->
<!--      const scrollPosition = window.scrollY || window.document.documentElement.scrollTop;-->
<!--      if (scrollPosition !== 0) {-->
<!--        boardHeaderEl.value.classList.add('scroll');-->
<!--      } else {-->
<!--        boardHeaderEl.value.classList.remove('scroll');-->
<!--      }-->
<!--    };-->
<!--    onMounted(() => {-->
<!--      window.addEventListener('scroll', handleScroll);-->
<!--    });-->
<!--    onUnmounted(() => {-->
<!--      window.removeEventListener('scroll', handleScroll);-->
<!--    });-->
<!--    return { moment, boardHeaderEl, boardMainEl, menuItems, tagList, boardDatas, isLike, isComment, isRegrUser, isRegDt };-->
<!--  },-->
<!--});-->
<!--</script>-->

<!--<template>-->
<!--  <div class="board-page">-->
<!--    <section class="board-side-bar-section">-->
<!--      <side-bar :menu-list="menuItems" :is-drop-down="false" />-->
<!--    </section>-->
<!--    <div class="partition">-->
<!--      <section ref="boardHeaderEl" class="board-header-section">-->
<!--        <div class="board-header-wrapper">-->
<!--          <apoc-image-set class="icon" :src="'/assets/images/common/default-img.webp'" />-->
<!--          <div class="title">-->
<!--            <span>지금 아폭</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </section>-->
<!--      &lt;!&ndash; 게시판 header 타이틀 &ndash;&gt;-->
<!--      <section ref="boardMainEl" class="board-main-section">-->
<!--        &lt;!&ndash; 게시판 태그 셀렉터 &ndash;&gt;-->
<!--        <section v-if="tagList" class="board-tag-section">-->
<!--          <div class="tag active">-->
<!--            <span>ALL</span>-->
<!--          </div>-->
<!--          <div v-for="item in (tagList as string[])" :key="item" class="tag">-->
<!--            <span>{{ item }}</span>-->
<!--          </div>-->
<!--        </section>-->
<!--        &lt;!&ndash; 게시판 리스트 영역 &ndash;&gt;-->
<!--        <section class="board-list-section">-->
<!--          &lt;!&ndash;          <board-list-item&ndash;&gt;-->
<!--          &lt;!&ndash;            v-for="item in boardDatas"&ndash;&gt;-->
<!--          &lt;!&ndash;            :key="item.boardIdx"&ndash;&gt;-->
<!--          &lt;!&ndash;            :board="item"&ndash;&gt;-->
<!--          &lt;!&ndash;            :isLike="isLike"&ndash;&gt;-->
<!--          &lt;!&ndash;            :isComment="isComment"&ndash;&gt;-->
<!--          &lt;!&ndash;            :isRegrUser="isRegrUser"&ndash;&gt;-->
<!--          &lt;!&ndash;            :isRegDt="isRegDt" />&ndash;&gt;-->
<!--        </section>-->
<!--        <section class="pagination-section">-->
<!--          <div class="pagination" />-->
<!--        </section>-->
<!--      </section>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
