const loginRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login/IndexPage.vue'),
  },
]

export default loginRoutes
