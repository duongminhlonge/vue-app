<template>
    <div>
        <nav class="main-nav">
            <router-link to="/" exact>🏠Home</router-link>

            <!-- Show Register & Login only if NOT logged in -->
            <template v-if="!isLoggedIn">
                <a href="#" @click.prevent="showRegisterModal = true">Register</a>
                <a href="#" @click.prevent="showLoginModal = true">Login</a>
            </template>

            <!-- Show Logout only if logged in -->
            <template v-else>
                <a href="#" @click.prevent="logout">Logout</a>
            </template>

            <a href="#" @click.prevent="showAboutModal = true">About</a>
        </nav>

        <main class="main-content">
            <router-view />
        </main>

        <RegisterModal :visible="showRegisterModal" @close="showRegisterModal = false" />
        <LoginModal :visible="showLoginModal" @close="showLoginModal = false" @login="handleLogin" />
        <AboutModal :visible="showAboutModal" @close="showAboutModal = false" />
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import '@/assets/css/MainLayout.css'
    import RegisterModal from './RegisterModal.vue'
    import LoginModal from './LoginModal.vue'
    import AboutModal from './AboutModal.vue'

    const showRegisterModal = ref(false)
    const showLoginModal = ref(false)
    const showAboutModal = ref(false)

    // Reactive refs to hold user data from localStorage
    const token = ref(localStorage.getItem('token'))
    const customer = ref(localStorage.getItem('customer') ? JSON.parse(localStorage.getItem('customer')) : null)

    // Computed to check login status
    const isLoggedIn = computed(() => !!token.value && !!customer.value)

    function handleLogin(credentials) {
        // Save token and customer to localStorage
        token.value = credentials.token
        customer.value = credentials.customer
        localStorage.setItem('token', credentials.token)
        localStorage.setItem('customer', JSON.stringify(credentials.customer))

        // Close modals after login
        showLoginModal.value = false
        showRegisterModal.value = false

        console.log('User logged in:', credentials)
    }

    // Logout function: clear localStorage and reset refs
    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('customer')
        token.value = null
        customer.value = null
    }
</script>
