<template>
    <div class="settings-page">
        <h2>📚 Learning Settings</h2>
        <p v-if="savedMessage" class="saved-msg">✅ Settings saved!</p>
        <div class="form-group">
            <label for="wordCount">
                How many vocabulary words do you want to learn per day?
            </label>
            <select v-model="selectedWordCount" id="wordCount">
                <option v-for="count in wordOptions" :key="count" :value="count">
                    {{ count }}
                </option>
            </select>
        </div>

        <button @click="saveSettings">💾 Save Settings</button>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    const wordOptions = [1, 2, 3, 4, 5]
    const STORAGE_KEY = 'dailyWordCount'

    // Load saved setting or default to 1
    const selectedWordCount = ref(
        parseInt(localStorage.getItem(STORAGE_KEY)) || 1
    )

    const savedMessage = ref(false)

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, selectedWordCount.value)
        savedMessage.value = true
        setTimeout(() => (savedMessage.value = false), 2000) // Hide message after 2 sec
    }
</script>

<style scoped>
    .settings-page {
        max-width: 400px;
        margin: 40px auto;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        font-family: 'Segoe UI', sans-serif;
    }

    h2 {
        margin-bottom: 20px;
        color: #333;
        text-align: center;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
    }

    select {
        padding: 8px 10px;
        font-size: 16px;
        border-radius: 6px;
        border: 1px solid #ccc;
    }

    button {
        width: 100%;
        background-color: #dc3545;
        color: white;
        padding: 12px 0;
        font-size: 16px;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #c82333;
    }

    .saved-msg {
        margin-top: 15px;
        text-align: center;
        color: #2d6a4f;
        font-weight: bold;
    }
</style>
