<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal">
            <button class="modal-close" @click="close">×</button>
            <h2 class="modal-title">Register</h2>
            <form @submit.prevent="submitForm">
                <label>First Name:
                    <input type="text" v-model="form.firstname"/>
                    <span class="error-text" v-if="errors.firstname">{{ errors.firstname }}</span>
                </label>

                <label>Last Name:
                    <input type="text" v-model="form.lastname"/>
                    <span class="error-text" v-if="errors.lastname">{{ errors.lastname }}</span>
                </label>

                <label>Gender:
                    <select v-model="form.gender">
                        <option disabled value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
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
                    <input type="password" v-model="form.confirmPassword"/>
                    <span class="error-text" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
                </label>

                <div class="modal-actions">
                    <button type="submit" class="submit-button">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>


<script setup>
    import {defineProps, defineEmits, reactive, ref} from 'vue'
    import '@/assets/css/RegisterModal.css'

    const props = defineProps({
        visible: Boolean
    })
    const emit = defineEmits(['close'])

    const form = reactive({
        email: '',
        password: '',
        confirmPassword: '',
        firstname: '',
        lastname: '',
        gender: ''
    })

    const errors = reactive({
        email: '',
        password: '',
        confirmPassword: '',
        firstname: '',
        lastname: '',
        gender: ''
    })

    function close() {
        clearForm()
        emit('close')
    }

    function clearErrors() {
        for (const key in errors) {
            errors[key] = ''
        }
    }

    function clearForm() {
        Object.assign(form, {
            email: '',
            password: '',
            confirmPassword: '',
            firstname: '',
            lastname: '',
            gender: ''
        })
        clearErrors()
    }

    function submitForm() {
        clearErrors()

        let valid = true

        if (!form.firstname) {
            errors.firstname = 'First name is required.'
            valid = false
        }

        if (!form.lastname) {
            errors.lastname = 'Last name is required.'
            valid = false
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

        if (!form.password) {
            errors.password = 'Password is required.'
            valid = false
        }

        if (!form.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password.'
            valid = false
        } else if (form.password !== form.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.'
            valid = false
        }

        if (!valid) return

        console.log('Form submitted:', form)

        clearForm()
        emit('close')
    }
</script>
