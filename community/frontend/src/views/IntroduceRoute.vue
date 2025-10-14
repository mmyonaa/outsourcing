<script lang="ts">
import { defineComponent, onMounted } from 'vue';

declare global {
  interface Window {
    kakao: any;
  }
}

declare const kakao: any;
export default defineComponent({
  name: 'Home',
  setup() {
    onMounted(() => {
      if (window.kakao) {
        kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(37.5665, 126.978),
            level: 3
          };
          const map = new kakao.maps.Map(container, options);

          const marker = new kakao.maps.Marker({
            position: options.center
          });
          marker.setMap(map);

          kakao.maps.event.addListener(marker, 'click', () => {
            window.open('https://map.kakao.com/link/map/서울시청,37.5665,126.978', '_blank');
          });
        });
    }
});
    return {};
  },
});
</script>

<template>
  <div class="page-common introduce-page route-page">
    <h1>오시는 길</h1>
    <div class="wrapper">
      <div class="wrapper-item">
        <div class="theater-img">
          <div id="map" style="width: 100%; height: 400px;"></div>
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
          <h2>차량</h2>
          <p>주차 불가</p>
        </div>
      </div>
    </div>
  </div>
</template>
