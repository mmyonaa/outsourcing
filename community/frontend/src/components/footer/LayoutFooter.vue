<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LayoutFooter',
  setup() {
    const year = new Date().getFullYear();
    return { year };
  },
});
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <!-- 상단: 로고+슬로건 | 바로가기 | SNS -->
      <div class="footer-top">
        <div class="footer-brand">
          <img class="footer-logo" src="/assets/images/logo/theater.png" alt="보광극장 로고" />
          <p class="footer-slogan">우리는 우리의 이야기를 전할 수 있는 모든 예술을 지향합니다.</p>
        </div>

        <div class="footer-top-right">
          <nav class="footer-links" aria-label="푸터 바로가기">
            <ul>
              <li><router-link to="/performance">활동</router-link></li>
              <li><router-link to="/rental/info">대관 신청</router-link></li>
              <li><router-link to="/notice">공지사항</router-link></li>
              <li><router-link to="/introduce/route">오시는 길</router-link></li>
            </ul>
          </nav>

          <a
            class="footer-sns"
            href="https://www.instagram.com/bokwang_theater"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="보광극장 인스타그램 (새 창)">
            <img src="/assets/images/home/insta.png" alt="" />
          </a>
        </div>
      </div>

      <div class="footer-divider"></div>

      <!-- 하단: 연락처·사업자 정보 + 카피라이트 -->
      <div class="footer-bottom">
        <div class="footer-info">
          <p class="footer-info-line">
            <span class="item"><span class="label">주소</span>서울특별시 용산구 장문로19길 4, 지하</span>
            <span class="item"><span class="label">전화</span><a href="tel:02-794-5803">02-794-5803</a></span>
            <span class="item"><span class="label">이메일</span><a href="mailto:bokwang_theater@naver.com">bokwang_theater@naver.com</a></span>
          </p>
          <p class="footer-info-line">
            <span class="item"><span class="label">대표</span>강민수</span>
            <span class="item"><span class="label">사업자번호</span>213-90-10920</span>
          </p>
        </div>
        <div class="footer-copy">© {{ year }} 보광극장 BOKWANG THEATER. <br />All rights reserved.</div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
