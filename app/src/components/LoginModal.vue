<template>
    <div v-if="visible" class="login-modal modal-overlay" @click.self="close">
        <div class="modal">
            <button class="modal-close" @click="close">×</button>
            <h2 class="modal-title">Login</h2>
            <form @submit.prevent="submitForm">
                <label>Email:
                    <input type="text" v-model="form.email" />
                    <span class="error-text" v-if="errors.email">{{ errors.email }}</span>
                </label>

                <label>Password:
                    <input type="password" v-model="form.password" />
                    <span class="error-text" v-if="errors.password">{{ errors.password }}</span>
                </label>
                <span class="error-text" v-if="errors.api">{{ errors.api }}</span>
                <div class="modal-actions">
                    <button type="submit" class="submit-button" :disabled="loading">
                        {{ loading ? 'Logging in...' : 'Login' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits, reactive, ref } from 'vue'
    import '@/assets/css/LoginModal.css'

    const props = defineProps({
        visible: Boolean
    })
    const emit = defineEmits(['close', 'login'])

    const form = reactive({
        email: '',
        password: ''
    })

    const errors = reactive({
        email: '',
        password: '',
        api: ''
    })

    const loading = ref(false)

    function clearErrors() {
        errors.email = ''
        errors.password = ''
        errors.api = ''
    }

    function clearForm() {
        form.email = ''
        form.password = ''
        clearErrors()
    }

    function close() {
        clearForm()
        emit('close')
    }

    async function submitForm() {
        clearErrors()
        let valid = true

        // Basic client-side validation
        if (!form.email) {
            errors.email = 'Email is required.'
            valid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = 'Invalid email format.'
            valid = false
        }

        // Password validation pattern (at least 8 characters, one uppercase, one lowercase, one number, one special character)
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!form.password) {
            errors.password = 'Password is required.';
            valid = false;
        } else if (!passwordPattern.test(form.password)) {
            errors.password = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
            valid = false;
        }

        if (!valid) return

        loading.value = true

        try {
            const response = await fetch('http://laravel_app.local/api/customer/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            })

            const data = await response.json()

            if (response.status === 422) {
                if (data.errors) {
                    errors.email = data.errors.email?.[0] || ''
                    errors.password = data.errors.password?.[0] || ''
                } else {
                    errors.api = data.message || 'Validation failed.'
                }
                loading.value = false
                return
            }

            if (response.status === 401) {
                errors.api = data.message || 'Incorrect email or password. Please try again.'
                loading.value = false
                return
            }

            if (!response.ok) {
                errors.api = data.message || 'Login failed.'
                loading.value = false
                return
            }

            // ✅ Success — save to localStorage
            localStorage.setItem('token', data.token)
            localStorage.setItem('customer', JSON.stringify(data.customer))

            // Emit to parent
            emit('login', {
                token: data.token,
                customer: data.customer
            })

            close()

        } catch (err) {
            console.error(err)
            errors.api = 'Something went wrong. Please try again later.'
        } finally {
            loading.value = false
        }
    }
</script>
