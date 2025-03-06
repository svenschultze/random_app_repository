<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLessonsStore } from '../stores/lessons'
import { useNotificationsStore } from '../stores/notifications'

const router = useRouter()
const userStore = useUserStore()
const lessonsStore = useLessonsStore()
const notificationsStore = useNotificationsStore()

// User profile data
const profile = computed(() => userStore.profile)
const levelProgress = computed(() => userStore.levelProgress)
const xpForNextLevel = computed(() => userStore.xpForNextLevel)

// Get the language name
const language = computed(() => {
  const lang = lessonsStore.languages.find(l => l.id === profile.value.language)
  return lang ? lang.name : 'Unknown'
})

// Get daily challenges
const dailyChallenges = computed(() => lessonsStore.dailyChallenges)

// Get recommended lessons
const recommendedLessons = ref([])

// Navigate to a lesson
const goToLesson = (lessonId) => {
  router.push({ name: 'lesson-detail', params: { id: lessonId } })
}

// Start a challenge
const startChallenge = (challengeId) => {
  // In a real app, this would navigate to a challenge view
  // For this demo, we'll just award some XP
  userStore.addXP(15)
  notificationsStore.addNotification({
    type: 'success',
    title: 'Challenge Completed!',
    message: 'You earned 15 XP from the daily challenge!',
    autoDismiss: 5000
  })
}

// Format relative time (e.g., "2 days ago")
const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  
  // Convert to days
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

// Initialize component
onMounted(() => {
  // Get recommended lessons
  recommendedLessons.value = lessonsStore.getRecommendedLessons(
    profile.value.level,
    lessonsStore.completedLessons
  ).slice(0, 3) // Get top 3 recommendations
  
  // For demo: If this is the first visit, add a welcome badge
  if (!userStore.hasBadge('welcome')) {
    userStore.awardBadge({
      id: 'welcome',
      name: 'Welcome',
      description: 'Started your language learning journey!'
    })
    
    // Show notification
    notificationsStore.notifyBadgeEarned({
      id: 'welcome',
      name: 'Welcome',
      description: 'Started your language learning journey!'
    })
  }
})
</script>

