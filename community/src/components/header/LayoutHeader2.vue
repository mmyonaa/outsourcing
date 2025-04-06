<script lang="ts">
import type { UserInfoEntityDto } from '@/api/dto/user.dto';
import { getUserInfo } from '@/api/user.api';
import ApocButton from '@/components/common/ApocButton.vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocInput from '@/components/common/ApocInput.vue';
import ApocLink from '@/components/common/ApocLink.vue';
import AppConfig, { APP_ENV_TYPE } from '@/constants';
import { initStore } from '@/stores/store-manager';
import { getApiClient } from '@/utils/apiClient';
import { loadLocalData, removeLocalData, saveLocalData, ssoLogin } from '@/utils/common-util';
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'LayoutHeader2',
  components: { ApocImageSet, ApocInput, ApocButton, ApocLink },
  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const isSubMenuVisible = ref<boolean>(false); // sub menu dropdown 열림 변수
    const router = useRouter();
    const route = useRoute();
    const isActive = ref<boolean>(false);
    const isSearch = ref<boolean>(false); // 검색아이콘 활성 여부
    const searchText = ref<string>('');
    const userInfo = ref<UserInfoEntityDto>();
    const isCheckUser = ref<boolean>(false); // 임시 변수(유저 관련 자리 잡히기 전까지)
    // 글작성 페이지 이동, 로그아웃 확인 용으로 주석 삭제 예정
    const isClickMy = ref<boolean>(false);

    enum ServiceType { // apoc service
      APOC = 'APOC',
      PLAY = 'PLAY',
      STUDIO = 'STUDIO',
      ASSET = 'ASSET',
      COMM = 'COMM',
    }
    const url = {
      // dev/stage/prod 별 사이트 주소
      [APP_ENV_TYPE.DEV]: {
        [ServiceType.APOC]: 'https://brand.apoc.day/',
        [ServiceType.PLAY]: 'https://dev.apoc.day/',
        [ServiceType.STUDIO]: 'https://studio-dev.apoc.day/',
        [ServiceType.ASSET]: 'https://kit-dev.apoc.day/',
        [ServiceType.COMM]: 'https://community-dev.apoc.day/',
      },
      [APP_ENV_TYPE.STAGE]: {
        [ServiceType.APOC]: 'https://brand.apoc.day/',
        [ServiceType.PLAY]: 'https://stage.apoc.day/',
        [ServiceType.STUDIO]: 'https://studio-stage.apoc.day/',
        [ServiceType.ASSET]: 'https://kit-stage.apoc.day/',
        [ServiceType.COMM]: 'https://community-dev.apoc.day/',
      },
      [APP_ENV_TYPE.PROD]: {
        [ServiceType.APOC]: 'https://brand.apoc.day/',
        [ServiceType.PLAY]: 'https://www.apoc.day/',
        [ServiceType.STUDIO]: 'https://studio.apoc.day/',
        [ServiceType.ASSET]: 'https://kit.apoc.day/',
        [ServiceType.COMM]: 'https://comm.apoc.day/',
      },
    };

    // mouse가 영역 안으로 들어오는 경우
    const handleMouseEnter = () => {
      isSubMenuVisible.value = true;
    };

    // mouse가 영역 밖으로 나가는 경우
    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.relatedTarget as Element | null;
      const { clientY, clientX } = event;

      // 마우스가 나가는 대상이 sub-menu-section이 아니면 메뉴를 닫기
      if (target && !target.closest('.sub-menu-section')) {
        isSubMenuVisible.value = false;
      }
      // 마우스가 브라우저 밖을 벗어나면 메뉴를 닫기
      else if (clientY <= 0 || clientX <= 0 || clientX >= window.innerWidth) {
        isSubMenuVisible.value = false;
      }
    };

    // mouse가 영역 밖으로 나가는 경우
    const handleMouseSubLeave = (event: MouseEvent) => {
      const target = event.relatedTarget as Element | null;
      // 마우스가 나가는 대상이 main-menu-section이 아니면 메뉴를 닫기
      if (target && !target.closest('.main-menu-section')) {
        isSubMenuVisible.value = false;
      }
    };

    /**
			params
			@service : apoc 서비스 사이트 타입
			@append : 기본 사이트 메인 url 뒤에 붙는 url
		 	@isMine : 외부 사이트가 아닌지에 대한 여부
		*/
    const onClickExternal = (service: ServiceType, append?: string, isMine?: boolean) => {
      const baseUrl = url[AppConfig.ENV][service];
      const fullUrl = append ? `${baseUrl}${append}` : baseUrl;

      // 메뉴 클릭 시 새로운 창이 열리면서 링크 이동
      if (!isMine) {
        window.location.href = fullUrl;
      } else {
        router.push(`/${append}`);
      }
    };

    const headerType = computed(() => {
      const path = route.path;
      if (path === '/') {
        return 'opacity';
      } else {
        return 'border';
      }
    });

    watch(
      () => route.query,
      () => {
        isSubMenuVisible.value = false;
      },
    );

    const handleScroll = () => {
      if (window.scrollY > 0) {
        isActive.value = true;
      } else {
        isActive.value = false;
      }
    };

    const onClickMyBtn = () => {
      if (isCheckUser.value) {
        // 글작성 페이지 이동, 로그아웃 확인 용으로 주석
        // router.push('/mypage?type=MY_CONTENTS');
        isClickMy.value = !isClickMy.value;
      } else {
        // router.push({ name: 'User' });
        ssoLogin();
      }
    };

    const updateUserInfo = async () => {
      await getUserInfo(apiClient, {}).then(res => {
        if (res.resultCode === 0) {
          if (res.data) {
            saveLocalData(AppConfig.KEYS.LOGIN_USER, JSON.stringify(res.data));
            userInfo.value = res.data;
            const token = loadLocalData(AppConfig.KEYS.LOGIN_TOKEN);
          }
        } else if (res.resultCode === 91) {
          removeLocalData(AppConfig.KEYS.LOGIN_TOKEN);
          removeLocalData(AppConfig.KEYS.LOGIN_USER);
          storeManager.dataStore.setAuthToken('');
        }
      });
    };

    const checkUserInfo = () => {
      const token = loadLocalData(AppConfig.KEYS.LOGIN_TOKEN);
      // const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      // if (token && user) {
      //   isCheckUser.value = true;
      // } else {
      //   isCheckUser.value = false;
      // }
      if (token) {
        isCheckUser.value = true;
      } else {
        isCheckUser.value = false;
      }
    };

    const onClickSearch = () => {
      if (isSearch.value) {
        if (!searchText.value) return;
        isSearch.value = true;
        searchText.value = '';
      } else {
        isSearch.value = true;
        searchText.value = '';
      }
    };

    const onClickLogout = async () => {

    };
    watch(
      () => storeManager.dataStore.authToken,
      (current, prev) => {
        if (current !== prev) {
          checkUserInfo();
        }
      },
    );

    onMounted(() => {
      checkUserInfo();
      document.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      document.removeEventListener('scroll', handleScroll);
    });

    return {
      ServiceType,
      isSubMenuVisible,
      headerType,
      isActive,
      isSearch,
      isCheckUser,
      searchText,
      onClickExternal,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseSubLeave,
      onClickLogout,
      onClickSearch,
      onClickMyBtn,
    };
  },
});
</script>

