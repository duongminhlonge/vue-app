import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../components/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import MyProfileView from '../views/MyProfileView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomeView },
      {
        path: '/email-confirmation/success',
        component: () => import('@/components/EmailConfirmationSuccess.vue'),
      },
      {
        path: '/my-profile',
        name: 'my-profile',
        component: MyProfileView
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
