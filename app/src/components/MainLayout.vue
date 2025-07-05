<template>
    <div>
        <nav class="main-nav">
            <router-link to="/" exact>🏠Home</router-link>
            <a href="#" @click.prevent="showRegisterModal = true">Register</a>
        </nav>

        <main class="main-content">
            <router-view />
        </main>

        <RegisterModal :visible="showRegisterModal" @close="showRegisterModal = false" />
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import '@/assets/css/MainLayout.css'
    import RegisterModal from './RegisterModal.vue'

    const showRegisterModal = ref(false)
</script>