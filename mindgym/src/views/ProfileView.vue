<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useChallengesStore } from '../stores/challenges'

const userStore = useUserStore()
const challengesStore = useChallengesStore()

const userName = computed(() => userStore.user.name)
const userLevel = computed(() => userStore.userLevel)
const userPoints = computed(() => userStore.userPoints)
const userStreakDays = computed(() => userStore.userStreakDays)
const userBadges = computed(() => userStore.user.stats.badges)
const completedChallenges = computed(() => challengesStore.completedChallenges.length)

// Progress to next level
const currentLevelPoints = computed(() => (userLevel.value - 1) * 100)
const nextLevelPoints = computed(() => userLevel.value * 100)
const levelProgress = computed(() => {
  return ((userPoints.value - currentLevelPoints.value) / 
          (nextLevelPoints.value - currentLevelPoints.value)) * 100
})

// Mock badges if none exist
const defaultBadges = [
  { id: 'first_challenge', name: 'First Challenge', icon: '🏅', description: 'Completed your first challenge' },
  { id: 'streak_3', name: '3-Day Streak', icon: '🔥', description: 'Maintained a 3-day streak' },
  { id: 'memory_master', name: 'Memory Master', icon: '🧠', description: 'Excelled at memory challenges' }
]

const availableBadges = computed(() => {
  if (userBadges.value && userBadges.value.length > 0) {
    return userBadges.value
  }
  return defaultBadges
})

// Form for updating preferences
const preferenceForm = ref({
  dailyGoal: userStore.user.preferences.dailyGoal,
  challengeTypes: [...userStore.user.preferences.challengeTypes],
  difficulty: userStore.user.preferences.difficulty
})

const challengeTypes = [
  { id: 'memory', name: 'Memory Exercises', icon: '🧠' },
  { id: 'logic', name: 'Logic Puzzles', icon: '🧩' },
  { id: 'verbal', name: 'Verbal Reasoning', icon: '📝' },
  { id: 'spatial', name: 'Spatial Reasoning', icon: '📐' },
  { id: 'math', name: 'Mental Math', icon: '➗' }
]

const difficultyLevels = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' }
]

function toggleChallengeType(typeId) {
  const index = preferenceForm.value.challengeTypes.indexOf(typeId)
  if (index === -1) {
    preferenceForm.value.challengeTypes.push(typeId)
  } else {
    preferenceForm.value.challengeTypes.splice(index, 1)
  }
}

