<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLessonsStore } from '../stores/lessons'
import { useUserStore } from '../stores/user'
import { useNotificationsStore } from '../stores/notifications'

const props = defineProps({
  lessonId: {
    type: String,
    required: true
  },
  exerciseId: {
    type: String,
    required: true
  }
})

const router = useRouter()
const lessonsStore = useLessonsStore()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

// Get lesson and exercise data
const lesson = computed(() => lessonsStore.lessonById(props.lessonId))
const exercises = computed(() => lesson.value?.exercises || [])

// Find current exercise
const currentExerciseIndex = computed(() => {
  if (!exercises.value.length) return -1
  return exercises.value.findIndex(ex => ex.id === props.exerciseId)
})

const currentExercise = computed(() => {
  if (currentExerciseIndex.value === -1) return null
  return exercises.value[currentExerciseIndex.value]
})

// Exercise progress
const totalExercises = computed(() => exercises.value.length)
const progress = computed(() => {
  if (totalExercises.value === 0) return 0
  return ((currentExerciseIndex.value + 1) / totalExercises.value) * 100
})

// User input state
const userAnswer = ref('')
const userMatchingPairs = ref({})
const selectedOption = ref(null)
const showAnswer = ref(false)
const isCorrect = ref(false)
const exerciseCompleted = ref(false)

// Initialize matching pairs
const initializeMatchingPairs = () => {
  if (currentExercise.value?.type === 'matching') {
    userMatchingPairs.value = {}
    currentExercise.value.pairs.forEach(pair => {
      userMatchingPairs.value[pair.text] = null
    })
  }
}

// Handle user answer
const checkAnswer = () => {
  if (!currentExercise.value) return
  
  let correct = false
  
  switch (currentExercise.value.type) {
    case 'multiple_choice':
      correct = selectedOption.value === currentExercise.value.correctAnswer
      break
    case 'fill_blank':
      // Case insensitive match and allow for small typos
      const userAnswerNormalized = userAnswer.value.toLowerCase().trim()
      const correctAnswerNormalized = currentExercise.value.correctAnswer.toLowerCase()
      correct = userAnswerNormalized === correctAnswerNormalized
      break
    case 'matching':
      // Check if all pairs are matched correctly
      correct = true
      for (const pair of currentExercise.value.pairs) {
        if (userMatchingPairs.value[pair.text] !== pair.match) {
          correct = false
          break
        }
      }
      break
    case 'listening':
      correct = selectedOption.value === currentExercise.value.correctAnswer
      break
    default:
      correct = false
  }
  
  isCorrect.value = correct
  showAnswer.value = true
  exerciseCompleted.value = true
  
  // Update lesson progress
  lessonsStore.completeExercise(props.lessonId, props.exerciseId, correct)
  
  // If we've completed the lesson, award XP
  if (isLastExercise.value) {
    const xpEarned = lessonsStore.completeLesson(props.lessonId)
    if (xpEarned > 0) {
      userStore.addXP(xpEarned)
      
      // Show notification
      notificationsStore.notifyLessonCompleted(lesson.value, xpEarned)
    }
  }
}

// Navigation
const isFirstExercise = computed(() => currentExerciseIndex.value === 0)
const isLastExercise = computed(() => currentExerciseIndex.value === exercises.value.length - 1)

const goToPreviousExercise = () => {
  if (isFirstExercise.value) return
  
  const prevExercise = exercises.value[currentExerciseIndex.value - 1]
  router.push({
    name: 'exercise',
    params: {
      lessonId: props.lessonId,
      exerciseId: prevExercise.id
    }
  })
}

const goToNextExercise = () => {
  if (isLastExercise.value) {
    // Return to lesson detail
    router.push({
      name: 'lesson-detail',
      params: { id: props.lessonId }
    })
    return
  }
  
  const nextExercise = exercises.value[currentExerciseIndex.value + 1]
  router.push({
    name: 'exercise',
    params: {
      lessonId: props.lessonId,
      exerciseId: nextExercise.id
    }
  })
  
  // Reset state for next exercise
  resetExerciseState()
}

