<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import BasePagination from '@/components/common/BasePagination.vue';
import BaseShareButton from '@/components/common/BaseShareButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { getBoardList, updateBoard } from '@/api/board.api';
import dayjs from 'dayjs';
import { getApiClient } from '@/utils/apiClient';
import { setMetaTags, setJsonLd, removeJsonLd, toPlainText } from '@/utils/seo.util';

export default defineComponent({
  name: 'noticeDetail',
  components: { BasePagination, BaseShareButton },
  setup() {
    const totalPage = ref<number>(0); // 총 페이지
    const route = useRoute();
    const router = useRouter();
    const noticeIdx = route.params.id
    const notice = ref<BoardEntity>(new BoardEntity())
    const apiClient = getApiClient();

    const goBack = () => {
      router.push('/notice') // 공지 목록 페이지 경로
    }

    const loadBoardDetail = async() => {
      const param = new SearchBoardDto();
      param.boardIdx = String(noticeIdx);
      
      await getBoardList(apiClient, param)
      .then((res)=>{
        if(res.resultCode === 0 && res.data){
          notice.value = res.data[0]
        }
      })
    }


    const updateViews = async () => {
      notice.value.boardIdx = String(noticeIdx);
      notice.value.views ++;
      await updateBoard(apiClient, notice.value)
    }

    // 로드된 글 내용으로 메타/OG/JSON-LD 갱신
    const applySeo = () => {
      if (!notice.value.title) return;
      const description = toPlainText(notice.value.body);
      setMetaTags({
        title: `${notice.value.title} | 보광극장`,
        description,
        ogTitle: `${notice.value.title} | 보광극장`,
        ogDescription: description,
      });
      setJsonLd('article', {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: notice.value.title,
        description,
        datePublished: notice.value.regDt,
        dateModified: notice.value.modDt,
        author: { '@type': 'Organization', name: notice.value.author || '보광극장' },
        publisher: {
          '@type': 'Organization',
          name: '보광극장',
          logo: { '@type': 'ImageObject', url: 'https://bktheater.com/assets/og-image.jpg' },
        },
        mainEntityOfPage: window.location.href,
      });
    }

    const setupFileDownloadLinks = () => {
      // 파일 다운로드 링크에 download 속성 추가 및 클릭 이벤트 처리
      setTimeout(() => {
        const fileLinks = document.querySelectorAll<HTMLAnchorElement>(
          '.notice-content a[href*="amazonaws.com"], .notice-content a[href*="/uploads/"], .notice-content a[href*="/files/"]'
        );

        fileLinks.forEach(link => {
          const url = link.href;
          // 링크 텍스트를 파일명으로 사용 (Quill에서 원본 파일명으로 링크를 생성했으므로)
          const fileName = link.textContent?.trim() || url.split('/').pop()?.split('?')[0] || 'download';

          // download 속성 추가
          link.setAttribute('download', fileName);

          // 클릭 이벤트로 강제 다운로드
          link.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
              const response = await fetch(url);
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = fileName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(downloadUrl);
            } catch (error) {
              console.error('파일 다운로드 오류:', error);
              // 다운로드 실패 시 새 탭에서 열기
              window.open(url, '_blank');
            }
          });
        });
      }, 300);
    };

    onMounted(async() => {
      await loadBoardDetail();
      applySeo();
      await updateViews();
      setupFileDownloadLinks();
    });

    onUnmounted(() => {
      removeJsonLd('article');
    });

    return {
      notice,
      totalPage,
      dayjs,
      goBack
    };
  },
});
</script>

<template>
  <div class="page-common notice-page">
    <h1>공지사항 상세</h1>
    <div class="notice-detail">
    <div class="notice-title-row">
      <div class="notice-title">{{ notice.title }}</div>
      <base-share-button :title="notice.title" />
    </div>

    <div class="notice-meta">
      <span>작성자: {{ notice.author }}</span>
      <span>작성일: {{ dayjs(notice.modDt).format('YY.MM.DD') }}</span>
      <span>조회수: {{ notice.views }}</span>
    </div>
    <div class="notice-content" v-html="notice.body"></div>

    <!-- 🔽 돌아가기 버튼 -->
    <div class="back-button-wrapper">
      <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
    </div>
  </div>
  </div>
</template>

<style scoped>
.notice-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
}

.notice-content :deep(a) {
  color: #0066cc;
  text-decoration: underline;
  word-break: break-all;
}

.notice-content {
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>