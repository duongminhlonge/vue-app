<template>
    <div>
        <nav class="main-nav">
            <div class="nav-left">
                <router-link to="/">🏠 Home</router-link>
                <a href="#" @click.prevent="showAboutModal = true">About</a>
            </div>

            <div class="nav-right">
                <template v-if="!isLoggedIn">
                    <a href="#" @click.prevent="showRegisterModal = true">Register</a>
                    <a href="#" @click.prevent="showLoginModal = true">Login</a>
                </template>
                <template v-else>
                    <a href="#" @click.prevent="logout">Logout</a>
                </template>
            </div>
        </nav>

        <main class="main-content">
            <router-view />
        </main>

        <RegisterModal
                :visible="showRegisterModal"
                @close="showRegisterModal = false"
                @register="onRegisterSuccess"
        />

        <LoginModal
                :visible="showLoginModal"
                @close="showLoginModal = false"
                @login="handleLogin"
        />

        <AboutModal
                :visible="showAboutModal"
                @close="showAboutModal = false"
        />

        <EmailConfirmNoticeModal
                v-if="showEmailNoticeModal"
                :email="emailJustRegistered"
                @close="showEmailNoticeModal = false"
        />
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import '@/assets/css/MainLayout.css'

    import RegisterModal from './RegisterModal.vue'
    import LoginModal from './LoginModal.vue'
    import AboutModal from './AboutModal.vue'
    import EmailConfirmNoticeModal from './EmailConfirmNoticeModal.vue'

    const showRegisterModal = ref(false)
    const showLoginModal = ref(false)
    const showAboutModal = ref(false)
    const showEmailNoticeModal = ref(false)
    const emailJustRegistered = ref('')

    const token = ref(localStorage.getItem('token'))
    const customer = ref(localStorage.getItem('customer') ? JSON.parse(localStorage.getItem('customer')) : null)

    const isLoggedIn = computed(() => !!token.value && !!customer.value)

    function handleLogin({ token: loginToken, customer: loginCustomer }) {
        token.value = loginToken
        customer.value = loginCustomer
        localStorage.setItem('token', loginToken)
        localStorage.setItem('customer', JSON.stringify(loginCustomer))

        showLoginModal.value = false
        showRegisterModal.value = false

        console.log('User logged in:', loginCustomer)
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('customer')
        token.value = null
        customer.value = null
    }

    function onRegisterSuccess({ email }) {
        showRegisterModal.value = false
        emailJustRegistered.value = email
        showEmailNoticeModal.value = true
    }

    async function verifyToken() {
        if (!token.value) return

        try {
            const response = await fetch('http://laravel_app.local/api/customer/me', {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    Accept: 'application/json'
                }
            })

            if (!response.ok) {
                logout()
                return
            }

            const data = await response.json()
            customer.value = data.customer
            localStorage.setItem('customer', JSON.stringify(data.customer))
        } catch (err) {
            console.error('Token verification failed:', err)
            logout()
        }
    }

    onMounted(() => {
        verifyToken()
    })
</script>
