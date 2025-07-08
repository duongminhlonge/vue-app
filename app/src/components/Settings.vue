<template>
  <div class="settings-page">
    <h2>Settings</h2>
    <p v-if="savedMessage" class="success-message">Settings saved!</p>

    <div class="form-group">
      <label for="wordCount">How many vocabulary words do you want to learn per day?</label>
      <select v-model.number="selectedWordCount" id="wordCount">
        <option v-for="count in wordOptions" :key="count" :value="count">
          {{ count }}
        </option>
      </select>
    </div>

    <button @click="saveSettings" :disabled="loading">
      💾 Save Settings
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '@/assets/css/Settings.css'

const wordOptions = [1, 2, 3, 4, 5]
const API_URL = 'http://laravel_app.local/api/customer/settings'

const selectedWordCount = ref(null)
const savedMessage = ref(false)
const loading = ref(false)

// Get token from localStorage
function getAuthToken() {
  return localStorage.getItem('token') || ''
}

async function fetchSettings() {
  loading.value = true
  try {
    const token = getAuthToken()
    if (!token) throw new Error('No auth token found')

    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error('Failed to fetch settings')

    const json = await res.json()
    const data = json.settings || {}

    if (data.vocab_per_day) selectedWordCount.value = data.vocab_per_day
  } catch (error) {
    console.error('Error fetching settings:', error)
  } finally {
    loading.value = false
  }
}

async function saveSettings() {
  loading.value = true
  try {
    const token = getAuthToken()
    if (!token) throw new Error('No auth token found')

    const payload = {
      data: {
        vocab_per_day: selectedWordCount.value,
      }
    }
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Failed to save settings')

    savedMessage.value = true
    setTimeout(() => (savedMessage.value = false), 2000)
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

