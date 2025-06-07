export const routesList = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  // 1. 소개
  // 극장소개
  {
    path: '/introduce',
    name: 'introduce',
    component: () => import('../views/Introduce.vue'),
  },
  // 단체 소개
  {
    path: '/introduce/org',
    name: 'introduceOrg',
    component: () => import('../views/IntroduceOrg.vue'),
  },
  // 오시는 길
  {
    path: '/introduce/route',
    name: 'introduceRoute',
    component: () => import('../views/IntroduceRoute.vue'),
  },
  // 2. 공연
  // 역대 공연
  {
    path: '/performance',
    name: 'performance',
    component: () => import('../views/Performance.vue'),
  },
  // 예정 공연
  {
    path: '/performance/next',
    name: 'performanceNext',
    component: () => import('../views/PerformanceNext.vue'),
  },
  // 3. 대관
  // 극장 상세사항
  {
    path: '/rental',
    name: 'rental',
    component: () => import('../views/Rental.vue'),
  },
  // 대관 안내
  {
    path: '/rental/info',
    name: 'rentalInfo',
    component: () => import('../views/RentalInfo.vue'),
  },
  // 대관 스케줄
  {
    path: '/rental/schedule',
    name: 'rentalSchedule',
    component: () => import('../views/RentalSchedule.vue'),
  },
  // 대관 신청 링크
  {
    path: '/rental/link',
    name: 'rentalLink',
    component: () => import('../views/RentalLink.vue'),
  },
  // 4. 공지사항
  {
    path: '/notice',
    name: 'notice',
    component: () => import('../views/Notice.vue'),
  },
  {
    path: '/notice/detail',
    name: 'noticeDetail',
    component: () => import('../views/NoticeDetail.vue'),
  },
];
