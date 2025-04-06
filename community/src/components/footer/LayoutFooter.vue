<script lang="ts">
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocLink from '@/components/common/ApocLink.vue';
import AppConfig from '@/constants';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'LayoutFooter',
  components: { ApocImageSet, ApocLink },
  setup() {
    const onClickExternal = (site?: string) => {
      window.open(site);
    };
    const { t } = useI18n({ useScope: 'global' });

    return {
      t,
      onClickExternal,
    };
  },
});
</script>

<template>
  <div class="footer">
    <div class="footer-wrapper">
      <div class="footer-top-area">
        <div class="footer-info">
          <div class="logo-area">
            <apoc-image-set src="/assets/images/logo/footer-logo.webp" :img-sets="3" alt="logo" />
          </div>
          <div class="desc-area">
            <pre>{{ t('footer.footerDesc') }}</pre
            >
          </div>
          <div class="sns-area">
            <ul class="sns-list">
              <li class="sns-item instagram">
                <apoc-link href="#" @click="onClickExternal('https://www.instagram.com/apoc.day?igsh=ZzVsbmhyZmE0aGJq')">
                  <apoc-image-set src="/assets/images/common/icons/instagram.webp" alt="instagram" :img-sets="3" />
                </apoc-link>
              </li>
              <li class="sns-item youtube">
                <apoc-link href="#" @click="onClickExternal('https://www.youtube.com/@apoc7306')">
                  <apoc-image-set src="/assets/images/common/icons/youtube.webp" alt="youtube" :img-sets="3" />
                </apoc-link>
              </li>
              <li class="sns-item linkedin">
                <apoc-link href="#" @click="onClickExternal('https://www.linkedin.com/company/apoc-famppy/mycompany/verification/')">
                  <apoc-image-set src="/assets/images/common/icons/linkedin.webp" alt="linkedin" :img-sets="3" />
                </apoc-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer-link-section apoc-news">
          <div class="title">{{ t('menu.mainMenu.apocNews') }}</div>
          <ul class="link-list">
            <li class="link-item">
              <apoc-link :href="'/board/apoc_news?type=NOW'">{{ t('menu.subMenu.now') }}</apoc-link>
            </li>
            <li class="link-item">
              <apoc-link :href="'/board/apoc_news?type=INTERVIEW'">{{ t('menu.subMenu.interview') }}</apoc-link>
            </li>
            <li class="link-item">
              <apoc-link :href="'/board/apoc_news?type=NEWS_ROOM'">{{ t('menu.subMenu.newsRoom') }}</apoc-link>
            </li>

          </ul>
        </div>
        <div class="footer-link-section tutorial">
          <div class="title">{{ t('menu.mainMenu.tutorial') }}</div>
          <ul class="link-list">
            <li class="link-item">
              <apoc-link :href="'/board/tutorial?type=TUTORIAL'">{{ t('menu.subMenu.tutorial') }}</apoc-link>
            </li>
            <li class="link-item">
              <apoc-link :href="'/board/tutorial?type=USE_STUDIO'">{{ t('menu.subMenu.useStudio') }}</apoc-link>
            </li>
            <li class="link-item">
              <apoc-link :href="'/board/tutorial?type=USE_PLAY'">{{ t('menu.subMenu.usePlay') }}</apoc-link>
            </li>
						<li class="link-item">
							<apoc-link :href="'/board/tutorial?type=USE_ASSET'">{{ t('menu.subMenu.useAsset') }}</apoc-link>
						</li>
          </ul>
        </div>
        <div class="footer-link-section free">
          <div class="title">{{ t('menu.mainMenu.board') }}</div>
          <ul class="link-list">
            <li class="link-item">
              <apoc-link :href="'/board/board?type=TIPS'">{{ t('menu.subMenu.tips') }}</apoc-link>
            </li>
            <li class="link-item">
              <apoc-link :href="'/board/board?type=FREE'">{{ t('menu.subMenu.free') }}</apoc-link>
            </li>
            <li class="link-item">
              <apoc-link :href="'/board/board?type=FUNCTION'">{{ t('menu.subMenu.function') }}</apoc-link>
            </li>
          </ul>
        </div>
        <div class="footer-link-section notice">
          <div class="title">{{ t('menu.mainMenu.notice') }}</div>
          <ul class="link-list">
            <li class="link-item">
              <apoc-link :href="'/board/notice?type=NOTICE'">{{ t('menu.subMenu.notice') }}</apoc-link>
            </li>
            <li class="link-item">
              <apoc-link :href="'/board/notice?type=EVENT'">{{ t('menu.subMenu.event') }}</apoc-link>
            </li>
						<li class="link-item">
							<apoc-link :href="'/board/notice?type=RELEASE'">{{ t('menu.subMenu.release') }}</apoc-link>
						</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom-area">
        <div class="left-area">
          <div class="copyright-item">© 2024 <strong>FAMPPY</strong> Inc.</div>
<!--          <div class="copyright-item">이용약관</div>-->
<!--          <div class="copyright-item">개인정보취급방침</div>-->
<!--          <div class="copyright-item">사업자정보</div>-->
        </div>
        <div class="right-area">
          <div class="copyright-item">All Right Reserved @apoc.day</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
