import {createRouter, createWebHistory} from 'vue-router'
import MainLayout from '../components/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import MyProfileView from '../views/MyProfileView.vue'
import SettingsView from '../views/SettingsView.vue'
import VocabularyExamView from '../views/VocabularyExamView.vue'
import VocabularyHistoryView from '../views/VocabularyHistoryView.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {path: '', component: HomeView},
            {
                path: '/email-confirmation/success',
                component: () => import('@/components/EmailConfirmationSuccess.vue'),
            },
            {
                path: '/my-profile',
                name: 'my-profile',
                component: MyProfileView
            },
            {
                path: '/settings',
                name: 'settings',
                component: SettingsView
            },
            {
                path: '/vocabulary-exam',
                name: 'vocabulary-exam',
                component: VocabularyExamView
            },
            {
                path: '/vocabulary-history',
                name: 'vocabulary-history',
                component: VocabularyHistoryView
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