<template>
	<header :class="[{ 'active-border': isActive && headerType === 'opacity' }, { 'none-border': isSubMenuVisible && headerType === 'border' },headerType]">
		<!-- header 최대 영역 -->
		<div class="main-header-wrapper">
			<!-- 좌측 : 로고 -->
			<apoc-link class="main-header-logo" href="/">
				<apoc-image-set :img-sets="3" src="/assets/images/logo/comm-logo.webp" />
			</apoc-link>

			<!-- main menu -->
			<section class="main-menu-section menu-list" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
				<li class="menu apoc" @click="onClickExternal(ServiceType.APOC)">APOC</li>
				<!-- 해당 사이트에 해당하는 메뉴에 active 클래스 주기 -->
				<li class="menu play" @click="onClickExternal(ServiceType.PLAY)">Play</li>
				<li class="menu studio" @click="onClickExternal(ServiceType.STUDIO)">Studio</li>
				<li class="menu asset" @click="onClickExternal(ServiceType.ASSET)">Asset</li>
				<li class="menu community active">Community</li>
			</section>

			<!-- 로그인 버튼 / 검색 영역 -->
			<div class="right-area" ref="rightRef">
				<div class="login-area">
					<apoc-button v-if="isCheckUser" @click="onClickLogout">Logout</apoc-button>
					<apoc-button v-else @click="onClickMyBtn">Login</apoc-button>
				</div>
			</div>
		</div>

		<!-- dropdown으로 열리는 sub menu -->
		<transition name="dropdown">
			<section v-show="isSubMenuVisible" class="sub-menu-section menu-list" @mouseleave="handleMouseSubLeave">
				<ul class="sub-menu-list apoc menu">
					<li></li>
				</ul>
				<ul class="sub-menu-list play menu">
					<li></li>
				</ul>
				<ul class="sub-menu-list studio menu">
					<li></li>
				</ul>
				<ul class="sub-menu-list asset menu">
					<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=3D_STICKER')">Icon 3D</li>
					<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=REALITY_3D')">Reality 3D</li>
					<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=MADE_3D')">Made 3D</li>
					<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=BACKGROUND')">Background</li>
					<li @click="onClickExternal(ServiceType.ASSET, 'subscribe')">Pricing</li>
					<li @click="onClickExternal(ServiceType.ASSET, 'service')">Help center</li>
				</ul>
				<ul class="sub-menu-list community menu">
					<li @click="onClickExternal(ServiceType.COMM, 'board/apoc_news?type=NOW', true)">apoc 뉴스</li>
					<li @click="onClickExternal(ServiceType.COMM, 'board/tutorial?type=TUTORIAL', true)">사용가이드</li>
					<li @click="onClickExternal(ServiceType.COMM, 'board/board?type=TIPS', true)">게시판</li>
					<li @click="onClickExternal(ServiceType.COMM, 'board/notice?type=NOTICE',true)">공지</li>
				</ul>
			</section>
		</transition>
	</header>
</template>

<style scoped></style>
