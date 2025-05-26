<script lang="ts">
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocInput from '@/components/common/ApocInput.vue';
import ApocLink from '@/components/common/ApocLink.vue';
import ArrowDown from '@/components/header/ArrowDown.vue'; // dropdown 화살표 (svg 파일로 관리)
import AppConfig, { APP_ENV_TYPE } from '@/constants';
import { initStore } from '@/stores/store-manager';
import { POPUP_TYPE } from '@/types';
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'MegaMenu',
  components: { ApocInput, ApocLink, ApocImageSet, ArrowDown },
  setup() {
    const storeManager = initStore();
    const keyword = ref<string>(''); // 검색창 입력
    const router = useRouter();
    const route = useRoute();
    const isActive = ref<boolean>(false);
    const mainTab = computed(() => route.params.mainTab);

    enum ServiceType { // apoc service
      PLAY = 'PLAY',
      STUDIO = 'STUDIO',
      ASSET = 'ASSET',
      COMM = 'COMM',
    }

    // 현재 서비스 (각 서비스에 맞게 설정 필요)
    const curServiceType = ServiceType.COMM;

    // 드롭다운 열림 관리 변수
    const isSubMenuVisible = ref<boolean>(false); // sub menu dropdown 열림 변수
    const isTabletMenuVisibleType = ref<ServiceType | undefined>(curServiceType); // 현재 서비스 값으로 초기 설정!!!

    // local/dev/stage/prod 별 사이트 주소
    const url = {
      [APP_ENV_TYPE.DEV]: {
        [ServiceType.PLAY]: 'https://dev.apoc.day/',
        [ServiceType.STUDIO]: 'https://studio-dev.apoc.day/',
        [ServiceType.ASSET]: 'https://kit-dev.apoc.day/',
        [ServiceType.COMM]: 'https://community-dev.apoc.day/',
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
      const { clientY, clientX } = event;

      // 마우스가 나가는 대상이 main-menu-section이 아니면 메뉴를 닫기
      if (target && !target.closest('.main-menu-section')) {
        isSubMenuVisible.value = false;
      }
      // 마우스가 브라우저 밖을 벗어나면 메뉴를 닫기
      else if (clientY <= 0 || clientX <= 0 || clientX >= window.innerWidth) {
        isSubMenuVisible.value = false;
      }
    };

    /**
			params
			@service : apoc 서비스 사이트 타입
			@append : 기본 사이트 메인 url 뒤에 붙는 url
			@isLocal : local에서 테스트 시 true 값 주기
		*/
    const onClickExternal = (service: ServiceType, append?: string, isLocal?: boolean) => {
      const baseUrl = isLocal ? AppConfig.FRONT_HOST + '/' : url[AppConfig.ENV][service];
      const fullUrl = append ? `${baseUrl}${append}` : baseUrl;

      // 우측 메뉴바 닫음
      storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.NONE });

      // 메뉴 클릭 시 기존 창으로 페이지 열림
      window.location.href = fullUrl;
    };

    // (tablet ~ mobile) 우측 사이드 메뉴의 main menu 클릭 > sub menu dropdown 열기
    const onClickOpenSubMenu = (service: ServiceType) => {
      if (isTabletMenuVisibleType.value === service) isTabletMenuVisibleType.value = undefined;
      else isTabletMenuVisibleType.value = service;
    };

    // (tablet ~ mobile) 햄버거 버튼 클릭해서 우측 사이드 메뉴 열기
    const onClickTabletMenu = (value: boolean) => {
      if (value) {
        storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.TABLET_SIDE_MENU });
      } else {
        storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.NONE });
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 0) {
        isActive.value = true;
      } else {
        isActive.value = false;
      }
    };

    watch(
      () => storeManager.stateStore.popupMode,
      () => {
        // (tablet ~ mobile) 우측 사이드 메뉴 닫힐 때마다, active되어 있는 service type 초기화
        isTabletMenuVisibleType.value = curServiceType;
      },
    );

    onMounted(() => {
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
      mainTab,
      keyword,
      isTabletMenuVisibleType,
      storeManager,
      POPUP_TYPE,
      curServiceType,
      onClickExternal,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseSubLeave,
      onClickOpenSubMenu,
      onClickTabletMenu,
    };
  },
});
</script>

