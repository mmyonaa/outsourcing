<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'performance',
  components: {  },
  setup() {

  const activeIndex = ref<number>(0)

  const posters = [
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: 'Poster 1에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: 'Poster 2에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: 'Poster 3에 대한 설명입니다.',
    },
    {
      image: '/assets/images/theater/introduce-1.JPG',
      description: 'Poster 4에 대한 설명입니다.',
    },
  ]

    onMounted(() => {
  
    });
    return {
      posters,
      activeIndex
    };
  },
});
</script>

<template>
  <div class="page-common introduce-page reservation-page">
    <h1>예정 공연</h1>
    <div class="content-wrapper">
      <div class="poster">
        <img src="/assets/images/theater/introduce-1.JPG" alt="맨땅에 헤딩 포스터" />
      </div>
      <div class="info">
        <h2 class="title">맨땅에 헤딩</h2>
        <button class="btn-reserve">예매하기</button>
        <p class="date">25.05.09 ~ 25.05.18 평일 19시 30분 주말 15시 (월화 공연 없음)</p>
        <blockquote class="quote">
          “바다가 사라진 세상에서 펼쳐지는,<br />
          ‘낚시하는 사람’과<br />
          ‘지나가는 사람’ 그리고 ‘우리’의 이야기“
        </blockquote>
        <dl class="details">
          <div>
            <dt>작 / 연출</dt>
            <dd>강민수</dd>
          </div>
          <div>
            <dt>출연</dt>
            <dd>김창모, 박지연, 임혜선, 신유정, 박준석, 신유정</dd>
          </div>
          <div>
            <dt>기획</dt>
            <dd>박석빈</dd>
          </div>
          <div>
            <dt>조명</dt>
            <dd>아무개</dd>
          </div>
          <div>
            <dt>음향</dt>
            <dd>아무개</dd>
          </div>
        </dl>
      </div>
    </div>
</div>
</template>