function savePreferences() {
  userStore.updatePreferences(preferenceForm.value)
  alert('Preferences saved successfully!')
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="user-avatar">
        <img v-if="userStore.user.profilePicture" :src="userStore.user.profilePicture" :alt="userName" />
        <div v-else class="avatar-placeholder">{{ userName ? userName.charAt(0).toUpperCase() : 'U' }}</div>
      </div>
      
      <div class="user-info">
        <h1>{{ userName || 'User' }}</h1>
        <div class="user-meta">
          <div class="meta-item">
            <span class="meta-icon">⭐</span>
            <span class="meta-value">{{ userPoints }} points</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">📊</span>
            <span class="meta-value">Level {{ userLevel }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">🔥</span>
            <span class="meta-value">{{ userStreakDays }} day streak</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="profile-content">
      <div class="profile-section">
        <h2>Level Progress</h2>
        <div class="level-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${levelProgress}%` }"></div>
          </div>
          <div class="progress-labels">
            <span class="current-level">Level {{ userLevel }}</span>
            <span class="progress-points">{{ userPoints - currentLevelPoints }}/{{ nextLevelPoints - currentLevelPoints }}</span>
            <span class="next-level">Level {{ userLevel + 1 }}</span>
          </div>
        </div>
      </div>
      
      <div class="profile-section">
        <h2>Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🧩</div>
            <div class="stat-value">{{ completedChallenges }}</div>
            <div class="stat-label">Challenges Completed</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-value">{{ userPoints }}</div>
            <div class="stat-label">Total Points</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-value">{{ userStreakDays }}</div>
            <div class="stat-label">Day Streak</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🥇</div>
            <div class="stat-value">{{ availableBadges.length }}</div>
            <div class="stat-label">Badges Earned</div>
          </div>
        </div>
      </div>
      
      <div class="profile-section">
        <h2>Badges</h2>
        <div class="badges-grid">
          <div v-for="badge in availableBadges" :key="badge.id" class="badge-card">
            <div class="badge-icon">{{ badge.icon }}</div>
            <div class="badge-details">
              <div class="badge-name">{{ badge.name }}</div>
              <div class="badge-description">{{ badge.description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="profile-section">
        <h2>Preferences</h2>
        <div class="preferences-form">
          <div class="form-group">
            <label>Daily Goal</label>
            <div class="daily-goal-selector">
              <button 
                type="button" 
                class="goal-decrement" 
                @click="preferenceForm.dailyGoal = Math.max(1, preferenceForm.dailyGoal - 1)"
              >
                -
              </button>
              <div class="goal-value">{{ preferenceForm.dailyGoal }}</div>
              <button 
                type="button" 
                class="goal-increment" 
                @click="preferenceForm.dailyGoal = Math.min(5, preferenceForm.dailyGoal + 1)"
              >
                +
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>Challenge Types</label>
            <div class="challenge-types">
              <div 
                v-for="type in challengeTypes" 
                :key="type.id" 
                class="challenge-type-option"
                :class="{ selected: preferenceForm.challengeTypes.includes(type.id) }"
                @click="toggleChallengeType(type.id)"
              >
                <div class="type-icon">{{ type.icon }}</div>
                <div class="type-name">{{ type.name }}</div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Difficulty Level</label>
            <div class="difficulty-options">
              <div 
                v-for="level in difficultyLevels" 
                :key="level.id" 
                class="difficulty-option"
                :class="{ selected: preferenceForm.difficulty === level.id }"
                @click="preferenceForm.difficulty = level.id"
              >
                {{ level.name }}
              </div>
            </div>
          </div>
          
          <button class="save-btn" @click="savePreferences">Save Preferences</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.user-avatar {
  margin-right: 1.5rem;
}

.user-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #3a86ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 600;
}

.user-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  color: #333;
}

.user-meta {
  display: flex;
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.meta-icon {
  margin-right: 0.25rem;
}

.profile-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.profile-section h2 {
  margin: 0 0 1.25rem 0;
  font-size: 1.4rem;
  color: #333;
}

/* Level Progress */
.level-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 12px;
  background-color: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #3a86ff;
  transition: width 0.5s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
}

.progress-points {
  font-weight: 600;
  color: #3a86ff;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

/* Badges */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.badge-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
}

.badge-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.badge-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.badge-description {
  font-size: 0.85rem;
  color: #666;
}

/* Preferences Form */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
}

.daily-goal-selector {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.goal-value {
  font-size: 1.8rem;
  font-weight: bold;
  width: 60px;
  text-align: center;
  color: #3a86ff;
}

.goal-decrement, .goal-increment {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: #e6efff;
  color: #3a86ff;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.goal-decrement:hover, .goal-increment:hover {
  background-color: #d6e4ff;
}

.challenge-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.challenge-type-option {
  border: 2px solid #eee;
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.challenge-type-option:hover {
  border-color: #b3d4ff;
}

.challenge-type-option.selected {
  border-color: #3a86ff;
  background-color: #f0f7ff;
}

.type-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.difficulty-options {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.difficulty-option {
  border: 2px solid #eee;
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.difficulty-option:hover {
  border-color: #b3d4ff;
}

.difficulty-option.selected {
  border-color: #3a86ff;
  background-color: #f0f7ff;
}

.save-btn {
  background-color: #3a86ff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: #2a75e8;
}

@media (max-width: 767px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .user-avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .user-meta {
    justify-content: center;
  }
  
  .stats-grid, .badges-grid {
    grid-template-columns: 1fr;
  }
  
  .difficulty-options {
    flex-direction: column;
  }
}
</style>