// Reset the exercise state
const resetExerciseState = () => {
  userAnswer.value = ''
  selectedOption.value = null
  showAnswer.value = false
  isCorrect.value = false
  exerciseCompleted.value = false
  initializeMatchingPairs()
}

// Handle matching exercise selections
const selectMatchItem = (text, match) => {
  // If this match is already selected for another text, remove it
  for (const key in userMatchingPairs.value) {
    if (userMatchingPairs.value[key] === match) {
      userMatchingPairs.value[key] = null
    }
  }
  
  // Set the match for the selected text
  userMatchingPairs.value[text] = match
}

// Error handling
const error = ref(null)

// Watch for changes in the exercise ID to reset state
watch(() => props.exerciseId, () => {
  resetExerciseState()
})

onMounted(() => {
  if (!lesson.value) {
    error.value = 'Lesson not found'
    return
  }
  
  if (!currentExercise.value) {
    error.value = 'Exercise not found'
    return
  }
  
  resetExerciseState()
})
</script>

<template>
  <div class="exercise-container">
    <div v-if="error" class="error-message">
      {{ error }}
      <button 
        class="btn btn-primary mt-3" 
        @click="router.push(`/lesson/${lessonId}`)"
        v-voix="'back-to-lesson'"
        hint="Return to lesson details"
      >
        Back to Lesson
      </button>
    </div>
    
    <template v-else-if="lesson && currentExercise">
      <!-- Progress bar -->
      <div class="progress-container">
        <div class="progress-info">
          <span v-voix="'exercise-progress'" :hint="`Exercise ${currentExerciseIndex + 1} of ${totalExercises}`">
            {{ currentExerciseIndex + 1 }} / {{ totalExercises }}
          </span>
          <button 
            class="btn-text" 
            @click="router.push(`/lesson/${lessonId}`)"
            v-voix="'exit-exercise'"
            hint="Exit exercise and return to lesson"
          >
            Exit
          </button>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
      
      <!-- Exercise content -->
      <div class="exercise-content">
        <!-- Multiple choice exercise -->
        <div 
          v-if="currentExercise.type === 'multiple_choice'" 
          class="exercise-multiple-choice"
        >
          <h2 
            class="exercise-question"
            v-voix="'exercise-question'"
            :hint="currentExercise.question"
          >
            {{ currentExercise.question }}
          </h2>
          
          <div class="options-list">
            <button 
              v-for="option in currentExercise.options" 
              :key="option"
              class="option-button"
              :class="{
                selected: selectedOption === option,
                correct: showAnswer && option === currentExercise.correctAnswer,
                incorrect: showAnswer && selectedOption === option && option !== currentExercise.correctAnswer
              }"
              @click="selectedOption = option"
              :disabled="showAnswer"
              v-voix="`option-${option}`"
              :hint="`Select option: ${option}`"
            >
              {{ option }}
            </button>
          </div>
        </div>
        
        <!-- Fill in the blank exercise -->
        <div 
          v-else-if="currentExercise.type === 'fill_blank'" 
          class="exercise-fill-blank"
        >
          <h2 
            class="exercise-question"
            v-voix="'exercise-question'"
            :hint="currentExercise.question"
          >
            {{ currentExercise.question }}
          </h2>
          
          <div class="input-container">
            <input 
              v-model="userAnswer" 
              type="text" 
              placeholder="Type your answer"
              :disabled="showAnswer"
              class="fill-blank-input"
              :class="{
                correct: showAnswer && isCorrect,
                incorrect: showAnswer && !isCorrect
              }"
              v-voix="'fill-blank-input'"
              hint="Type your answer for the fill in the blank exercise"
            />
          </div>
        </div>
        
        <!-- Matching exercise -->
        <div 
          v-else-if="currentExercise.type === 'matching'" 
          class="exercise-matching"
        >
          <h2 
            class="exercise-question"
            v-voix="'exercise-question'"
            hint="Match each term with its translation"
          >
            Match each term with its translation
          </h2>
          
          <div class="matching-container">
            <div class="matching-column">
              <div 
                v-for="pair in currentExercise.pairs" 
                :key="`left-${pair.text}`"
                class="matching-item"
                :class="{ 
                  selected: userMatchingPairs[pair.text] !== null,
                  'correct-match': showAnswer && userMatchingPairs[pair.text] === pair.match,
                  'incorrect-match': showAnswer && userMatchingPairs[pair.text] !== null && userMatchingPairs[pair.text] !== pair.match
                }"
                v-voix="`term-${pair.text}`"
                :hint="`Term: ${pair.text}`"
              >
                {{ pair.text }}
              </div>
            </div>
            
            <div class="matching-column">
              <div 
                v-for="pair in currentExercise.pairs" 
                :key="`right-${pair.match}`"
                class="matching-item"
                @click="!showAnswer && selectMatchItem(pair.text, pair.match)"
                :class="{ 
                  'match-target': Object.values(userMatchingPairs).includes(pair.match),
                  'correct-match': showAnswer && Object.entries(userMatchingPairs).some(([k, v]) => v === pair.match && currentExercise.pairs.some(p => p.text === k && p.match === pair.match)),
                  'incorrect-match': showAnswer && Object.entries(userMatchingPairs).some(([k, v]) => v === pair.match && !currentExercise.pairs.some(p => p.text === k && p.match === pair.match))
                }"
                v-voix="`definition-${pair.match}`"
                :hint="`Definition: ${pair.match}`"
              >
                {{ pair.match }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Listening exercise -->
        <div 
          v-else-if="currentExercise.type === 'listening'" 
          class="exercise-listening"
        >
          <h2 
            class="exercise-question"
            v-voix="'exercise-question'"
            :hint="currentExercise.question"
          >
            {{ currentExercise.question }}
          </h2>
          
          <div class="audio-container">
            <button 
              class="audio-button"
              v-voix="'play-audio'"
              hint="Play audio clip"
            >
              <span class="audio-icon">🔊</span> Play Audio
            </button>
          </div>
          
          <div class="options-list">
            <button 
              v-for="option in currentExercise.options" 
              :key="option"
              class="option-button"
              :class="{
                selected: selectedOption === option,
                correct: showAnswer && option === currentExercise.correctAnswer,
                incorrect: showAnswer && selectedOption === option && option !== currentExercise.correctAnswer
              }"
              @click="selectedOption = option"
              :disabled="showAnswer"
              v-voix="`option-${option}`"
              :hint="`Select option: ${option}`"
            >
              {{ option }}
            </button>
          </div>
        </div>
        
        <!-- Other exercise types would be added here -->
        
        <!-- Answer feedback -->
        <div v-if="showAnswer" class="answer-feedback">
          <div 
            class="feedback-message" 
            :class="{ correct: isCorrect, incorrect: !isCorrect }"
            v-voix="'answer-feedback'"
            :hint="isCorrect ? 'Correct answer!' : 'Incorrect answer'"
          >
            <span class="feedback-icon">{{ isCorrect ? '✓' : '✗' }}</span>
            <span class="feedback-text">{{ isCorrect ? 'Correct!' : 'Incorrect' }}</span>
          </div>
          
          <div 
            v-if="!isCorrect && currentExercise.explanation" 
            class="explanation"
            v-voix="'answer-explanation'"
            :hint="currentExercise.explanation"
          >
            {{ currentExercise.explanation }}
          </div>
        </div>
      </div>
      
      <!-- Bottom actions -->
      <div class="exercise-actions">
        <button 
          v-if="!isFirstExercise"
          class="btn btn-secondary" 
          @click="goToPreviousExercise"
          v-voix="'previous-exercise'"
          hint="Go to previous exercise"
        >
          Previous
        </button>
        
        <button 
          v-if="!exerciseCompleted"
          class="btn btn-primary" 
          @click="checkAnswer"
          :disabled="
            (currentExercise.type === 'multiple_choice' && selectedOption === null) ||
            (currentExercise.type === 'fill_blank' && !userAnswer) ||
            (currentExercise.type === 'matching' && Object.values(userMatchingPairs).some(v => v === null)) ||
            (currentExercise.type === 'listening' && selectedOption === null)
          "
          v-voix="'check-answer'"
          hint="Check your answer"
        >
          Check Answer
        </button>
        
        <button 
          v-else
          class="btn btn-primary"
          @click="goToNextExercise"
          v-voix="'next-exercise'"
          :hint="isLastExercise ? 'Complete lesson' : 'Go to next exercise'"
        >
          {{ isLastExercise ? 'Complete Lesson' : 'Next' }}
        </button>
      </div>
    </template>
    
    <div v-else class="loading">
      Loading exercise...
    </div>
  </div>
