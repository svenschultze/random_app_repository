import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useChallengesStore = defineStore('challenges', () => {
  // State
  const challenges = ref([
    {
      id: 1,
      title: 'Memory Matrix',
      description: 'Test and improve your short-term memory by remembering patterns.',
      type: 'memory',
      difficulty: 'beginner',
      duration: 3, // in minutes
      points: 10,
      completed: false,
      instructions: 'You will be shown a grid of squares that will light up in a specific pattern. Memorize the pattern and then reproduce it in the correct order.',
      thumbnail: '🧠'
    },
    {
      id: 2,
      title: 'Number Sequence',
      description: 'Find the pattern in a sequence of numbers.',
      type: 'logic',
      difficulty: 'intermediate',
      duration: 5,
      points: 15,
      completed: false,
      instructions: 'Analyze the given number sequence and determine what number should come next by identifying the pattern.',
      thumbnail: '🔢'
    },
    {
      id: 3,
      title: 'Word Association',
      description: 'Test your verbal reasoning by finding related words.',
      type: 'verbal',
      difficulty: 'beginner',
      duration: 4,
      points: 10,
      completed: false,
      instructions: 'For each word presented, select the most closely related word from the options provided.',
      thumbnail: '📝'
    },
    {
      id: 4,
      title: 'Visual Puzzles',
      description: 'Solve puzzles that test your spatial reasoning abilities.',
      type: 'spatial',
      difficulty: 'advanced',
      duration: 7,
      points: 20,
      completed: false,
      instructions: 'Analyze the visual patterns and select the missing piece that completes the pattern.',
      thumbnail: '🧩'
    },
    {
      id: 5,
      title: 'Mental Math',
      description: 'Solve math problems in your head as quickly as possible.',
      type: 'math',
      difficulty: 'intermediate',
      duration: 5,
      points: 15,
      completed: false,
      instructions: 'Solve the math problems presented without using a calculator. Focus on speed and accuracy.',
      thumbnail: '➗'
    }
  ])
  
  const dailyChallenge = ref({
    id: 0,
    title: 'Daily Brain Boost',
    description: 'A special daily challenge to keep your mind sharp.',
    type: 'mixed',
    difficulty: 'varies',
    duration: 6,
    points: 25,
    completed: false,
    date: new Date().toISOString().split('T')[0],
    instructions: 'Complete the daily challenge to maintain your streak and earn bonus points!',
    thumbnail: '🏆'
  })
  
  // Getters
  const allChallenges = computed(() => challenges.value)
  
  const getChallengeById = computed(() => {
    return (id) => challenges.value.find(challenge => challenge.id === parseInt(id))
  })
  
  const filteredChallenges = computed(() => {
    return (type = null, difficulty = null) => {
      return challenges.value.filter(challenge => {
        const matchesType = type ? challenge.type === type : true
        const matchesDifficulty = difficulty ? challenge.difficulty === difficulty : true
        return matchesType && matchesDifficulty
      })
    }
  })
  
  const completedChallenges = computed(() => {
    return challenges.value.filter(challenge => challenge.completed)
  })
  
  // Actions
  function markChallengeCompleted(id) {
    const index = challenges.value.findIndex(challenge => challenge.id === parseInt(id))
    if (index !== -1) {
      challenges.value[index].completed = true
    }
    
    // Check if it's the daily challenge
    if (dailyChallenge.value.id === parseInt(id)) {
      dailyChallenge.value.completed = true
    }
  }
  
  function refreshDailyChallenge() {
    const today = new Date().toISOString().split('T')[0]
    
    // If the daily challenge is from a previous day, reset it
    if (dailyChallenge.value.date !== today) {
      dailyChallenge.value = {
        ...dailyChallenge.value,
        completed: false,
        date: today
      }
    }
  }
  
  // Call this when the store initializes
  refreshDailyChallenge()
  
  return {
    challenges,
    dailyChallenge,
    allChallenges,
    getChallengeById,
    filteredChallenges,
    completedChallenges,
    markChallengeCompleted,
    refreshDailyChallenge
  }
})