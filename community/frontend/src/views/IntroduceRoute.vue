<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

declare global {
  interface Window {
    kakao: any;
  }
}

export default defineComponent({
  name: 'IntroduceRoute',
  setup() {
    const mapContainer = ref<HTMLElement | null>(null);

    onMounted(() => {
      // 카카오맵 SDK가 로드된 후 지도 생성
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          initMap();
        });
      }
    });

    const initMap = () => {
      const container = document.getElementById('kakaoMap');
      if (!container) return;

      // 보광극장 좌표 (서울 용산구 장문로19길 4)
      const coords = new window.kakao.maps.LatLng(37.528895, 126.995618);

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
          <div id="kakaoMap" style="width: 100%; height: 400px;"></div>
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
