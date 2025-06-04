<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'Home',
  components: { },
  setup() {

    onMounted(() => {
  
    });
    return {
    };
  },
});
</script>

<template>
  <div class="page-common introduce-page">
    <h1>단체 소개</h1>
    <div class="wrapper">
      <div class="wrapper-item">
      <div class="theater-img">
          <img src="/assets/images/theater/introduce-1.JPG" />
      </div>
      <div class="text">
        <strong>
          예술을 사랑하는 젊은 청년들 (寶, 보배 보)이 모여
        하나의 촛불이 큰 빛(光, 빛날 광)이 돼 듯, 시작되었습니다.
        우리는 우리의 이야기를 전할 수 있는 모든 예술을 지향합니다.
        </strong>
        <div class="text-divider"></div>
        창작예술집단 보광극장은 2017년 7월 창단하여 현재까지 활발하게 운영 중인 용산구 지역극장이자 청년예술가들의 창작집단이다. 용산구 보광동에 위치한 보광
        극장을 운영 중인 상주단체로 지역극장으로써 대학로 중심의 예술을 벗어나 보다
        다양한 시도와 적극적인 시민참여 프로그램 등을 운영하며 지역 주민들의 예술 접근성을 높이기 위한 다양한 시도를 하고 있다. 주변 상가, 주민센터, 학교, 노인 복지회관등과 연대를 발전시키며 지인과 연극인들이 주를 이루는 관객 형태에서 벗어나 일반 시민들이 공연문화에 접근하는 발판을 마련하고 있다.
      </div>
    </div>
  </div>
  </div>
</template>
