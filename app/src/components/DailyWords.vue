<template>
  <div class="daily-words">
    <h1>Learn 10 English Words Today</h1>

    <div
      v-for="(word, index) in words"
      :key="index"
      class="word-card"
      :class="word.type"
    >
      <h2>{{ word.word }}</h2>
      <p><strong>Type:</strong> {{ capitalize(word.type) }}</p>
      <p><strong>Pronunciation:</strong> /{{ word.pronunciation }}/</p>
      <p><strong>Example:</strong> {{ word.example }}</p>
      <button @click="playAudio(word.word)">🔊 Listen</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const words = ref([
  {
    word: 'cat',
    type: 'noun',
    pronunciation: 'kæt',
    example: 'The cat slept on the windowsill.'
  },
  {
    word: 'eat',
    type: 'verb',
    pronunciation: 'iːt',
    example: 'I always eat breakfast before work.'
  },
  {
    word: 'beautiful',
    type: 'adjective',
    pronunciation: 'ˈbjuː.tɪ.fəl',
    example: 'She wore a beautiful dress to the party.'
  },
  {
    word: 'quickly',
    type: 'adverb',
    pronunciation: 'ˈkwɪk.li',
    example: 'He ran quickly to catch the bus.'
  },
  {
    word: 'under',
    type: 'preposition',
    pronunciation: 'ˈʌn.dər',
    example: 'The dog is hiding under the table.'
  },
  {
    word: 'but',
    type: 'conjunction',
    pronunciation: 'bʌt',
    example: 'She is kind, but sometimes impatient.'
  },
  {
    word: 'wow',
    type: 'interjection',
    pronunciation: 'waʊ',
    example: 'Wow! That was an amazing performance!'
  },
  {
    word: 'this',
    type: 'determiner',
    pronunciation: 'ðɪs',
    example: 'This apple is fresh and sweet.'
  },
  {
    word: 'an',
    type: 'article',
    pronunciation: 'æn',
    example: 'I saw an elephant at the zoo.'
  },
  {
    word: 'please',
    type: 'other',
    pronunciation: 'pliːz',
    example: 'Please close the door behind you.'
  }
])

function playAudio(text) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  speechSynthesis.speak(utterance)
}

function capitalize(wordType) {
  return wordType.charAt(0).toUpperCase() + wordType.slice(1)
}
</script>

<style scoped>
.daily-words {
  max-width: 700px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.word-card {
  border: 1px solid #ccc;
  border-left: 10px solid #999;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  transition: 0.3s;
}

/* Color-coded by type */
.word-card.noun { border-left-color: #007bff; background-color: #e6f0ff; }
.word-card.verb { border-left-color: #28a745; background-color: #e6ffee; }
.word-card.adjective { border-left-color: #ffc107; background-color: #fff8e1; }
.word-card.adverb { border-left-color: #17a2b8; background-color: #e0f7fa; }
.word-card.preposition { border-left-color: #6f42c1; background-color: #f3e5f5; }
.word-card.conjunction { border-left-color: #fd7e14; background-color: #fff3e0; }
.word-card.interjection { border-left-color: #dc3545; background-color: #f8d7da; }
.word-card.determiner { border-left-color: #20c997; background-color: #e0f2f1; }
.word-card.article { border-left-color: #6610f2; background-color: #ede7f6; }
.word-card.other { border-left-color: #343a40; background-color: #f1f3f5; }

button {
  margin-top: 10px;
  padding: 5px 10px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background: #000;
}
</style>