<template>
  <div class="dashboard-container">
    <section class="welcome-section">
      <h1 class="welcome-title">Welcome back, {{ profile.name }}!</h1>
      <p class="welcome-subtitle">Continue your {{ language }} learning journey</p>
    </section>
    
    <div class="dashboard-grid">
      <!-- User progress card -->
      <section class="dashboard-card progress-card">
        <h2 class="card-title">Your Progress</h2>
        
        <div class="progress-stats">
          <div class="progress-stat">
            <span class="stat-value" v-voix="'user-level-display'" hint="Your current level">Level {{ profile.level }}</span>
            <span class="stat-label">Current Level</span>
          </div>
          
          <div class="progress-stat">
            <span class="stat-value" v-voix="'user-xp-display'" hint="Your experience points">{{ profile.xp }} XP</span>
            <span class="stat-label">Total XP</span>
          </div>
          
          <div class="progress-stat">
            <span class="stat-value" v-voix="'user-streak-display'" hint="Your learning streak">{{ profile.streak }} days</span>
            <span class="stat-label">Current Streak</span>
          </div>
        </div>
        
        <div class="level-progress">
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: `${levelProgress}%` }"></div>
          </div>
          <span class="progress-text" v-voix="'level-progress-indicator'" :hint="`${levelProgress}% progress to next level`">
            {{ levelProgress }}% to Level {{ profile.level + 1 }}
          </span>
        </div>
        
        <div class="progress-info">
          <p>You need {{ xpForNextLevel - profile.xp }} more XP to reach level {{ profile.level + 1 }}</p>
        </div>
      </section>
      
      <!-- Daily goals card -->
      <section class="dashboard-card goals-card">
        <h2 class="card-title">Daily Goals</h2>
        
        <div class="daily-goal-progress">
          <div class="goal-circle" :class="{ completed: profile.streak > 0 }">
            <span class="goal-icon">✓</span>
            <span class="goal-text">Complete a lesson</span>
          </div>
          
          <div class="goal-circle" :class="{ completed: profile.xp >= 30 }">
            <span class="goal-icon">✓</span>
            <span class="goal-text">Earn 30 XP</span>
          </div>
          
          <div class="goal-circle" :class="{ completed: false }">
            <span class="goal-icon">✓</span>
            <span class="goal-text">Practice speaking</span>
          </div>
        </div>
        
        <div class="streak-info">
          <span class="streak-icon">🔥</span>
          <span v-voix="'streak-count'" hint="Your learning streak">
            {{ profile.streak }} day streak! Keep it going!
          </span>
        </div>
      </section>
      
      <!-- Daily challenges -->
      <section class="dashboard-card challenges-card">
        <h2 class="card-title">Daily Challenges</h2>
        
        <div class="challenges-list">
          <div 
            v-for="challenge in dailyChallenges" 
            :key="challenge.id" 
            class="challenge-item"
          >
            <div class="challenge-content">
              <h3 class="challenge-title">{{ challenge.title }}</h3>
              <p class="challenge-description">{{ challenge.description }}</p>
              <span class="challenge-reward">Reward: {{ challenge.xpReward }} XP</span>
            </div>
            
            <button 
              class="btn btn-primary" 
              @click="startChallenge(challenge.id)"
              v-voix="`challenge-${challenge.id}`"
              :hint="`Start ${challenge.title} challenge`"
            >
              Start
            </button>
          </div>
          
          <div v-if="dailyChallenges.length === 0" class="empty-state">
            <p>No challenges available today. Check back tomorrow!</p>
          </div>
        </div>
      </section>
      
      <!-- Recommended lessons -->
      <section class="dashboard-card lessons-card">
        <h2 class="card-title">Recommended Lessons</h2>
        
        <div class="lessons-list">
          <div 
            v-for="lesson in recommendedLessons" 
            :key="lesson.id"
            class="lesson-item"
            @click="goToLesson(lesson.id)"
            v-voix="`lesson-${lesson.id}`"
            :hint="`Start ${lesson.title} lesson`"
          >
            <div class="lesson-header">
              <h3 class="lesson-title">{{ lesson.title }}</h3>
              <span class="lesson-level">Level {{ lesson.level }}</span>
            </div>
            <p class="lesson-description">{{ lesson.description }}</p>
            <div class="lesson-footer">
              <span class="lesson-reward">{{ lesson.xpReward }} XP</span>
              <span class="lesson-exercises">{{ lesson.exercises.length }} exercises</span>
            </div>
          </div>
          
          <div v-if="recommendedLessons.length === 0" class="empty-state">
            <p>No recommended lessons. Try exploring the lessons page!</p>
            <button 
              class="btn btn-primary mt-2"
              @click="router.push('/lessons')"
              v-voix="'browse-lessons-button'"
              hint="Browse all available lessons"
            >
              Browse Lessons
            </button>
          </div>
        </div>
      </section>
      
      <!-- Recent activity -->
      <section class="dashboard-card activity-card">
        <h2 class="card-title">Recent Activity</h2>
        
        <div class="activity-list">
          <!-- In a real app, these would be dynamic -->
          <div class="activity-item">
            <div class="activity-icon" style="background-color: var(--primary-color)">🎓</div>
            <div class="activity-content">
              <p class="activity-text">Completed <strong>Basic Greetings</strong> lesson</p>
              <span class="activity-time">{{ formatRelativeTime(new Date(Date.now() - 86400000)) }}</span>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon" style="background-color: var(--accent-color)">🏆</div>
            <div class="activity-content">
              <p class="activity-text">Earned <strong>Welcome</strong> badge</p>
              <span class="activity-time">{{ formatRelativeTime(new Date(Date.now() - 86400000 * 2)) }}</span>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon" style="background-color: var(--success-color)">✅</div>
            <div class="activity-content">
              <p class="activity-text">Started learning <strong>{{ language }}</strong></p>
              <span class="activity-time">{{ formatRelativeTime(new Date(Date.now() - 86400000 * 3)) }}</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Vocabulary review -->
      <section class="dashboard-card vocabulary-card">
        <div class="card-header">
          <h2 class="card-title">Vocabulary Review</h2>
          <button 
            class="btn btn-text"
            @click="router.push('/vocabulary')"
            v-voix="'view-vocabulary-button'"
            hint="View all your vocabulary"
          >
            View All
          </button>
        </div>
        
        <div class="vocab-list">
          <!-- In a real app, these would be dynamic -->
          <div class="vocab-item">
            <div class="vocab-term">Hello</div>
            <div class="vocab-translation">Hola</div>
          </div>
          
          <div class="vocab-item">
            <div class="vocab-term">Goodbye</div>
            <div class="vocab-translation">Adiós</div>
          </div>
          
          <div class="vocab-item">
            <div class="vocab-term">Thank you</div>
            <div class="vocab-translation">Gracias</div>
          </div>
          
          <div class="vocab-item">
            <div class="vocab-term">Please</div>
            <div class="vocab-translation">Por favor</div>
          </div>
        </div>
        
        <button 
          class="btn btn-secondary mt-3"
          v-voix="'practice-vocabulary-button'"
          hint="Practice your vocabulary with flashcards"
        >
          Practice Flashcards
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 1rem 0;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: var(--text-light);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.dashboard-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--primary-dark);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

