<script lang="ts">
import { getInstagramBoardList } from '@/api/instagram.api';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocLink from '@/components/common/ApocLink.vue';
import PopularCard from '@/components/home/PopularCard.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import type { InstagramInterface } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { AutoPlay } from '@egjs/flicking-plugins';
import Flicking from '@egjs/vue3-flicking';
import moment from 'moment';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Instagram',
  components: { ApocLink, ApocImageSet, PopularCard, Flicking },
  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const mediaItems = ref<InstagramInterface[]>([]);
    const plugins = [new AutoPlay({ duration: 2000, direction: 'NEXT', stopOnHover: false })];

    // 인스타 피드를 가져온다
    const getInstagramFeed = async () => {
      await getInstagramBoardList(apiClient).then(r => {
        if (r.data && r.data) {
          mediaItems.value = r.data.data;
        }
      });
    };

    const onClickExternal = (site?: string) => {
      window.open(site);
    };

    onMounted(() => {
      getInstagramFeed();
    });
    return {
      moment,
      mediaItems,
      onClickExternal,
      plugins,
    };
  },
});
</script>

<template>

  <div class="instagram-component">
    <!-- 인스타 제목 영역 -->
    <section class="instagram-text-section">
      <div class="instagram-title">
        <apoc-image-set :img-sets="3" class="icon" src="/assets/images/home/icon/home-icon-instagram.webp" />
				<span class="title">{{ t('home.instagram') }}</span>
      </div>
    </section>
    <!-- 인스타 카드 영역 -->
		<section class="instagram-card-section">
			<div class="instagram-feed">
				<Flicking
					class="flicking-container"
					:plugins="plugins"
					:options="{ circular: true, align: 'prev' }"
				>
						<apoc-link v-for="(media, index) in mediaItems" :key="index" :href="media.permalink" @click="onClickExternal(media.permalink)" draggable="false">
							<apoc-image-set class="instagram-thumbnail" :src="media.media_url"></apoc-image-set>
							<div class="instagram-info" >
								<div class="instagram-like">
									<apoc-image-set src="/assets/images/common/icons/heart-icon.webp"></apoc-image-set>
									{{ media.like_count }}
								</div>
								<div class="instagram-comment">
									<apoc-image-set src="/assets/images/common/icons/comment-icon.webp"></apoc-image-set>
									{{ media.comments_count }}
								</div>
							</div>
						</apoc-link>
				</Flicking>
			</div>
		</section>
		<div class="home-bg-purple-stain"></div>
		<div class="home-bg-purple-stain-center"></div>
		<div class="home-bg-pink-stain"></div>
  </div>
  <!-- 인스타 전체 배경 영역 -->
  <div class="instagram-background"></div>
</template>
