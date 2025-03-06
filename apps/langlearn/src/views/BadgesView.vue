<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

// User's badges
const userBadges = computed(() => userStore.profile.badges || [])

// All available badges
const allBadges = [
  // Streak badges
  { id: 'streak-3', name: '3-Day Streak', description: 'Completed lessons 3 days in a row', category: 'streak', icon: '🔥', color: '#f59e0b' },
  { id: 'streak-7', name: '7-Day Streak', description: 'A whole week of learning', category: 'streak', icon: '🔥', color: '#f59e0b' },
  { id: 'streak-30', name: '30-Day Streak', description: 'An entire month of dedication', category: 'streak', icon: '🔥', color: '#f59e0b' },
  { id: 'streak-100', name: '100-Day Streak', description: 'Incredible dedication! 100 days in a row', category: 'streak', icon: '🔥', color: '#f59e0b' },
  
  // Achievement badges
  { id: 'welcome', name: 'Welcome', description: 'Started your language learning journey', category: 'achievement', icon: '🎉', color: '#3b82f6' },
  { id: 'first-lesson', name: 'First Lesson', description: 'Completed your first lesson', category: 'achievement', icon: '🏁', color: '#3b82f6' },
  { id: 'level-5', name: 'Level 5', description: 'Reached level 5', category: 'achievement', icon: '⭐', color: '#3b82f6' },
  { id: 'level-10', name: 'Level 10', description: 'Reached level 10', category: 'achievement', icon: '⭐', color: '#3b82f6' },
  
  // Skill badges
  { id: 'vocabulary-100', name: 'Wordsmith', description: 'Learned 100 words', category: 'skill', icon: '📚', color: '#10b981' },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Completed a lesson with 100% accuracy', category: 'skill', icon: '🎯', color: '#10b981' },
  { id: 'grammar-guru', name: 'Grammar Guru', description: 'Mastered complex grammar rules', category: 'skill', icon: '📝', color: '#10b981' },
  { id: 'conversation-master', name: 'Conversation Master', description: 'Completed all conversation exercises', category: 'skill', icon: '💬', color: '#10b981' },
]

// Check if user has badge
const hasBadge = (badgeId) => {
  return userStore.hasBadge(badgeId)
}

// Filter badges by category
const filterCategory = ref('all')

const filteredBadges = computed(() => {
  if (filterCategory.value === 'all') {
    return allBadges
  } else if (filterCategory.value === 'earned') {
    return allBadges.filter(badge => hasBadge(badge.id))
  } else if (filterCategory.value === 'unearned') {
    return allBadges.filter(badge => !hasBadge(badge.id))
  } else {
    return allBadges.filter(badge => badge.category === filterCategory.value)
  }
})

// Get badge earned date
const getBadgeEarnedDate = (badgeId) => {
  const badge = userBadges.value.find(b => b.id === badgeId)
  if (!badge || !badge.awardedAt) return null
  
  return new Date(badge.awardedAt).toLocaleDateString()
}
</script>

<template>
  <div class="badges-container">
    <div class="badges-header">
      <h1 class="page-title">Badges</h1>
      
      <div class="badges-summary">
        <div class="earned-count" v-voix="'earned-badges-count'" :hint="`You've earned ${userBadges.length} of ${allBadges.length} badges`">
          {{ userBadges.length }} of {{ allBadges.length }} badges earned
        </div>
      </div>
    </div>
    
    <div class="filter-controls">
      <button 
        class="filter-button" 
        :class="{ active: filterCategory === 'all' }"
        @click="filterCategory = 'all'"
        v-voix="'filter-all-badges'"
        hint="Show all badges"
      >
        All
      </button>
      <button 
        class="filter-button" 
        :class="{ active: filterCategory === 'earned' }"
        @click="filterCategory = 'earned'"
        v-voix="'filter-earned-badges'"
        hint="Show only earned badges"
      >
        Earned
      </button>
      <button 
        class="filter-button" 
        :class="{ active: filterCategory === 'unearned' }"
        @click="filterCategory = 'unearned'"
        v-voix="'filter-unearned-badges'"
        hint="Show only unearned badges"
      >
        Unearned
      </button>
      <button 
        class="filter-button" 
        :class="{ active: filterCategory === 'streak' }"
        @click="filterCategory = 'streak'"
        v-voix="'filter-streak-badges'"
        hint="Show only streak badges"
      >
        Streak
      </button>
      <button 
        class="filter-button" 
        :class="{ active: filterCategory === 'achievement' }"
        @click="filterCategory = 'achievement'"
        v-voix="'filter-achievement-badges'"
        hint="Show only achievement badges"
      >
        Achievements
      </button>
      <button 
        class="filter-button" 
        :class="{ active: filterCategory === 'skill' }"
        @click="filterCategory = 'skill'"
        v-voix="'filter-skill-badges'"
        hint="Show only skill badges"
      >
        Skills
      </button>
    </div>
    
    <div class="badges-grid">
      <div 
        v-for="badge in filteredBadges" 
        :key="badge.id"
        class="badge-card"
        :class="{ earned: hasBadge(badge.id) }"
        v-voix="`badge-${badge.id}`"
        :hint="`${badge.name} badge: ${badge.description}. ${hasBadge(badge.id) ? 'You have earned this badge' : 'You have not earned this badge yet'}`"
      >
        <div class="badge-icon" :style="{ backgroundColor: badge.color }">
          <span class="icon">{{ badge.icon }}</span>
          <div class="badge-status" v-if="hasBadge(badge.id)">✓</div>
        </div>
        
        <div class="badge-content">
          <h3 class="badge-name">{{ badge.name }}</h3>
          <p class="badge-description">{{ badge.description }}</p>
          
          <div v-if="hasBadge(badge.id)" class="badge-earned-date">
            Earned on {{ getBadgeEarnedDate(badge.id) }}
          </div>
          <div v-else class="badge-locked">
            Not earned yet
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="filteredBadges.length === 0" class="empty-state">
      <p>No badges match the selected filter.</p>
    </div>
  </div>
</template>

<style scoped>
.badges-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.badges-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.badges-summary {
  display: flex;
  align-items: center;
}

.earned-count {
  font-size: 1rem;
  font-weight: 500;
  color: var(--primary-color);
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.filter-button {
  padding: 0.5rem 1rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 2rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-button:hover {
  background-color: var(--border-color);
}

.filter-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.badge-card {
  display: flex;
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
  transition: transform 0.2s, box-shadow 0.2s;
}

.badge-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
}

.badge-card.earned {
  border-color: var(--success-color);
}

.badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  flex-shrink: 0;
  background-color: #3b82f6;
  color: white;
  position: relative;
}

.icon {
  font-size: 2rem;
}

.badge-status {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: var(--success-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.badge-content {
  padding: 1rem;
  flex: 1;
}

.badge-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--primary-dark);
}

.badge-description {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
}

.badge-earned-date {
  font-size: 0.75rem;
  color: var(--success-color);
  font-weight: 500;
}

.badge-locked {
  font-size: 0.75rem;
  color: var(--text-light);
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: var(--bg-color);
  border-radius: 1rem;
  color: var(--text-light);
}

@media (max-width: 640px) {
  .badges-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .badges-grid {
    grid-template-columns: 1fr;
  }
}
</style>