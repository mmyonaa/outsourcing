export const routesList = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  // {
  //   path: '/board/:mainTab',
  //   name: 'Board',
  //   component: () => import('../views/Board.vue'),
  // },
  // {
  //   path: '/board/:mainTab/:boardIdx',
  //   name: 'BoardDetail',
  //   component: () => import('../views/Board.vue'),
  // },
  // {
  //   path: '/login/result',
  //   name: 'LoginResult',
  //   component: () => import('../views/LoginResult.vue'),
  // },
  // {
  //   path: '/mypage',
  //   name: 'Mypage',
  //   component: () => import('../views/Mypage.vue'),
  // },
  // {
  //   path: '/write',
  //   name: 'Write',
  //   component: () => import('../views/Write.vue'),
  // },
  // {
  //   path: '/edit/:boardIdx',
  //   name: 'Edit',
  //   component: () => import('../views/Write.vue'),
  // },
  // {
  //   path: '/sso/logout/v2',
  //   name: 'Logout',
  //   component: () => import('../views/Logout.vue'),
  // },
];
