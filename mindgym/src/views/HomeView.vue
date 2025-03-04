<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useChallengesStore } from '../stores/challenges'
import ChallengeCard from '../components/ChallengeCard.vue'

const router = useRouter()
const userStore = useUserStore()
const challengesStore = useChallengesStore()

const dailyStreak = computed(() => userStore.userStreakDays)
const completedToday = computed(() => challengesStore.dailyChallenge.completed)
const userName = computed(() => userStore.user.name || 'User')
const userLevel = computed(() => userStore.userLevel)

// Calculate progress towards daily goal
const dailyGoal = computed(() => userStore.user.preferences.dailyGoal || 1)
const completedChallenges = computed(() => challengesStore.completedChallenges.length)
const progressPercentage = computed(() => {
  const percentage = (completedChallenges.value / dailyGoal.value) * 100
  return Math.min(percentage, 100)
})

const greeting = ref('')

// Set greeting based on time of day
function setGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) {
    greeting.value = 'Good Morning'
  } else if (hour < 18) {
    greeting.value = 'Good Afternoon'
  } else {
    greeting.value = 'Good Evening'
  }
}

function startChallenge(id) {
  router.push(`/challenge/${id}`)
}

onMounted(() => {
  setGreeting()
  challengesStore.refreshDailyChallenge()
})
</script>

<template>
  <div class="home-container">
    <div class="welcome-section">
      <div class="welcome-message">
        <h1>{{ greeting }}, {{ userName }}!</h1>
        <p class="level-indicator">Level {{ userLevel }}</p>
      </div>
      
      <div class="progress-section">
        <div class="progress-header">
          <h3>Daily Progress</h3>
          <span class="progress-fraction">{{ completedChallenges }}/{{ dailyGoal }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
        <div class="progress-stats">
          <div class="stat-item">
            <span class="stat-value">{{ dailyStreak }}</span>
            <span class="stat-label">Day Streak 🔥</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="daily-challenge-section">
      <h2 class="section-title">Daily Challenge</h2>
      <div 
        class="daily-challenge-card" 
        @click="startChallenge(challengesStore.dailyChallenge.id)"
        v-voix="'Start Daily Challenge'"
        hint="Begin today's recommended mental exercise"
      >
        <div class="challenge-icon">{{ challengesStore.dailyChallenge.thumbnail }}</div>
        <div class="challenge-content">
          <h3>{{ challengesStore.dailyChallenge.title }}</h3>
          <p>{{ challengesStore.dailyChallenge.description }}</p>
          <div class="challenge-meta">
            <span class="challenge-duration">
              <span class="icon">⏱️</span> {{ challengesStore.dailyChallenge.duration }} min
            </span>
            <span class="challenge-points">
              <span class="icon">⭐</span> {{ challengesStore.dailyChallenge.points }} points
            </span>
          </div>
        </div>
        <div class="challenge-status" :class="{ 'completed': completedToday }">
          {{ completedToday ? 'Completed' : 'Start' }}
        </div>
      </div>
    </div>
    
    <div class="recommendations-section">
      <div class="section-header">
        <h2 class="section-title">Recommended for You</h2>
        <button 
          class="see-all-btn" 
          @click="router.push('/challenges')"
          v-voix="'See All Challenges'"
          hint="View the complete list of available challenges"
        >See All</button>
      </div>
      
      <div class="challenge-grid">
        <div 
          v-for="challenge in challengesStore.allChallenges.slice(0, 3)" 
          :key="challenge.id"
          class="challenge-item"
          @click="startChallenge(challenge.id)"
          v-voix="'Start ' + challenge.title + ' Challenge'"
          hint="Begin this recommended challenge"
        >
          <ChallengeCard :challenge="challenge" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.welcome-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
}

.welcome-message h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.level-indicator {
  margin: 0.5rem 0 1rem;
  color: #666;
  font-size: 0.9rem;
}

.progress-section {
  margin-top: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.progress-fraction {
  font-weight: 600;
  color: #3a86ff;
}

.progress-bar {
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background-color: #3a86ff;
  transition: width 0.5s ease;
}

.progress-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

.section-title {
  margin: 0 0 1.25rem 0;
  font-size: 1.4rem;
  color: #333;
}

.daily-challenge-section {
  margin-bottom: 2rem;
}

.daily-challenge-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.daily-challenge-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.challenge-icon {
  font-size: 2.5rem;
  margin-right: 1.5rem;
}

.challenge-content {
  flex: 1;
}

.challenge-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #333;
}

.challenge-content p {
  margin: 0 0 0.75rem 0;
  color: #666;
  font-size: 0.9rem;
}

.challenge-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: #777;
}

.challenge-duration, .challenge-points {
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 0.25rem;
}

.challenge-status {
  background-color: #3a86ff;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.challenge-status.completed {
  background-color: #4CAF50;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.see-all-btn {
  background: none;
  border: none;
  color: #3a86ff;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
}

.challenge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.challenge-item {
  cursor: pointer;
}

@media (min-width: 768px) {
  .welcome-section {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .progress-section {
    margin-top: 0;
    min-width: 300px;
  }
}

@media (max-width: 767px) {
  .challenge-grid {
    grid-template-columns: 1fr;
  }
  
  .daily-challenge-card {
    flex-direction: column;
    text-align: center;
  }
  
  .challenge-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .challenge-meta {
    justify-content: center;
  }
  
  .challenge-status {
    margin-top: 1.25rem;
  }
}
</style>