</template>

<style scoped>
.exercise-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 0;
}

.progress-container {
  margin-bottom: 2rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-bar-container {
  height: 0.5rem;
  background-color: var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 1rem;
  transition: width 0.3s ease;
}

.exercise-content {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
}

.exercise-question {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--primary-dark);
}

/* Multiple choice styling */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-button {
  padding: 1rem;
  background-color: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.option-button:hover:not(:disabled) {
  border-color: var(--primary-light);
}

.option-button.selected {
  border-color: var(--primary-color);
  background-color: rgba(79, 70, 229, 0.1);
}

.option-button.correct {
  border-color: var(--success-color);
  background-color: rgba(16, 185, 129, 0.1);
}

.option-button.incorrect {
  border-color: var(--error-color);
  background-color: rgba(239, 68, 68, 0.1);
}

.option-button:disabled {
  cursor: default;
}

/* Fill in the blank styling */
.input-container {
  margin-bottom: 1rem;
}

.fill-blank-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
}

.fill-blank-input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.fill-blank-input.correct {
  border-color: var(--success-color);
  background-color: rgba(16, 185, 129, 0.1);
}

.fill-blank-input.incorrect {
  border-color: var(--error-color);
  background-color: rgba(239, 68, 68, 0.1);
}

/* Matching exercise styling */
.matching-container {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.matching-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.matching-item {
  padding: 1rem;
  background-color: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}

.matching-item:hover {
  border-color: var(--primary-light);
}

.matching-item.selected, .matching-item.match-target {
  border-color: var(--primary-color);
  background-color: rgba(79, 70, 229, 0.1);
}

.matching-item.correct-match {
  border-color: var(--success-color);
  background-color: rgba(16, 185, 129, 0.1);
}

.matching-item.incorrect-match {
  border-color: var(--error-color);
  background-color: rgba(239, 68, 68, 0.1);
}

/* Listening exercise styling */
.audio-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.audio-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.audio-button:hover {
  background-color: var(--primary-dark);
}

.audio-icon {
  font-size: 1.25rem;
}

/* Answer feedback styling */
.answer-feedback {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.feedback-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.feedback-message.correct {
  color: var(--success-color);
}

.feedback-message.incorrect {
  color: var(--error-color);
}

.feedback-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  color: white;
  font-size: 1rem;
}

.feedback-message.correct .feedback-icon {
  background-color: var(--success-color);
}

.feedback-message.incorrect .feedback-icon {
  background-color: var(--error-color);
}

.explanation {
  padding: 1rem;
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-light);
}

/* Bottom actions */
.exercise-actions {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.btn-primary:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.btn-text {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
}

.btn-text:hover {
  color: var(--primary-color);
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

.mt-3 {
  margin-top: 0.75rem;
}

@media (max-width: 640px) {
  .exercise-content {
    padding: 1.5rem;
  }
  
  .matching-container {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>