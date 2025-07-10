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

<style scoped>
    .vocabulary-history {
        max-width: 1200px;
        margin: 40px auto;
        padding: 0 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333;
    }

    .vocabulary-history h1 {
        text-align: center;
        font-size: 2.2rem;
        margin-bottom: 40px;
        font-weight: 700;
    }

    .history-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 14px;
        font-size: 1rem;
        color: #444;
        background: transparent;
    }

    .history-table th,
    .history-table td {
        background-color: #fff;
        padding: 16px 24px;
        text-align: left;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        vertical-align: top;
        transition: background-color 0.3s ease;
    }

    .history-table th {
        background-color: #f4f6f8;
        font-weight: 600;
        color: #222;
        letter-spacing: 0.03em;
    }

    .history-table tbody tr:hover td {
        background-color: #f9fbfd;
    }

    .history-table td ul {
        padding-left: 20px;
        margin: 0;
        list-style-type: disc;
    }

    .history-table td li {
        margin-bottom: 8px;
        font-size: 1rem;
        color: #555;
    }

    .history-table td li strong {
        font-weight: 700;
        color: #222;
        font-size: 1.05rem;
    }

    /* Color tags with slightly deeper saturation and subtle shadow */
    .word-type-tag {
        display: inline-block;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: capitalize;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 8px;
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

    .preposition .word-type-tag {
        background-color: #6f42c1;
    }

    .conjunction .word-type-tag {
        background-color: #fd7e14;
        color: #222;
    }

    .interjection .word-type-tag {
        background-color: #28a745;
    }

    .determiner .word-type-tag {
        background-color: #20c997;
    }

    .article .word-type-tag {
        background-color: #6610f2;
    }

    .other .word-type-tag {
        background-color: #343a40;
    }

    /* Responsive tweaks */
    @media (max-width: 768px) {
        history-table th,
        .history-table td {
            padding: 14px 16px;
            font-size: 0.95rem;
        }

        .history-table td li {
            font-size: 0.95rem;
        }
    }

    @media (max-width: 480px) {
        .vocabulary-history h1 {
            font-size: 1.6rem;
            margin-bottom: 24px;
        }

        .history-table {
            font-size: 0.9rem;
        }
    }

</style>
