<template>
    <div class="vocabulary-history">
        <h1>📖 My Vocabulary History</h1>

        <div v-if="loading" class="loading">Loading...</div>

        <div v-else-if="history.length === 0" class="no-history">
            You haven’t completed any vocabulary tasks yet.
        </div>

        <div v-else>
            <table class="history-table">
                <thead>
                <tr>
                    <th>Words</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(entry, index) in history" :key="index">
                    <td>
                        <ul>
                            <li v-for="(word, i) in entry.words" :key="i" :class="word.type">
                                <strong>{{ word.word }}</strong>
                                <span class="word-type-tag">{{ word.type }}</span>
                            </li>
                        </ul>
                    </td>
                    <td>
                      {{ formatDate(entry.date) }}
                      <br />
                      <router-link :to="{ name: 'vocabulary-history-detail', params: { id: entry.id } }" class="view-detail-link">
                        View Detail →
                      </router-link>
                    </td>
                </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import '@/assets/css/VocabularyHistory.css'

    const history = ref([])
    const loading = ref(true)
    const router = useRouter()
    const token = localStorage.getItem('token')

    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateStr).toLocaleDateString(undefined, options)
    }

    async function fetchHistory() {
        try {
            const res = await fetch('http://laravel_app.local/api/words/get-completed-vocabulary-history', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            })

            const json = await res.json()

            if (json.success) {
                history.value = json.data.map(entry => ({
                    id: entry.id,
                    date: entry.date,
                    words: entry.words.map(w => ({
                        word: w.word,
                        type: w.type,
                    })),
                }))
            } else {
                console.warn('Failed to load history:', json.message || json)
            }
        } catch (err) {
            console.error('Error loading vocabulary history:', err)
            router.push('/')
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        if (!token) {
            router.push('/')
        } else {
            fetchHistory()
        }
    })
</script>