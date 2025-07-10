<template>
  <div class="vocabulary-exam-container">
    <h1>Daily Vocabulary Exam</h1>

    <div v-if="loading">Loading...</div>

    <div v-else-if="!submitted">
      <form @submit.prevent="submitExam">
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="question-block"
          :class="question.type"
        >
          <h3>
            Question {{ index + 1 }}:
            What is the meaning of <strong>'{{ question.word }}'</strong> ({{question.type}})?
          </h3>

          <div v-for="option in question.options" :key="option">
            <label>
              <input
                type="radio"
                :name="'q' + index"
                :value="option"
                v-model="userAnswers[index]"
                required
              />
              {{ option }}
            </label>
          </div>

          <!-- Validation message -->
          <p v-if="submitted && userAnswers[index] === undefined" class="validation-error">
            Please select an answer.
          </p>
        </div>

        <button type="submit" class="submit-button">Submit Exam</button>
      </form>
    </div>

    <div v-else class="result-screen">
      <h2 v-if="passed" class="pass">
        🎉 You Passed!<br>
        <span class="subtitle">New vocabulary words have been added to your list.</span>
      </h2>

      <div v-else>
        <h2 class="fail">❌ Almost perfect, keep trying!</h2>
        <p>You got <strong>{{ correctCount }}</strong> correct and <strong>{{ wrongCount }}</strong> wrong.</p>
        <p>Give it another try!</p>
        <button class="try-again-button" @click="tryAgain">Try Again</button>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/VocabularyExam.css'

export default {
  name: 'VocabularyExam',
  data() {
    return {
      questions: [],
      userAnswers: {},
      loading: true,
      submitted: false,
      passed: false,
      correctCount: 0,
      wrongCount: 0,
      token: null,
    };
  },
  methods: {
    async fetchExam() {
      try {
        const response = await fetch('http://laravel_app.local/api/words/daily-vocabulary-exam', {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Unauthorized or error fetching exam');
        }

        const data = await response.json();
        this.questions = data.data;
      } catch (error) {
        console.error('Failed to load exam:', error);
        this.$router.push('/');
      } finally {
        this.loading = false;
      }
    },
    async submitExam() {
      this.submitted = true;

      const incomplete = this.questions.some((_, index) => {
        return this.userAnswers[index] === undefined;
      });

      if (incomplete) return;

      let correct = 0;
      this.questions.forEach((question, index) => {
        if (this.userAnswers[index] === question.answer) {
          correct++;
        }
      });

      this.correctCount = correct;
      this.wrongCount = this.questions.length - correct;
      this.passed = correct === this.questions.length;

      // 👇 Call API to mark task as completed if passed
      if (this.passed) {
        try {
          const response = await fetch('http://laravel_app.local/api/words/mark-daily-vocabulary-completed', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.token}`,
              Accept: 'application/json',
            },
          });

          const result = await response.json();
          if (!result.success) {
            console.warn('Task not marked as completed:', result.message);
          }
        } catch (err) {
          console.error('Error marking task as completed:', err);
        }
      }
    },
    tryAgain() {
      this.userAnswers = {};
      this.submitted = false;
      this.correctCount = 0;
      this.wrongCount = 0;
    },
    checkAuth() {
      this.token = localStorage.getItem('token');
      if (!this.token) {
        this.$router.push('/');
      }
    },
  },
  mounted() {
    this.checkAuth();
    this.fetchExam();
  },
};
</script>
