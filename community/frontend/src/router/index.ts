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
  {
    path: '/performance/detail',
    name: 'performanceDetail',
    component: () => import('../views/PerformanceDetail.vue'),
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
  // 4. 공지사항
  // 공지사항
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
  // 보도자료
  {
    path: '/news',
    name: 'news',
    component: () => import('../views/News.vue'),
  },
  {
    path: '/news/detail',
    name: 'newsDetail',
    component: () => import('../views/NewsDetail.vue'),
  },
  //************ ADMIN ************* */
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/Admin.vue'),
  },
  {
    path: '/admin/notice',
    name: 'adminNotice',
    component: () => import('../views/admin/AdminNotice.vue'),
  },
  {
    path: '/admin/notice/detail',
    name: 'adminNoticeDetail',
    component: () => import('../views/admin/AdminNoticeDetail.vue'),
  },
  {
    path: '/admin/notice/assign',
    name: 'adminNoticeAssign',
    component: () => import('../views/admin/AdminNoticeAssign.vue'),
  },
  {
    path: '/admin/news',
    name: 'adminNews',
    component: () => import('../views/admin/AdminNews.vue'),
  },
  {
    path: '/admin/news/detail',
    name: 'adminNewsDetail',
    component: () => import('../views/admin/AdminNewsDetail.vue'),
  },
  {
    path: '/admin/news/assign',
    name: 'adminNewsAssign',
    component: () => import('../views/admin/AdminNewsAssign.vue'),
  },
  {
    path: '/admin/performance',
    name: 'adminPerformance',
    component: () => import('../views/admin/AdminPerformance.vue'),
  },
  {
    path: '/admin/performance/detail',
    name: 'adminPerformanceDetail',
    component: () => import('../views/admin/AdminPerformanceDetail.vue'),
  },
  {
    path: '/admin/performance/assign',
    name: 'adminPerformanceAssign',
    component: () => import('../views/admin/AdminPerformanceAssign.vue'),
  },
  {
    path: '/admin/performance/next',
    name: 'adminPerformanceNext',
    component: () => import('../views/admin/AdminPerformanceNext.vue'),
  },
];
