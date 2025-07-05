<!-- src/components/EmailConfirmNoticeModal.vue -->
<template>
    <div class="modal-overlay" @click.self="emit('close')">
        <div class="modal">
            <button class="modal-close" @click="emit('close')">×</button>
            <h2 class="modal-title">Check Your Email</h2>
            <p>
                ✅ Registration successful! A confirmation email has been sent to
                <strong>{{ email }}</strong>. Please verify your email before logging in.
            </p>
        </div>
    </div>
</template>

<script setup>
    import '@/assets/css/EmailConfirmNoticeModal.css'

    const props = defineProps({
        email: {
            type: String,
            required: true
        }
    })
    const emit = defineEmits(['close'])
</script>
