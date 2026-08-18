<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import copy from 'copy-to-clipboard';

declare global {
  interface Window {
    kakao: any;
  }
}

// 보광극장 좌표/주소 (서울 용산구 장문로19길 4)
const THEATER_LAT = 37.528895;
const THEATER_LNG = 126.995618;
const THEATER_ADDRESS = '서울특별시 용산구 장문로19길 4, 지하';

export default defineComponent({
  name: 'IntroduceRoute',
  setup() {
    const mapContainer = ref<HTMLElement | null>(null);
    const mapFailed = ref<boolean>(false); // SDK 로드 실패 시 폴백 표시
    const addressCopied = ref<boolean>(false);

    const kakaoMapUrl = `https://map.kakao.com/link/map/보광극장,${THEATER_LAT},${THEATER_LNG}`;
    const kakaoRouteUrl = `https://map.kakao.com/link/to/보광극장,${THEATER_LAT},${THEATER_LNG}`;
    const naverMapUrl = 'https://map.naver.com/p/search/보광극장 용산';

    const copyAddress = () => {
      copy(THEATER_ADDRESS);
      addressCopied.value = true;
      setTimeout(() => {
        addressCopied.value = false;
      }, 2000);
    };

    onMounted(() => {
      // 카카오맵 SDK 로드를 기다렸다가 지도 생성 (스크립트 로딩이 늦을 수 있음)
      const tryInit = (attempt = 0) => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => initMap());
        } else if (attempt < 20) {
          setTimeout(() => tryInit(attempt + 1), 150);
        } else {
          // SDK 로드 실패: 빈 박스 대신 폴백 안내 표시
          mapFailed.value = true;
        }
      };
      tryInit();
    });

    const initMap = () => {
      const container = document.getElementById('kakaoMap');
      if (!container) return;

      const coords = new window.kakao.maps.LatLng(THEATER_LAT, THEATER_LNG);

      const options = {
        center: coords,
        level: 3, // 확대 레벨
      };

      const map = new window.kakao.maps.Map(container, options);

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: coords,
        map: map,
      });

      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: '<div style="padding:5px;font-size:12px;white-space:nowrap;">보광극장</div>',
      });
      infowindow.open(map, marker);

      // 지도 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    };

    return {
      mapContainer,
      mapFailed,
      addressCopied,
      copyAddress,
      kakaoMapUrl,
      kakaoRouteUrl,
      naverMapUrl,
      THEATER_ADDRESS,
    };
  },
});
</script>

<template>
  <div class="page-common introduce-page route-page">
    <h1>오시는 길</h1>
    <div class="wrapper">
      <div class="wrapper-item">
        <div class="theater-img">
          <div v-if="!mapFailed" id="kakaoMap" style="width: 100%; height: 400px;"></div>
          <!-- 지도 로드 실패 폴백 -->
          <div v-else class="map-fallback">
            <p>지도를 불러오지 못했습니다.</p>
            <a :href="kakaoMapUrl" target="_blank" rel="noopener noreferrer">카카오맵에서 위치 보기 →</a>
          </div>
          <!-- 주소 + 복사 + 길찾기 -->
          <div class="address-row">
            <p class="address-text">
              <span class="address-label">주소</span>
              {{ THEATER_ADDRESS }}
            </p>
            <div class="address-actions">
              <button type="button" class="address-btn" :class="{ copied: addressCopied }" @click="copyAddress">
                {{ addressCopied ? '복사됨 ✓' : '주소 복사' }}
              </button>
              <a class="address-btn" :href="kakaoRouteUrl" target="_blank" rel="noopener noreferrer">카카오맵 길찾기</a>
              <a class="address-btn" :href="naverMapUrl" target="_blank" rel="noopener noreferrer">네이버지도</a>
            </div>
          </div>
        </div>
        <div class="text">
          <h2>대중교통</h2>
          <p>🚇 지하철 6호선 "이태원역" 이용 시,</p>
          <p>🚌 421, 400, 405 버스 환승</p>
          <p>"보광동 주민센터" 하차, 도보 5분</p>
          <br />
          <p>🚇 지하철 경의중앙선 "한남역" 이용 시,</p>
          <p>🚌 421, 2016, 6211, 용산01 버스 환승</p>
          <p>"신동아 아파트" 하차, 도보 5분</p>
          <h2>자가용</h2>
          <p>유료 주차장 이용</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-fallback {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: #f7f7f7;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
}

.map-fallback p {
  color: #888;
  font-size: 15px;
}

.map-fallback a {
  color: #e34363;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
}

.map-fallback a:hover {
  text-decoration: underline;
}

.address-row {
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: 'Pretendard', sans-serif;
}

.address-text {
  font-size: 15px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.address-label {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: #999;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
}

.address-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.address-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.7rem 1.3rem;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  background: #fff;
  color: #555;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
}

.address-btn:hover {
  border-color: #e34363;
  color: #e34363;
}

.address-btn.copied {
  border-color: #2e9e5b;
  color: #2e9e5b;
  background: rgba(46, 158, 91, 0.08);
}
</style>
