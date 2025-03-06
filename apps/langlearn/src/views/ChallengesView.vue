<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useNotificationsStore } from '../stores/notifications'

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

// Current filter
const activeTab = ref('all') // 'all', 'daily', 'weekly', 'monthly'

// Mock challenges data
const challenges = [
  {
    id: 'daily-1',
    title: 'Daily Practice',
    description: 'Complete at least one lesson today',
    type: 'daily',
    xpReward: 15,
    progress: 0,
    target: 1,
    timeLeft: '14 hours',
    completed: false,
    participants: 1258,
    icon: '📚'
  },
  {
    id: 'daily-2',
    title: 'Vocab Builder',
    description: 'Learn 10 new words today',
    type: 'daily',
    xpReward: 25,
    progress: 4,
    target: 10,
    timeLeft: '14 hours',
    completed: false,
    participants: 843,
    icon: '🔤'
  },
  {
    id: 'daily-3',
    title: 'Perfect Score',
    description: 'Complete a lesson with 100% accuracy',
    type: 'daily',
    xpReward: 30,
    progress: 0,
    target: 1,
    timeLeft: '14 hours',
    completed: false,
    participants: 621,
    icon: '🎯'
  },
  {
    id: 'weekly-1',
    title: 'Weekly Streak',
    description: 'Practice for 5 days this week',
    type: 'weekly',
    xpReward: 50,
    progress: 3,
    target: 5,
    timeLeft: '4 days',
    completed: false,
    participants: 2543,
    icon: '🔥'
  },
  {
    id: 'weekly-2',
    title: 'Grammar Master',
    description: 'Complete 3 grammar lessons this week',
    type: 'weekly',
    xpReward: 75,
    progress: 1,
    target: 3,
    timeLeft: '4 days',
    completed: false,
    participants: 1876,
    icon: '📝'
  },
  {
    id: 'weekly-3',
    title: 'XP Champion',
    description: 'Earn 300 XP this week',
    type: 'weekly',
    xpReward: 100,
    progress: 120,
    target: 300,
    timeLeft: '4 days',
    completed: false,
    participants: 3210,
    icon: '🏆'
  },
  {
    id: 'monthly-1',
    title: 'Conversation Pro',
    description: 'Complete 10 speaking exercises this month',
    type: 'monthly',
    xpReward: 150,
    progress: 4,
    target: 10,
    timeLeft: '21 days',
    completed: false,
    participants: 1532,
    icon: '🗣️'
  },
  {
    id: 'monthly-2',
    title: 'Vocabulary Expert',
    description: 'Learn 100 new words this month',
    type: 'monthly',
    xpReward: 200,
    progress: 45,
    target: 100,
    timeLeft: '21 days',
    completed: false,
    participants: 982,
    icon: '📚'
  }
]

// Filtered challenges based on active tab
const filteredChallenges = computed(() => {
  if (activeTab.value === 'all') {
    return challenges
  } else {
    return challenges.filter(challenge => challenge.type === activeTab.value)
  }
})

// Calculate progress percentage for a challenge
const calculateProgress = (challenge) => {
  return Math.min(100, Math.round((challenge.progress / challenge.target) * 100))
}

// Start or continue a challenge
const startChallenge = (challenge) => {
  // In a real app, this would navigate to appropriate lessons or exercises
  // For this demo, we'll just show a notification
  notificationsStore.addNotification({
    type: 'info',
    title: 'Challenge Started',
    message: `You're now working on the "${challenge.title}" challenge!`,
    autoDismiss: 5000
  })
}

// Mock challenge completion
const completeChallenge = (challenge) => {
  challenge.progress = challenge.target
  challenge.completed = true
  
  // Award XP
  userStore.addXP(challenge.xpReward)
  
  // Show notification
  notificationsStore.addNotification({
    type: 'success',
    title: 'Challenge Completed!',
    message: `You've completed "${challenge.title}" and earned ${challenge.xpReward} XP!`,
    autoDismiss: 5000
  })
}
</script>

