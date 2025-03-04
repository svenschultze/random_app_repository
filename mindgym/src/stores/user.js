import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref({
    id: null,
    name: '',
    email: '',
    profilePicture: '',
    preferences: {
      challengeTypes: [],
      difficulty: 'beginner',
      dailyGoal: 1,
    },
    stats: {
      streakDays: 0,
      totalCompletedChallenges: 0,
      points: 0,
      badges: [],
      level: 1,
    }
  })
  
  const hasCompletedOnboarding = ref(false)
  
  // Getters
  const userLevel = computed(() => user.value.stats.level)
  const userPoints = computed(() => user.value.stats.points)
  const userStreakDays = computed(() => user.value.stats.streakDays)
  
  // Actions
  function setUserProfile(profile) {
    user.value = { ...user.value, ...profile }
  }
  
  function updatePreferences(preferences) {
    user.value.preferences = { ...user.value.preferences, ...preferences }
  }
  
  function completeOnboarding() {
    hasCompletedOnboarding.value = true
    // Store in localStorage to persist between sessions
    localStorage.setItem('hasCompletedOnboarding', 'true')
  }
  
  function incrementStreak() {
    user.value.stats.streakDays += 1
  }
  
  function addPoints(amount) {
    user.value.stats.points += amount
    // Check if level up is needed
    if (user.value.stats.points >= user.value.stats.level * 100) {
      user.value.stats.level += 1
    }
  }
  
  function addBadge(badge) {
    if (!user.value.stats.badges.includes(badge)) {
      user.value.stats.badges.push(badge)
    }
  }
  
  function completeChallenge() {
    user.value.stats.totalCompletedChallenges += 1
    // Add points for completing a challenge
    addPoints(10)
  }
  
  // Initialize from localStorage if available
  function initialize() {
    const savedOnboarding = localStorage.getItem('hasCompletedOnboarding')
    if (savedOnboarding === 'true') {
      hasCompletedOnboarding.value = true
    }
    
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }
  
  // Call initialize
  initialize()
  
  return {
    user,
    hasCompletedOnboarding,
    userLevel,
    userPoints,
    userStreakDays,
    setUserProfile,
    updatePreferences,
    completeOnboarding,
    incrementStreak,
    addPoints,
    addBadge,
    completeChallenge
  }
})