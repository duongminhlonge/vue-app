<template>
  <div class="daily-words">
    <h1>📚 Learn 5 English Words Today</h1>

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

const words = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://laravel_app.local/api/words/get-daily-words') // Replace with your actual API endpoint
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
    }
  } catch (error) {
    console.error('Error fetching daily words:', error)
  }
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

<style scoped>
.daily-words {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
}

.word-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.word-card {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.word-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.word {
  font-size: 1.5rem;
  margin: 0;
  color: #222;
}

.type-tag {
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: capitalize;
  color: #fff;
}

.pronunciations {
  margin: 10px 0;
  font-size: 0.95rem;
  color: #555;
}
.pronunciations strong {
  font-weight: bold;
}

.word-details {
  list-style-type: disc;
  padding-left: 20px;
  margin: 10px 0;
  font-size: 0.95rem;
  color: #444;
}

.word-details li {
  margin-bottom: 6px;
}

.word-details li strong {
  font-weight: bold;
}

.card-actions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.card-actions button {
  flex: 1;
  padding: 6px 12px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.word-card.noun { background-color: rgba(0, 123, 255, 0.08); }
.word-card.verb { background-color: rgba(40, 167, 69, 0.08); }
.word-card.adjective { background-color: rgba(255, 193, 7, 0.12); }
.word-card.adverb { background-color: rgba(23, 162, 184, 0.1); }
.word-card.preposition { background-color: rgba(111, 66, 193, 0.1); }
.word-card.conjunction { background-color: rgba(253, 126, 20, 0.1); }
.word-card.interjection { background-color: rgba(220, 53, 69, 0.1); }
.word-card.determiner { background-color: rgba(32, 201, 151, 0.1); }
.word-card.article { background-color: rgba(102, 16, 242, 0.1); }
.word-card.other { background-color: rgba(52, 58, 64, 0.08); }

.word-card.noun .type-tag,
.word-card.noun button { background-color: #007bff; }
.word-card.verb .type-tag,
.word-card.verb button { background-color: #28a745; }
.word-card.adjective .type-tag,
.word-card.adjective button { background-color: #ffc107; color: #222; }
.word-card.adverb .type-tag,
.word-card.adverb button { background-color: #17a2b8; }
.word-card.preposition .type-tag,
.word-card.preposition button { background-color: #6f42c1; }
.word-card.conjunction .type-tag,
.word-card.conjunction button { background-color: #fd7e14; color: #222; }
.word-card.interjection .type-tag,
.word-card.interjection button { background-color: #dc3545; }
.word-card.determiner .type-tag,
.word-card.determiner button { background-color: #20c997; }
.word-card.article .type-tag,
.word-card.article button { background-color: #6610f2; }
.word-card.other .type-tag,
.word-card.other button { background-color: #343a40; }

button:hover {
  filter: brightness(0.9);
}

@media (max-width: 767px) {
  .word-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .word-card {
    padding: 16px;
  }

  .word {
    font-size: 1.3rem;
  }

  .pronunciations,
  .word-details {
    font-size: 0.9rem;
  }

  .card-actions {
    flex-direction: column;
    gap: 8px;
  }

  .card-actions button {
    width: 100%;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.4rem;
  }

  .word {
    font-size: 1.2rem;
  }

  .pronunciations p,
  .word-details li {
    font-size: 0.85rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