/* Progress card */
.progress-card {
  grid-column: span 2;
}

.progress-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.progress-stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  color: var(--text-light);
  font-size: 0.875rem;
}

.level-progress {
  margin-bottom: 1rem;
}

.progress-bar-container {
  height: 0.75rem;
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

.progress-info {
  font-size: 0.875rem;
  color: var(--text-light);
}

/* Goals card */
.daily-goal-progress {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.goal-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.goal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--border-color);
  color: var(--text-light);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.goal-circle.completed .goal-icon {
  background-color: var(--success-color);
  color: white;
}

.goal-text {
  font-size: 0.875rem;
  max-width: 7rem;
}

.streak-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--accent-color);
}

.streak-icon {
  font-size: 1.5rem;
}

/* Challenges card */
.challenges-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.challenge-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-color);
  border-radius: 0.75rem;
}

.challenge-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.challenge-description {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
}

.challenge-reward {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-color);
}

/* Lessons card */
.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-item {
  padding: 1rem;
  background-color: var(--bg-color);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.lesson-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.lesson-title {
  font-size: 1rem;
  font-weight: 600;
}

.lesson-level {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--primary-light);
  color: white;
  border-radius: 1rem;
}

.lesson-description {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
}

.lesson-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.lesson-reward {
  color: var(--accent-color);
  font-weight: 600;
}

.lesson-exercises {
  color: var(--text-light);
}

/* Activity card */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  color: white;
  font-size: 1rem;
}

.activity-text {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-light);
}

/* Vocabulary card */
.vocab-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.vocab-item {
  padding: 0.75rem;
  background-color: var(--bg-color);
  border-radius: 0.5rem;
}

.vocab-term {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.vocab-translation {
  font-size: 0.875rem;
  color: var(--text-light);
}

/* Button styles */
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

.btn-secondary {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.btn-text {
  background: none;
  color: var(--primary-color);
  padding: 0.25rem;
}

.btn-text:hover {
  text-decoration: underline;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 1.5rem;
  color: var(--text-light);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-card {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .progress-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .daily-goal-progress {
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .vocab-list {
    grid-template-columns: 1fr;
  }
}
</style>