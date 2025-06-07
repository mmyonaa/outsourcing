<script lang="ts">
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocLink from '@/components/common/ApocLink.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LayoutFooter',
  components: { ApocImageSet, ApocLink },
  setup() {
    return {
    };
  },
});
</script>

<template>
  <div class="footer new-footer">
    <div class="footer-wrapper">
      <div class="footer-logo-img">
				<img src="/assets/images/logo/theater.png" />
      </div>
      <div class="footer-info-wrapper">
        <div>
          <div>사업자 대표 | 강민수</div>
          <div>사업자 번호 | 213-90-10920</div>
        </div>
        <div>
          <div>주소 | 용산구 장문로 19길 4</div>
          <div>전화번호 | 02-794-5803</div>
        </div>
        <div> 이메일 | bokwang_theater@naver.com</div>
      </div>
      <div class="footer-sns-wrapper">
        <div>
          <!-- 인스타 -->
          <a href="https://www.instagram.com/bokwang_theater"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
          >
          <img src="/assets/images/home/insta.png" class="insta"/>
        </a>
        </div>
        <div>
          <!-- 카톡 -->
          <a href="https://pf.kakao.com/_ZtDLxb"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
          >
          <img src="/assets/images/home/kakao.png" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
