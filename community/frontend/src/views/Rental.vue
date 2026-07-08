<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {},
  setup() {
    const activeIndex = ref<number>(0);
    const posters = [
      {
        image: '/assets/images/theater/theater-1.JPG',
        description: 'Image 1에 대한 설명입니다.',
      },
      {
        image: '/assets/images/theater/theater-2.JPG',
        description: 'Image 2에 대한 설명입니다.',
      },
      {
        image: '/assets/images/theater/theater-3.JPG',
        description: 'Image 3에 대한 설명입니다.',
      },
      {
        image: '/assets/images/theater/theater-4.JPG',
        description: 'Image 4에 대한 설명입니다.',
      },
      {
        image: '/assets/images/theater/theater-5.JPG',
        description: 'Image 5에 대한 설명입니다.',
      },
      {
        image: '/assets/images/theater/theater-6.JPG',
        description: 'Image 6에 대한 설명입니다.',
      },
    ];

    onMounted(() => {});
    return {
      posters,
      activeIndex,
    };
  },
});
</script>

<template>
  <div class="page-common rental-page">
    <h1>공간 안내</h1>
    <div class="rental-description">
      <p>보광극장은 창작 중심의 극장으로, 고정 객석을 갖춘 프로시니엄 구조를 기본으로 합니다.</p>
      <p>무대 공간을 활용해 객석을 추가 설치하거나 공연 형태에 맞게 재구성할 수 있어</p>
      <p>연극, 무용, 음악, 다원예술 등 다양한 장르의 공연이 가능합니다.</p>
      <p>예술가들의 자유로운 실험과 창작을 지원하는 열린 극장입니다.</p>
    </div>
    <div class="content-container">
      <!-- 좌측: 갤러리 -->
      <div class="gallery-section">
        <img loading="lazy" :src="posters[activeIndex].image" class="big-image" alt="대관 포스터" />
        <div class="poster-gallery">
          <div class="poster" v-for="(poster, index) in posters" :key="index" :class="{ active: activeIndex === index }" @click="activeIndex = index">
            <img loading="lazy" :src="poster.image" :alt="'Poster ' + (index + 1)" />
          </div>
        </div>
      </div>

      <!-- 우측: 추가 이미지 -->
      <div class="info-section">
        <router-link to="/notice/57275967-0e45-4878-b639-7a78c60bebe5" class="down-link">
          대관 관련 자료 다운받기
        </router-link>
        <img src="/assets/images/theater/pyo.png" alt="극장 정보" class="info-image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rental-description {
  text-align: center;
  margin: 2rem auto 3rem;
  max-width: 800px;
  padding: 0 2rem;
  font-family: 'Pretendard', sans-serif;
}

.rental-description p {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin: 0.5rem 0;
}

/* 좌우 비율 조정: 좌측(갤러리) 40%, 우측(정보) 60% */
.content-container {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.gallery-section,
.info-section {
  width: 100%;
}

  .down-link {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 3rem;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    background: #e34363;
    border-radius: 999px;
    padding: 0.9rem 1.7rem;
    text-decoration: none;
    transition: background 0.18s ease, transform 0.18s ease;

    &::before {
      content: '\2b07';
      font-size: 14px;
    }

    &:hover {
      background: #c22a4a;
      transform: translateY(-1px);
    }
  }

/* 갤러리 섹션 */
.big-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.poster-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
}

.poster {
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.poster:hover {
  border-color: #736e92;
  transform: translateY(-2px);
}

.poster.active {
  border-color: #736e92;
  box-shadow: 0 4px 12px rgba(115, 110, 146, 0.3);
}

.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 정보 섹션 */
.info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.info-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 태블릿 */
@media (max-width: 1024px) {
  .content-container {
    gap: 2rem;
    padding: 0 1.5rem;
  }

  .poster-gallery {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
}

/* 모바일 */
@media (max-width: 768px) {
  .rental-description {
    margin: 1.5rem auto 2rem;
    padding: 0 1.5rem;
  }

  .rental-description p {
    font-size: 15px;
    line-height: 1.7;
  }

  .content-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .poster-gallery {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .rental-description {
    padding: 0 1rem;
  }

  .rental-description p {
    font-size: 14px;
    line-height: 1.6;
  }

  .content-container {
    padding: 0 1rem;
    gap: 2rem;
  }

  .poster-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