<template>
<div class="mega-menu">
	<header :class="[{ 'active-border': isActive && headerType === 'opacity' }, { 'white-background': isSubMenuVisible }, headerType]">
		<!-- 상단에 고정되는 헤더 -->
		<div class="main-header-wrapper">
			<!-- 좌측 : 로고 -->
			<apoc-link class="main-header-logo" href="/">
				<img src="/assets/images/logo/theater.png" />
			</apoc-link>
			<!-- main menu -->
			<section class="main-menu-section" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
				<ul class="menu-list">
					<li class="menu play" :class="{ active: curServiceType === ServiceType.PLAY }" @click="onClickExternal(ServiceType.PLAY)">소개</li>
					<li class="menu studio" :class="{ active: curServiceType === ServiceType.STUDIO }" @click="onClickExternal(ServiceType.STUDIO)">공연</li>
					<li class="menu asset" :class="{ active: curServiceType === ServiceType.ASSET }" @click="onClickExternal(ServiceType.ASSET)">대관</li>
					<li class="menu community" :class="{ active: curServiceType === ServiceType.COMM }" @click="onClickExternal(ServiceType.COMM)">
						공지사항
					</li>
				</ul>
			</section>
			<br>

			<!-- 우측 : 언어, 마이페이지/로그인 -->
			<section class="login-section">
				<ul class="menu-list">
					<!-- 마이페이지 드롭다운 / 로그인 드롭다운 -->
					<!-- (tablet ~ mobile) 메뉴 햄버거 버튼 -->
					<li @click="onClickTabletMenu(true)" class="menu-icon hamburger">
            <span></span>
            <span></span>
            <span></span>
          </li>
				</ul>
			</section>
		</div>

		<!-- (pc) dropdown으로 열리는 sub menu -->
		<transition name="dropdown">
			<section v-show="isSubMenuVisible" class="sub-menu-section menu-list" @mouseleave="handleMouseSubLeave" >
				<ul class="sub-menu-list play menu">
						<li @click="onClickExternal(ServiceType.PLAY)">극장 소개</li>
						<li @click="onClickExternal(ServiceType.PLAY, 'asset-menu?assetType=3D_STICKER')">단체 소개</li>
						<li @click="onClickExternal(ServiceType.PLAY, 'asset-menu?assetType=REALITY_3D')">오시는 길</li>
				</ul>
				<ul class="sub-menu-list studio menu">
          <li @click="onClickExternal(ServiceType.STUDIO)">역대 공연</li>
          <li @click="onClickExternal(ServiceType.STUDIO, 'asset-menu?assetType=REALITY_3D')">예정 공연</li>
				</ul>
				<ul class="sub-menu-list asset menu">
					<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=3D_STICKER')">극장 상세사항</li>
					<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=REALITY_3D')">대관 안내</li>
					<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=MADE_3D')">대관 스케줄</li>
					<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=BACKGROUND')">대관 신청링크</li>
				</ul>
				<ul class="sub-menu-list community menu">
					<li @click="onClickExternal(ServiceType.COMM, 'board/apoc_news?type=NOW', true)" :class="{ active: mainTab === 'apoc_news' }">공지 상세사항</li>
				</ul>
			</section>
		</transition>
	</header>

	<!-- (tablet ~ mobile) 우측에서 열리는 menu -->
	<transition name="slide">
		<section v-show="storeManager.stateStore.popupMode?.type === POPUP_TYPE.TABLET_SIDE_MENU" class="main-menu-section-tablet">
			<ul>
				<li class="close-wrapper">
					<img class="logo-img" src="/assets/images/logo/theater.png" />
					<apoc-image-set class="close-btn" :img-sets="3" src="/assets/images/common/icons/black-close-icon.webp" @click="onClickTabletMenu(false)" />
				</li>
				<li class="menu play" :class="{ opened: isTabletMenuVisibleType === ServiceType.PLAY, active: curServiceType === ServiceType.PLAY }" @click="() => onClickOpenSubMenu(ServiceType.PLAY)">소개<ArrowDown /></li>
        <transition name="dropdown">
					<section
						v-show="isTabletMenuVisibleType === ServiceType.PLAY"
						class="sub-menu-tablet"
						:class="{ opened: isTabletMenuVisibleType === ServiceType.PLAY }">
						<ul>
							<li @click="onClickExternal(ServiceType.PLAY)">극장 소개</li>
							<li @click="onClickExternal(ServiceType.PLAY, 'asset-menu?assetType=3D_STICKER')">단체 소개</li>
							<li @click="onClickExternal(ServiceType.PLAY, 'asset-menu?assetType=REALITY_3D')">오시는 길</li>
						</ul>
					</section>
				</transition>
				<li class="menu studio" :class="{ opened: isTabletMenuVisibleType === ServiceType.STUDIO,active: curServiceType === ServiceType.STUDIO }" @click="() => onClickOpenSubMenu(ServiceType.STUDIO)">공연<ArrowDown /></li>
        <transition name="dropdown">
					<section
						v-show="isTabletMenuVisibleType === ServiceType.STUDIO"
						class="sub-menu-tablet"
						:class="{ opened: isTabletMenuVisibleType === ServiceType.STUDIO }">
						<ul>
							<li @click="onClickExternal(ServiceType.STUDIO)">역대 공연</li>
							<li @click="onClickExternal(ServiceType.STUDIO, 'asset-menu?assetType=REALITY_3D')">예정 공연</li>
						</ul>
					</section>
				</transition>
				<li
					class="menu asset"
					:class="{ opened: isTabletMenuVisibleType === ServiceType.ASSET, active: curServiceType === ServiceType.ASSET }"
					@click="() => onClickOpenSubMenu(ServiceType.ASSET)">
					대관<ArrowDown />
				</li>
				<transition name="dropdown">
					<section
						v-show="isTabletMenuVisibleType === ServiceType.ASSET"
						class="sub-menu-tablet"
						:class="{ opened: isTabletMenuVisibleType === ServiceType.ASSET }">
						<ul>
							<li @click="onClickExternal(ServiceType.ASSET)">극장 상세사항</li>
							<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=3D_STICKER')">대관 안내</li>
							<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=REALITY_3D')">대관 스케줄</li>
							<li @click="onClickExternal(ServiceType.ASSET, 'asset-menu?assetType=MADE_3D')">대관 신청링크</li>
						</ul>
					</section>
				</transition>
				<li
					class="menu community"
					:class="{ opened: isTabletMenuVisibleType === ServiceType.COMM, active: curServiceType === ServiceType.COMM }"
					@click="() => onClickOpenSubMenu(ServiceType.COMM)">
					공지사항<ArrowDown />
				</li>
				<transition name="dropdown">
					<section
						v-show="isTabletMenuVisibleType === ServiceType.COMM"
						class="sub-menu-tablet"
						:class="{ opened: isTabletMenuVisibleType === ServiceType.COMM }">
						<ul>
							<li @click="onClickExternal(ServiceType.COMM, '', true)">공지 게시판</li>
						</ul>
					</section>
				</transition>
			</ul>
		</section>
	</transition>
</div>
</template>

<style scoped></style>
