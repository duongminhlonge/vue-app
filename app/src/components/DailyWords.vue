<template>
  <div class="daily-words">
    <h1>📚 Learn {{ words.length }} English Word{{ words.length === 1 ? '' : 's' }} Today</h1>

    <div class="word-grid">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '@/assets/css/DailyWords.css'

const words = ref([])
const token = ref(localStorage.getItem('token'))

async function fetchWords() {
  try {
    const isLoggedIn = !!token.value

    const apiUrl = isLoggedIn
      ? 'http://laravel_app.local/api/customer/get-daily-words'
      : 'http://laravel_app.local/api/words/get-daily-words'

    const headers = isLoggedIn
      ? { Authorization: `Bearer ${token.value}` }
      : {}

    const res = await fetch(apiUrl, { headers })
    const json = await res.json()

    if (json.success) {
      words.value = json.data.map(w => ({
        word: w.word,
        type: w.type,
        pronunciationUS: w.phon_n_am,
        pronunciationUK: w.phon_br,
        definition: w.meaning,
        example: w.example
      }))
    } else {
      console.warn('Failed to fetch words:', json.message || json)
    }
  } catch (error) {
    console.error('Error fetching daily words:', error)
  }
}

onMounted(() => {
  fetchWords()
})

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
</script>


