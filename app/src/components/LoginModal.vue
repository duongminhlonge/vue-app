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

                <div class="modal-actions">
                    <button type="submit" class="submit-button">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits, reactive } from 'vue'
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
        password: ''
    })

    function clearErrors() {
        errors.email = ''
        errors.password = ''
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

    function submitForm() {
        clearErrors()
        let valid = true

        if (!form.email) {
            errors.email = 'Email is required.'
            valid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = 'Invalid email format.'
            valid = false
        }

        if (!form.password) {
            errors.password = 'Password is required.'
            valid = false
        }

        if (!valid) return

        console.log('Login submitted:', form)
        emit('login', { email: form.email, password: form.password })
        close()
    }
</script>
