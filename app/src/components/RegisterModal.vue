<template>
    <div v-if="visible" class="register-modal modal-overlay" @click.self="close">
        <div class="modal">
            <button class="modal-close" @click="close">×</button>
            <h2 class="modal-title">Register</h2>
            <form @submit.prevent="submitForm">
                <label>First Name:
                    <input type="text" v-model="form.first_name"/>
                    <span class="error-text" v-if="errors.first_name">{{ errors.first_name }}</span>
                </label>

                <label>Last Name:
                    <input type="text" v-model="form.last_name"/>
                    <span class="error-text" v-if="errors.last_name">{{ errors.last_name }}</span>
                </label>

                <label>Gender:
                    <select v-model="form.gender">
                        <option disabled value="">Select</option>
                        <option>male</option>
                        <option>female</option>
                        <option>other</option>
                    </select>
                    <span class="error-text" v-if="errors.gender">{{ errors.gender }}</span>
                </label>

                <label>Email:
                    <input type="text" v-model="form.email"/>
                    <span class="error-text" v-if="errors.email">{{ errors.email }}</span>
                </label>

                <label>Password:
                    <input type="password" v-model="form.password"/>
                    <span class="error-text" v-if="errors.password">{{ errors.password }}</span>
                </label>

                <label>Confirm Password:
                    <input type="password" v-model="form.confirm_password"/>
                    <span class="error-text" v-if="errors.confirm_password">{{ errors.confirm_password }}</span>
                </label>

                <span class="error-text" v-if="errors.api">{{ errors.api }}</span>

                <div class="modal-actions">
                    <button type="submit" class="submit-button" :disabled="loading">
                        {{ loading ? 'Registering...' : 'Submit' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits, reactive, ref } from 'vue'
    import '@/assets/css/RegisterModal.css'

    const props = defineProps({
        visible: Boolean
    })
    const emit = defineEmits(['close', 'register'])

    const form = reactive({
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        password: '',
        confirm_password: ''
    })

    const errors = reactive({
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        password: '',
        confirm_password: '',
        api: ''
    })

    const loading = ref(false)

    function clearErrors() {
        for (const key in errors) {
            errors[key] = ''
        }
    }

    function clearForm() {
        Object.assign(form, {
            first_name: '',
            last_name: '',
            gender: '',
            email: '',
            password: '',
            confirm_password: ''
        })
        clearErrors()
    }

    function close() {
        clearForm()
        emit('close')
    }

    async function submitForm() {
        clearErrors()

        let valid = true

        if (!form.first_name) {
            errors.first_name = 'First name is required.';
            valid = false;
        } else if (form.first_name.length > 25) {
            errors.first_name = 'First name must be 25 characters or less.';
            valid = false;
        }

        if (!form.last_name) {
            errors.last_name = 'Last name is required.';
            valid = false;
        } else if (form.last_name.length > 25) {
            errors.last_name = 'Last name must be 25 characters or less.';
            valid = false;
        }

        if (!form.gender) {
            errors.gender = 'Gender is required.'
            valid = false
        }

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

        if (!form.confirm_password) {
            errors.confirm_password = 'Please confirm your password.';
            valid = false;
        } else if (form.password !== form.confirm_password) {
            errors.confirm_password = 'Passwords do not match.';
            valid = false;
        }

        if (!valid) return

        loading.value = true

        try {
            const response = await fetch('http://laravel_app.local/api/customer/register', {
                method: 'POST',
                body: (() => {
                    const formData = new FormData()
                    formData.append('first_name', form.first_name)
                    formData.append('last_name', form.last_name)
                    formData.append('gender', form.gender.toLowerCase())
                    formData.append('email', form.email)
                    formData.append('password', form.password)
                    return formData
                })()
            })

            const data = await response.json()

            if (response.status === 422) {
                if (data.errors) {
                    errors.first_name = data.errors.first_name?.[0] || ''
                    errors.last_name = data.errors.last_name?.[0] || ''
                    errors.gender = data.errors.gender?.[0] || ''
                    errors.email = data.errors.email?.[0] || ''
                    errors.password = data.errors.password?.[0] || ''
                } else {
                    errors.api = data.message || 'Validation failed.'
                }
                loading.value = false
                return
            }

            if (!response.ok) {
                errors.api = data.message || 'Registration failed.'
                loading.value = false
                return
            }

            emit('register', {
                email: form.email,
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

<style scoped>
    .submit-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>
