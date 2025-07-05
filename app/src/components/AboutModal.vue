<template>
    <div v-if="visible" class="about-modal modal-overlay" @click.self="close">
        <div class="modal">
            <button class="modal-close" @click="close">×</button>
            <h2 class="modal-title">About</h2>
            <div class="modal-content">
                <p>
                    Discover the power of learning 5 new words every day — completely free and backed by our vibrant community.
                </p>
                <p>
                    Sign up to personalize your daily word goals. Track your progress, complete your targets, and build a personalized vocabulary list of all the words you've mastered.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue'
    import '@/assets/css/AboutModal.css'

    const props = defineProps({
        visible: Boolean
    })
    const emit = defineEmits(['close'])

    function close() {
        emit('close')
    }
</script>