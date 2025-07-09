<template>
  <div class="daily-words">
    <h1>📚 Learn {{ words.length }} English Word{{ words.length === 1 ? '' : 's' }} Today</h1>

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

      <!-- Exam CTA or Completion Message -->
      <div v-if="isLoggedIn" class="word-card call-to-action-card">
        <template v-if="isCompleted">
          <h2>✅ You've Already Passed Today’s Exam</h2>
          <p>🎉 Great job! These words are now added to your personal list.</p>
        </template>
        <template v-else>
          <h2>📝 Ready to Grow Your Vocabulary?</h2>
          <p>To save today's words to your personal list, you need to pass a quick vocabulary challenge. Show us what you've learned!</p>
          <button @click="goToExam">Take the Vocabulary Exam</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import '@/assets/css/DailyWords.css'

  const words = ref([])
  const isCompleted = ref(false)
  const token = ref(localStorage.getItem('token') || '')
  const isLoggedIn = computed(() => !!token.value)
  const router = useRouter()

  async function fetchWords() {
    try {
      const apiUrl = isLoggedIn.value
              ? 'http://laravel_app.local/api/words/get-customer-daily-words'
              : 'http://laravel_app.local/api/words/get-daily-words'

      const headers = isLoggedIn.value
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
        if (json.is_completed !== undefined) {
          isCompleted.value = json.is_completed
        }
      } else {
        console.warn('Failed to fetch words:', json.message || json)
      }
    } catch (error) {
      console.error('Error fetching daily words:', error)
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

  function goToExam() {
    router.push('/vocabulary-exam')
  }

  onMounted(() => {
    fetchWords()
  })
</script>

