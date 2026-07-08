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
    <div class="footer-wrapper">
      <!-- 브랜드: 로고 + 슬로건 + SNS -->
      <div class="footer-brand">
        <img class="footer-logo" src="/assets/images/logo/theater.png" alt="보광극장 로고" />
        <p class="footer-slogan">우리는 우리의 이야기를 전할 수 있는 <br />모든 예술을 지향합니다.</p>
        <a
          class="footer-sns"
          href="https://www.instagram.com/bokwang_theater"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="보광극장 인스타그램 (새 창)">
          <img src="/assets/images/home/insta.png" alt="" />
        </a>
      </div>

      <!-- 바로가기 -->
      <nav class="footer-col" aria-label="푸터 바로가기">
        <h3 class="footer-col-title">바로가기</h3>
        <ul class="footer-link-list">
          <li><router-link to="/performance">공연</router-link></li>
          <li><router-link to="/rental/info">대관 안내</router-link></li>
          <li><router-link to="/notice">공지사항</router-link></li>
          <li><router-link to="/introduce/route">오시는 길</router-link></li>
        </ul>
      </nav>

      <!-- 연락처 -->
      <div class="footer-col">
        <h3 class="footer-col-title">연락처</h3>
        <ul class="footer-info-list">
          <li>
            <span class="label">주소</span>
            <span class="value">서울특별시 용산구 장문로19길 4, 지하</span>
          </li>
          <li>
            <span class="label">전화</span>
            <a class="value" href="tel:02-794-5803">02-794-5803</a>
          </li>
          <li>
            <span class="label">이메일</span>
            <a class="value" href="mailto:bokwang_theater@naver.com">bokwang_theater@naver.com</a>
          </li>
        </ul>
      </div>

      <!-- 사업자 정보 -->
      <div class="footer-col">
        <h3 class="footer-col-title">사업자 정보</h3>
        <ul class="footer-info-list">
          <li>
            <span class="label">대표</span>
            <span class="value">강민수</span>
          </li>
          <li>
            <span class="label">사업자번호</span>
            <span class="value">213-90-10920</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 카피라이트 -->
    <div class="footer-bottom">
      <div class="footer-bottom-inner">© {{ year }} 보광극장 BOKWANG THEATER. All rights reserved.</div>
    </div>
  </footer>
</template>

<style scoped></style>
