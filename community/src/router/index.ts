export const routesList = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/introduce',
    name: 'introduce',
    component: () => import('../views/Introduce.vue'),
  },
  {
    path: '/performance',
    name: 'performance',
    component: () => import('../views/Performance.vue'),
  },
  {
    path: '/rental',
    name: 'rental',
    component: () => import('../views/Rental.vue'),
  },
  {
    path: '/notice',
    name: 'notice',
    component: () => import('../views/Notice.vue'),
  },
];
