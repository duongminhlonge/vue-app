<template>
  <div class="vocabulary-history-detail">
    <h2>📘 Vocabulary Detail for {{ formatDate(date) }}</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="!words.length">No words found for this date.</div>
    <ul v-else>
      <li v-for="(word, i) in words" :key="i" :class="word.type">
        <strong>{{ word.word }}</strong>
        <span class="word-type-tag">{{ word.type }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const date = route.params.date
const words = ref([])
const loading = ref(true)
const token = localStorage.getItem('token')

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

async function fetchDetail() {
  try {
    const res = await fetch(`http://laravel_app.local/api/words/get-vocabulary-by-date/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    const json = await res.json()

    if (json.success) {
      words.value = json.data.words || []
    } else {
      console.warn('Failed to load detail:', json.message || json)
    }
  } catch (err) {
    console.error('Error loading vocabulary detail:', err)
    router.push('/')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!token) {
    router.push('/')
  } else {
    fetchDetail()
  }
})
</script>

<style scoped>
.vocabulary-history-detail {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.vocabulary-history-detail h2 {
  text-align: center;
  margin-bottom: 24px;
}

.word-type-tag {
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  color: #fff;
}

.noun .word-type-tag {
  background-color: #007bff;
}

.verb .word-type-tag {
  background-color: #dc3545;
}

.adjective .word-type-tag {
  background-color: #ffc107;
  color: #222;
}

.adverb .word-type-tag {
  background-color: #17a2b8;
}
</style>
