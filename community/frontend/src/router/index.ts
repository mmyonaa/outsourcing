import type { RouteLocationNormalized } from 'vue-router';

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
    path: '/performance/:id',
    name: 'performanceDetail',
    component: () => import('../views/PerformanceDetail.vue'),
  },
  // 옛 URL(쿼리 파라미터 형식) → 새 경로 형식 리디렉션. id가 동일하므로 그대로 매핑.
  {
    path: '/performance/detail',
    redirect: (to: RouteLocationNormalized) => (to.query.id ? `/performance/${to.query.id}` : '/performance'),
  },
  // 예정 공연
  {
    path: '/performance/next',
    name: 'performanceNext',
    component: () => import('../views/PerformanceNext.vue'),
  },
  {
    path: '/performance/next/:id',
    name: 'performanceNextDetail',
    component: () => import('../views/PerformanceNextDetail.vue'),
  },
  {
    path: '/performance/next/detail',
    redirect: (to: RouteLocationNormalized) => (to.query.id ? `/performance/next/${to.query.id}` : '/performance/next'),
  },
  // 3. 대관
  // 공간 안내
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
    path: '/notice/:id',
    name: 'noticeDetail',
    component: () => import('../views/NoticeDetail.vue'),
  },
  {
    path: '/notice/detail',
    redirect: (to: RouteLocationNormalized) => (to.query.id ? `/notice/${to.query.id}` : '/notice'),
  },
  // 보도자료
  {
    path: '/news',
    name: 'news',
    component: () => import('../views/News.vue'),
  },
  {
    path: '/news/:id',
    name: 'newsDetail',
    component: () => import('../views/NewsDetail.vue'),
  },
  {
    path: '/news/detail',
    redirect: (to: RouteLocationNormalized) => (to.query.id ? `/news/${to.query.id}` : '/news'),
  },
  //************ ADMIN ************* */
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/Admin.vue'),
  },
  {
    path: '/admin/banner',
    name: 'adminBanner',
    component: () => import('../views/admin/AdminBanner.vue'),
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
  {
    path: '/admin/performance/next/detail',
    name: 'adminPerformanceNextDetail',
    component: () => import('../views/admin/AdminPerformanceNextDetail.vue'),
  },
  {
    path: '/admin/performance/next/assign',
    name: 'adminPerformanceNextAssign',
    component: () => import('../views/admin/AdminPerformanceNextAssign.vue'),
  },
];