<template>
  <div class="challenges-container">
    <div class="challenges-header">
      <h1 class="page-title">Challenges</h1>
      <p class="page-description">
        Complete challenges to earn XP and level up faster. New challenges are available daily, weekly, and monthly.
      </p>
    </div>
    
    <div class="filter-tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
        v-voix="'all-challenges-tab'"
        hint="View all challenges"
      >
        All Challenges
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'daily' }"
        @click="activeTab = 'daily'"
        v-voix="'daily-challenges-tab'"
        hint="View daily challenges"
      >
        Daily
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'weekly' }"
        @click="activeTab = 'weekly'"
        v-voix="'weekly-challenges-tab'"
        hint="View weekly challenges"
      >
        Weekly
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'monthly' }"
        @click="activeTab = 'monthly'"
        v-voix="'monthly-challenges-tab'"
        hint="View monthly challenges"
      >
        Monthly
      </button>
    </div>
    
    <div class="challenges-grid">
      <div 
        v-for="challenge in filteredChallenges" 
        :key="challenge.id"
        class="challenge-card"
        :class="{ completed: challenge.completed }"
        v-voix="`challenge-${challenge.id}`"
        :hint="`${challenge.title} challenge: ${challenge.description}`"
      >
        <div class="challenge-header">
          <div class="challenge-icon" :class="challenge.type">
            {{ challenge.icon }}
          </div>
          <div class="challenge-type-badge" :class="challenge.type">
            {{ challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1) }}
          </div>
        </div>
        
        <div class="challenge-content">
          <h2 class="challenge-title">{{ challenge.title }}</h2>
          <p class="challenge-description">{{ challenge.description }}</p>
          
          <div class="challenge-progress">
            <div class="progress-info">
              <span v-voix="`progress-${challenge.id}`" :hint="`Progress: ${challenge.progress} of ${challenge.target} completed`">
                {{ challenge.progress }} / {{ challenge.target }}
              </span>
              <span>{{ calculateProgress(challenge) }}%</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: `${calculateProgress(challenge)}%` }"></div>
            </div>
          </div>
          
          <div class="challenge-meta">
            <div class="reward" v-voix="`reward-${challenge.id}`" :hint="`Reward: ${challenge.xpReward} XP`">
              <span class="reward-icon">🏆</span> {{ challenge.xpReward }} XP
            </div>
            <div class="time-left" v-voix="`time-${challenge.id}`" :hint="`Time left: ${challenge.timeLeft}`">
              <span class="time-icon">⏰</span> {{ challenge.timeLeft }}
            </div>
          </div>
          
          <div class="challenge-stats">
            <div class="participants" v-voix="`participants-${challenge.id}`" :hint="`${challenge.participants} users participating`">
              {{ challenge.participants }} users participating
            </div>
          </div>
        </div>
        
        <div class="challenge-actions">
          <button 
            v-if="!challenge.completed && calculateProgress(challenge) < 100" 
            class="btn btn-primary"
            @click="startChallenge(challenge)"
            v-voix="`start-${challenge.id}`"
            hint="Start working on this challenge"
          >
            {{ challenge.progress > 0 ? 'Continue' : 'Start' }}
          </button>
          
          <button 
            v-else-if="!challenge.completed && calculateProgress(challenge) >= 100" 
            class="btn btn-success"
            @click="completeChallenge(challenge)"
            v-voix="`claim-${challenge.id}`"
            hint="Claim your reward for this challenge"
          >
            Claim Reward
          </button>
          
          <button 
            v-else
            class="btn btn-completed"
            disabled
            v-voix="`completed-${challenge.id}`"
            hint="You have completed this challenge"
          >
            Completed
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="filteredChallenges.length === 0" class="empty-state">
      <p>No challenges available for the selected filter.</p>
    </div>
  </div>
</template>

<style scoped>
.challenges-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.challenges-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 0.75rem;
}

.page-description {
  color: var(--text-light);
  max-width: 800px;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1px;
}

.tab-button {
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-light);
}

.tab-button:hover {
  color: var(--primary-color);
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.challenge-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}

.challenge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.challenge-card.completed {
  border-color: var(--success-color);
}

.challenge-header {
  position: relative;
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.challenge-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-light);
  color: white;
  border-radius: 0.75rem;
  font-size: 1.5rem;
}

.challenge-icon.daily {
  background-color: var(--info-color);
}

.challenge-icon.weekly {
  background-color: var(--primary-color);
}

.challenge-icon.monthly {
  background-color: var(--accent-color);
}

.challenge-type-badge {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.challenge-type-badge.daily {
  background-color: var(--info-color);
}

.challenge-type-badge.weekly {
  background-color: var(--primary-color);
}

.challenge-type-badge.monthly {
  background-color: var(--accent-color);
}

.challenge-content {
  padding: 1.25rem;
}

.challenge-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--primary-dark);
}

.challenge-description {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 1.25rem;
  min-height: 2.625rem;
}

.challenge-progress {
  margin-bottom: 1.25rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
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
}

.challenge-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.reward, .time-left {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.reward {
  color: var(--accent-color);
  font-weight: 500;
}

.time-left {
  color: var(--warning-color);
  font-weight: 500;
}

.challenge-stats {
  font-size: 0.75rem;
  color: var(--text-light);
  margin-bottom: 1.25rem;
}

.challenge-actions {
  padding: 1.25rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
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

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-success {
  background-color: var(--success-color);
  color: white;
}

.btn-success:hover {
  background-color: #0e9f6e;
}

.btn-completed {
  background-color: var(--border-color);
  color: var(--text-light);
  cursor: default;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: var(--bg-color);
  border-radius: 1rem;
  color: var(--text-light);
}

@media (max-width: 640px) {
  .filter-tabs {
    flex-wrap: wrap;
  }
  
  .tab-button {
    flex: 1 1 40%;
    text-align: center;
  }
  
  .challenges-grid {
    grid-template-columns: 1fr;
  }
}
</style>