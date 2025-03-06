<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLessonsStore } from '../stores/lessons'
import { useUserStore } from '../stores/user'
import { useNotificationsStore } from '../stores/notifications'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const lessonsStore = useLessonsStore()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

// Get lesson data
const lesson = computed(() => lessonsStore.lessonById(props.id))
const lessonProgress = computed(() => lessonsStore.lessonProgress(props.id))
const isCompleted = computed(() => lessonsStore.isLessonCompleted(props.id))

// Start lesson
const startLesson = () => {
  lessonsStore.startLesson(props.id)
  startFirstExercise()
}

// Resume lesson
const resumeLesson = () => {
  lessonsStore.startLesson(props.id)
  // Find the first incomplete exercise
  const firstIncompleteIndex = findFirstIncompleteExercise()
  startExercise(firstIncompleteIndex)
}

// Find the first incomplete exercise
const findFirstIncompleteExercise = () => {
  // This is simplified for the demo
  // In a real app, we would track completed exercises
  const progress = lessonProgress.value
  if (progress === 0) return 0
  
  const totalExercises = lesson.value.exercises.length
  const estimatedCompletedExercises = Math.floor((progress / 100) * totalExercises)
  return Math.min(estimatedCompletedExercises, totalExercises - 1)
}

// Start a specific exercise
const startExercise = (index) => {
  if (!lesson.value || !lesson.value.exercises[index]) return
  
  const exerciseId = lesson.value.exercises[index].id
  router.push({
    name: 'exercise',
    params: {
      lessonId: props.id,
      exerciseId
    }
  })
}

// Start the first exercise
const startFirstExercise = () => {
  startExercise(0)
}

// Format text for button based on lesson state
const buttonText = computed(() => {
  if (isCompleted.value) return 'Practice Again'
  if (lessonProgress.value > 0) return 'Continue Lesson'
  return 'Start Lesson'
})

const buttonAction = computed(() => {
  if (isCompleted.value) return startLesson
  if (lessonProgress.value > 0) return resumeLesson
  return startLesson
})

// Error handling
const error = ref(null)

onMounted(() => {
  if (!lesson.value) {
    error.value = 'Lesson not found'
  }
})
</script>

<template>
  <div class="lesson-detail-container">
    <div v-if="error" class="error-message">
      {{ error }}
      <button 
        class="btn btn-primary mt-3" 
        @click="router.push('/lessons')"
        v-voix="'back-to-lessons'"
        hint="Return to lessons list"
      >
        Back to Lessons
      </button>
    </div>
    
    <template v-else-if="lesson">
      <!-- Lesson header -->
      <div class="lesson-header">
        <button 
          class="back-button" 
          @click="router.push('/lessons')"
          v-voix="'back-button'"
          hint="Return to lessons list"
        >
          ← Back to Lessons
        </button>
        
        <div class="lesson-status" v-if="isCompleted">
          <span class="completed-badge">Completed</span>
        </div>
      </div>
      
      <div class="lesson-content">
        <div class="lesson-info">
          <h1 class="lesson-title">{{ lesson.title }}</h1>
          <div class="lesson-meta">
            <span class="lesson-level">Level {{ lesson.level }}</span>
            <span class="lesson-reward">{{ lesson.xpReward }} XP</span>
            <span class="lesson-exercises">{{ lesson.exercises.length }} exercises</span>
          </div>
          
          <p class="lesson-description">{{ lesson.description }}</p>
          
          <div class="lesson-progress" v-if="lessonProgress > 0 && !isCompleted">
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: `${lessonProgress}%` }"></div>
            </div>
            <span class="progress-text" v-voix="'lesson-progress'" :hint="`${Math.round(lessonProgress)}% complete`">
              {{ Math.round(lessonProgress) }}% complete
            </span>
          </div>
          
          <button 
            class="btn btn-primary start-button" 
            @click="buttonAction"
            v-voix="'start-lesson-button'"
            :hint="buttonText"
          >
            {{ buttonText }}
          </button>
        </div>
        
        <div class="lesson-preview">
          <h2 class="preview-title">What you'll learn</h2>
          
          <div class="preview-content">
            <div v-if="lesson.exercises && lesson.exercises.length > 0" class="exercises-preview">
              <div 
                v-for="(exercise, index) in lesson.exercises" 
                :key="exercise.id"
                class="exercise-item"
              >
                <div class="exercise-icon">{{ index + 1 }}</div>
                <div class="exercise-info">
                  <div class="exercise-type">
                    {{ exercise.type === 'multiple_choice' ? 'Multiple Choice' : 
                       exercise.type === 'fill_blank' ? 'Fill in the Blank' : 
                       exercise.type === 'matching' ? 'Matching' : 
                       exercise.type === 'listening' ? 'Listening' : 
                       exercise.type === 'speaking' ? 'Speaking' : 
                       'Exercise' }}
                  </div>
                  <div class="exercise-preview" v-if="exercise.question">
                    {{ exercise.question }}
                  </div>
                  <div class="exercise-preview" v-else-if="exercise.pairs">
                    Match {{ exercise.pairs.length }} pairs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <div v-else class="loading">
      Loading lesson...
    </div>
  </div>
</template>

<style scoped>
.lesson-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 0;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-button {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
}

.back-button:hover {
  color: var(--primary-color);
}

.completed-badge {
  background-color: var(--success-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.lesson-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.lesson-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--primary-dark);
}

.lesson-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.lesson-level,
.lesson-reward,
.lesson-exercises {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-light);
}

.lesson-level {
  color: var(--primary-color);
  font-weight: 600;
}

.lesson-reward {
  color: var(--accent-color);
  font-weight: 600;
}

.lesson-description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.lesson-progress {
  margin-bottom: 2rem;
}

.progress-bar-container {
  height: 0.5rem;
  background-color: var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 1rem;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-light);
}

.start-button {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
}

.lesson-preview {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.preview-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-dark);
}

.exercises-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercise-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--bg-color);
  border-radius: 0.5rem;
}

.exercise-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.exercise-type {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.exercise-preview {
  font-size: 0.875rem;
  color: var(--text-light);
}

.btn {
  padding: 0.5rem 1rem;
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

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

.mt-3 {
  margin-top: 0.75rem;
}

@media (max-width: 768px) {
  .lesson-content {
    grid-template-columns: 1fr;
  }
}
</style>