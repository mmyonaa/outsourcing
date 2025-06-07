<script lang="ts">
import { defineComponent, onMounted } from 'vue';

declare const kakao: any;
export default defineComponent({
  name: 'Home',
  setup() {
    onMounted(() => {
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
          <h3>지하철 이용</h3>
          <ul>
            <li>• 한남역 1번 출구 – 도보 21분</li>
            <li>• 이태원역 4번 출구 – 도보 20분</li>
          </ul>
          <h3>버스 이용</h3>
          <ul>
            <li>• 이태원 방면) 🚌 400 / 405 / 421</li>
            <li class="indent">‘보광동주민센터’ 정류장 하차 - 도보 5분</li>
            <li>• 한남대교 방면) 🚌 400 / 405 / 421</li>
            <li class="indent">‘보광동신동아아파트’ 정류장 하차 - 도보 6분</li>
            <li class="indent">🚌 2016 / 6211</li>
            <li class="indent">‘보광신동아아파트.삼성리버빌아파트’ 정류장 하차 - 도보 8분</li>
            <li class="indent">🚌 용산 01번</li>
            <li class="indent">‘보광동주민센터’ 정류장 하차 후 언덕길 도보 4분</li>
          </ul>
          <h2>차량</h2>
          <p>주차 불가</p>
        </div>
      </div>
    </div>
  </div>
</template>
