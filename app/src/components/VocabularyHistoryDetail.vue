<template>
  <div class="daily-words">
    <h1>📘 Vocabulary from {{ date || 'Past Task' }}</h1>

    <div class="word-grid">
      <!-- Word Cards -->
      <div
        v-for="(word, index) in words"
        :key="index"
        class="word-card"
        :class="word.type"
      >
        <div class="card-header">
          <h2 class="word">{{ word.word }}</h2>
          <span class="type-tag">{{ capitalize(word.type) }}</span>
        </div>

        <div class="pronunciations">
          <p><strong>US:</strong> / {{ word.pronunciationUS }} /</p>
          <p><strong>UK:</strong> / {{ word.pronunciationUK }} /</p>
        </div>

        <ul class="word-details">
          <li><strong>Definition:</strong> {{ word.definition }}</li>
          <li><strong>Example:</strong> {{ word.example }}</li>
        </ul>

        <div class="card-actions">
          <button @click="playAudio(word.word, 'en-US')">🔊 US</button>
          <button @click="playAudio(word.word, 'en-GB')">🔊 UK</button>
          <button @click="searchGoogle(word.word)">🔍 Google</button>
        </div>
      </div>
    </div>

    <router-link to="/vocabulary-history" class="back-link">← Back to History</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '@/assets/css/DailyWords.css'

const route = useRoute()
const router = useRouter()

const taskId = route.params.id
const token = ref(localStorage.getItem('token') || '')
const words = ref([])
const date = ref('')

async function fetchTaskWords() {
  try {
    const res = await fetch(
      `http://laravel_app.local/api/words/get-customer-daily-words-by-id?task_id=${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: 'application/json',
        },
      }
    )

    const json = await res.json()

    if (json.success) {
      words.value = json.data.map(w => ({
        word: w.word,
        type: w.type,
        pronunciationUS: w.pronunciationUS,
        pronunciationUK: w.pronunciationUK,
        definition: w.definition,
        example: w.example,
      }))
      date.value = json.date || ''
    } else {
      console.warn('Failed to fetch task words:', json.message || json)
      router.push('/vocabulary-history')
    }
  } catch (err) {
    console.error('Error fetching task detail:', err)
    router.push('/vocabulary-history')
  }
}

function playAudio(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  speechSynthesis.speak(utterance)
}

function searchGoogle(word) {
  const query = encodeURIComponent(word)
  window.open(`https://www.google.com/search?q=${query}`, '_blank')
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

onMounted(() => {
  if (!token.value) {
    router.push('/')
  } else {
    fetchTaskWords()
  }
})
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin-top: 30px;
  font-size: 0.9rem;
  color: #007bff;
  text-decoration: underline;
}
.back-link:hover {
  text-decoration: none;
}
</style>
