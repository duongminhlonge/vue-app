import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../components/MainLayout.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomeView },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router