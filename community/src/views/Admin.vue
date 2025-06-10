<script lang="ts">
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'admin',
  components: { ApocImageSet, },
  setup() {
    const router=useRouter();
    const activeReserveIndex = ref<number>(0)
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

  const notices = [
  {
    id: 1,
    title: '서버 점검 안내 (6월 5일)',
    date: '2025-06-01',
  },
  {
    id: 2,
    title: '신규 기능 업데이트',
    date: '2025-05-28',
  },
  {
    id: 3,
    title: '정책 변경 안내',
    date: '2025-05-20',
  },
  {
    id: 4,
    title: '서비스 개선 안내',
    date: '2025-05-18',
  },
]

    onMounted(() => {
  
    });
    return {
      posters,
      notices,
      activeReserveIndex
    };
  },
});
</script>

<template>
</template>
