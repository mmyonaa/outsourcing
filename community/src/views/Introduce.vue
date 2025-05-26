<script lang="ts">
import Instagram from '@/components/home/Instagram.vue';
import News from '@/components/home/News.vue';
import Notice from '@/components/home/Notice.vue';
import Popular from '@/components/home/Popular.vue';
import Search from '@/components/home/Search.vue';
import Tutorial from '@/components/home/Tutorial.vue';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'Home',
  components: { Instagram, Notice, Popular, Tutorial, Search, News },
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
    <h1>극장 소개</h1>
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
    <div class="wrapper-item">
      <div class="theater-img">
            <img src="/assets/images/theater/introduce-2.JPG" />
        </div>
      <div class="text history-timeline">
        <div class="history-item">
          <span class="year">2017.07.07</span>
          <span class="desc">창작예술집단 보광극장 창단</span>
        </div>
        <div class="divider"></div>

        <div class="history-item">
          <span class="year">2017</span>
          <span class="desc">창단기념 워크샵 공연 &lt;사랑해 라고 부름에 대한&gt;</span>
        </div>
        <div class="history-item">
          <span class="year">2017</span>
          <span class="desc">첫 번째 창작극 &lt;눈사탕&gt;</span>
        </div>
        <div class="divider"></div>

        <div class="history-item">
          <span class="year">2018</span>
          <span class="desc">두 번째 창작극 &lt;2018파우스트&gt;</span>
        </div>
        <div class="history-item">
          <span class="year">2019</span>
          <span class="desc">세 번째 창작극 &lt;장문로41가길&gt;</span>
        </div>
        <div class="history-item">
          <span class="year">2019</span>
          <span class="desc">네 번째 창작극 &lt;오후 두시의 고독&gt;</span>
        </div>
        <div class="divider"></div>

        <div class="history-item">
          <span class="year">2020</span>
          <span class="desc">극장 개관</span>
        </div>
        <div class="history-item">
          <span class="year">2020</span>
          <span class="desc">다섯 번째 창작극 &lt;민들레 홀씨&gt;</span>
        </div>
        <div class="history-item">
          <span class="year">2020</span>
          <span class="desc">연극 &lt;2018파우스트&gt; 재연 &lt;파우스트의 은밀한 실험실&gt;</span>
        </div>
        <div class="divider"></div>

        <div class="history-item">
          <span class="year">2020</span>
          <span class="desc">연극 &lt;장문로41가길&gt; 재연</span>
        </div>
        <div class="history-item">
          <span class="year">2020</span>
          <span class="desc">연극 &lt;눈사탕&gt; 재연 &lt;빈집의 온기&gt;</span>
        </div>
        <div class="divider"></div>

        <div class="history-item">
          <span class="year">2021</span>
          <span class="desc">여섯 번째 창작극 정기공연 &lt;별이 보이는 마을&gt;</span>
        </div>
        <div class="history-item">
          <span class="year">2022</span>
          <span class="desc">정기공연 &lt;비평가&gt;</span>
        </div>
        <div class="divider"></div>

        <div class="history-item">
          <span class="year">2022</span>
          <span class="desc">일곱 번째 창작극 &lt;맨땅에 헤딩&gt;</span>
        </div>
        <div class="history-item">
          <span class="year">2022</span>
          <span class="desc">창작 워크숍 &lt;맛보기&gt;</span>
        </div>
        <div class="divider"></div>

        <div class="history-item">
          <span class="year">2022</span>
          <span class="desc">여덟 번째 창작극 정기공연 &lt;살고 있어요, 보광동에&gt;</span>
        </div>
        <div class="history-item">
          <span class="year">2023</span>
          <span class="desc">정기공연 &lt;우리읍내&gt;</span>
        </div>
        <div class="divider"></div>

        <div class="history-item">
          <span class="year">2024</span>
          <span class="desc">아홉 번째 창작극 &lt;J와 H&gt;</span>
        </div>
        <div class="history-item">
          <span class="year">2024</span>
          <span class="desc">정기공연 &lt;댄스 댄스 에브리데이&gt;</span>
        </div>
        <div class="divider"></div>

        <div class="history-item">
          <span class="year">2025</span>
          <span class="desc">열 번째 창작극 맨땅의 헤딩 재연</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
