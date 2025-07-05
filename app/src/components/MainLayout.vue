<template>
    <div>
        <nav class="main-nav">
            <router-link to="/" exact>🏠Home</router-link>
            <a href="#" @click.prevent="showRegisterModal = true">Register</a>
            <a href="#" @click.prevent="showLoginModal = true">Login</a>
        </nav>

        <main class="main-content">
            <router-view />
        </main>

        <RegisterModal :visible="showRegisterModal" @close="showRegisterModal = false" />
        <LoginModal :visible="showLoginModal" @close="showLoginModal = false" @login="handleLogin" />
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import '@/assets/css/MainLayout.css'
    import RegisterModal from './RegisterModal.vue'
    import LoginModal from './LoginModal.vue' // ✅ Import Login modal

    const showRegisterModal = ref(false)
    const showLoginModal = ref(false)

    function handleLogin(credentials) {
        console.log('User login data:', credentials)
        // TODO: Add login API logic or auth integration here
    }
</script>
