<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLessonsStore } from '../stores/lessons'
import { useUserStore } from '../stores/user'

const router = useRouter()
const lessonsStore = useLessonsStore()
const userStore = useUserStore()

// User profile
const userLevel = computed(() => userStore.profile.level)

// Get all available lessons based on user level
const availableLessons = computed(() => lessonsStore.availableLessons(userLevel.value))

// Filtered lessons
const filteredLessons = ref([])

// Filter states
const levelFilter = ref('all')
const completedFilter = ref('all')
const searchQuery = ref('')

// Filter lessons
const filterLessons = () => {
  let filtered = [...availableLessons.value]
  
  // Apply level filter
  if (levelFilter.value !== 'all') {
    filtered = filtered.filter(lesson => lesson.level === parseInt(levelFilter.value))
  }
  
  // Apply completed filter
  if (completedFilter.value === 'completed') {
    filtered = filtered.filter(lesson => lessonsStore.isLessonCompleted(lesson.id))
  } else if (completedFilter.value === 'in-progress') {
    filtered = filtered.filter(lesson => {
      const progress = lessonsStore.lessonProgress(lesson.id)
      return progress > 0 && progress < 100
    })
  } else if (completedFilter.value === 'not-started') {
    filtered = filtered.filter(lesson => lessonsStore.lessonProgress(lesson.id) === 0)
  }
  
  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(lesson => 
      lesson.title.toLowerCase().includes(query) || 
      lesson.description.toLowerCase().includes(query)
    )
  }
  
  filteredLessons.value = filtered
}

// Navigate to lesson detail
const goToLesson = (lessonId) => {
  router.push({
    name: 'lesson-detail',
    params: { id: lessonId }
  })
}

// Get unique lesson levels for filter
const lessonLevels = computed(() => {
  const levels = availableLessons.value.map(lesson => lesson.level)
  return [...new Set(levels)].sort((a, b) => a - b)
})

// Get lesson progress
const getLessonProgress = (lessonId) => {
  return lessonsStore.lessonProgress(lessonId)
}

// Check if lesson is completed
const isLessonCompleted = (lessonId) => {
  return lessonsStore.isLessonCompleted(lessonId)
}

// Initialize component
onMounted(() => {
  filterLessons()
})

// Watch for filter changes
watch(() => [levelFilter.value, completedFilter.value, searchQuery.value, availableLessons.value], 
  () => {
    filterLessons()
  }, 
  { deep: true }
)
</script>

<template>
  <div class="lessons-container">
    <div class="lessons-header">
      <h1 class="page-title">Lessons</h1>
      
      <div class="filters-container">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search lessons..."
            class="search-input"
            v-voix="'search-lessons'"
            hint="Search for lessons by title or description"
          />
        </div>
        
        <div class="filter-group">
          <select 
            v-model="levelFilter" 
            class="filter-select"
            v-voix="'level-filter'"
            hint="Filter lessons by level"
          >
            <option value="all">All Levels</option>
            <option v-for="level in lessonLevels" :key="level" :value="level">Level {{ level }}</option>
          </select>
          
          <select 
            v-model="completedFilter" 
            class="filter-select"
            v-voix="'completion-filter'"
            hint="Filter lessons by completion status"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="not-started">Not Started</option>
          </select>
        </div>
      </div>
    </div>
    
    <div v-if="filteredLessons.length === 0" class="no-lessons">
      <p>No lessons match your filters. Try adjusting your search or filters.</p>
    </div>
    
    <div v-else class="lessons-grid">
      <div 
        v-for="lesson in filteredLessons" 
        :key="lesson.id"
        class="lesson-card"
        :class="{ 'completed': isLessonCompleted(lesson.id) }"
        @click="goToLesson(lesson.id)"
        v-voix="`lesson-${lesson.id}`"
        :hint="`${lesson.title}. Level ${lesson.level} lesson with ${lesson.exercises.length} exercises`"
      >
        <div class="lesson-header">
          <span class="lesson-level">Level {{ lesson.level }}</span>
          <span 
            v-if="isLessonCompleted(lesson.id)" 
            class="lesson-status completed"
          >
            Completed
          </span>
          <span 
            v-else-if="getLessonProgress(lesson.id) > 0" 
            class="lesson-status in-progress"
          >
            In Progress
          </span>
        </div>
        
        <div class="lesson-content">
          <h2 class="lesson-title">{{ lesson.title }}</h2>
          <p class="lesson-description">{{ lesson.description }}</p>
        </div>
        
        <div class="lesson-footer">
          <div 
            v-if="getLessonProgress(lesson.id) > 0 && !isLessonCompleted(lesson.id)" 
            class="lesson-progress"
          >
            <div class="progress-bar-container">
              <div 
                class="progress-bar" 
                :style="{ width: `${getLessonProgress(lesson.id)}%` }"
              ></div>
            </div>
            <span class="progress-text">{{ Math.round(getLessonProgress(lesson.id)) }}%</span>
          </div>
          
          <div class="lesson-meta">
            <span class="lesson-reward">{{ lesson.xpReward }} XP</span>
            <span class="lesson-exercises">{{ lesson.exercises.length }} exercises</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lessons-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 0;
}

.lessons-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--primary-dark);
}

.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.filter-group {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  min-width: 130px;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.lesson-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
}

.lesson-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-light);
}

.lesson-card.completed {
  border-color: var(--success-color);
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.lesson-level {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  background-color: var(--primary-light);
  color: white;
  border-radius: 0.25rem;
}

.lesson-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.lesson-status.completed {
  background-color: var(--success-color);
  color: white;
}

.lesson-status.in-progress {
  background-color: var(--warning-color);
  color: white;
}

.lesson-content {
  padding: 1rem;
  flex: 1;
}

.lesson-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--primary-dark);
}

.lesson-description {
  font-size: 0.875rem;
  color: var(--text-light);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lesson-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.lesson-progress {
  margin-bottom: 0.75rem;
}

.progress-bar-container {
  height: 0.5rem;
  background-color: var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress-bar {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 1rem;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--text-light);
}

.lesson-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.lesson-reward {
  font-weight: 600;
  color: var(--accent-color);
}

.lesson-exercises {
  color: var(--text-light);
}

.no-lessons {
  text-align: center;
  padding: 3rem;
  background-color: var(--bg-color);
  border-radius: 1rem;
  color: var(--text-light);
}

@media (max-width: 640px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
  }
}
</style>