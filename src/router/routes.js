import loginRoutes from './login'
import kategoriRoutes from './kategori'
import produkRoutes from './produk'

const routes = [
  ...loginRoutes,
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'sso',
        component: () => import('@/pages/IndexPage.vue'),
      },
      ...kategoriRoutes,
      ...produkRoutes,
      { path: 'second', component: () => import('@/pages/SecondPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
