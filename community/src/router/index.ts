export const routesList = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  // 1. 소개
  {
    path: '/introduce',
    name: 'introduce',
    component: () => import('../views/Introduce.vue'),
  },
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
  {
    path: '/performance',
    name: 'performance',
    component: () => import('../views/Performance.vue'),
  },
  // 3. 대관
  {
    path: '/rental',
    name: 'rental',
    component: () => import('../views/Rental.vue'),
  },
  // 4. 공지사항
  {
    path: '/notice',
    name: 'notice',
    component: () => import('../views/Notice.vue'),
  },
];
