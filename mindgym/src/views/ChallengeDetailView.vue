<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChallengesStore } from '../stores/challenges'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const challengesStore = useChallengesStore()
const userStore = useUserStore()

const challengeId = computed(() => route.params.id)
const challenge = computed(() => challengesStore.getChallengeById(challengeId.value))

// Challenge state
const currentStep = ref(0) // 0: instructions, 1: in progress, 2: completed
const timeLeft = ref(0)
const score = ref(0)
const timerInterval = ref(null)

// Simple memory matrix challenge implementation
const matrixSize = ref(3)
const matrix = ref([])
const userSequence = ref([])
const targetSequence = ref([])
const isShowingPattern = ref(false)
const roundsCompleted = ref(0)

function startChallenge() {
  currentStep.value = 1
  
  // Start timer
  timeLeft.value = challenge.value.duration * 60 // convert to seconds
  timerInterval.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      completeChallenge()
    }
  }, 1000)
  
  // Initialize game state based on challenge type
  if (challenge.value.type === 'memory') {
    initializeMemoryMatrix()
  }
}

function initializeMemoryMatrix() {
  // Create empty matrix
  matrix.value = Array(matrixSize.value * matrixSize.value).fill(false)
  
  // Generate new pattern
  generatePattern()
}

function generatePattern() {
  // Reset state
  userSequence.value = []
  isShowingPattern.value = true
  
  // Generate random sequence (min 3, max 5 + round level)
  const sequenceLength = Math.min(3 + roundsCompleted.value, 8)
  targetSequence.value = []
  
  for (let i = 0; i < sequenceLength; i++) {
    const randomIndex = Math.floor(Math.random() * matrix.value.length)
    targetSequence.value.push(randomIndex)
  }
  
  // Show pattern
  let currentIndex = 0
  const patternInterval = setInterval(() => {
    // Clear all
    matrix.value = matrix.value.map(() => false)
    
    if (currentIndex < targetSequence.value.length) {
      // Light up current cell
      matrix.value[targetSequence.value[currentIndex]] = true
      currentIndex++
    } else {
      // End of sequence
      matrix.value = matrix.value.map(() => false)
      isShowingPattern.value = false
      clearInterval(patternInterval)
    }
  }, 800)
}

function handleCellClick(index) {
  if (isShowingPattern.value) return
  
  // Add to user sequence
  userSequence.value.push(index)
  
  // Light up clicked cell briefly
  matrix.value[index] = true
  setTimeout(() => {
    matrix.value[index] = false
  }, 300)
  
  // Check if sequence is complete
  if (userSequence.value.length === targetSequence.value.length) {
    checkSequence()
  }
}

function checkSequence() {
  // Compare sequences
  const correct = userSequence.value.every((val, i) => val === targetSequence.value[i])
  
  if (correct) {
    // Correct pattern
    roundsCompleted.value++
    score.value += 10 * roundsCompleted.value
    
    // Next round (harder)
    setTimeout(() => {
      if (roundsCompleted.value % 3 === 0 && matrixSize.value < 5) {
        matrixSize.value++
        matrix.value = Array(matrixSize.value * matrixSize.value).fill(false)
      }
      generatePattern()
    }, 1000)
  } else {
    // Incorrect pattern
    setTimeout(() => {
      // Reset and try again (same difficulty)
      generatePattern()
    }, 1000)
  }
}

function completeChallenge() {
  clearInterval(timerInterval.value)
  currentStep.value = 2
  
  // Calculate final score with time bonus
  const timeBonus = Math.floor(timeLeft.value / 10)
  score.value += timeBonus
  
  // Update user stats
  userStore.completeChallenge()
  userStore.addPoints(score.value)
  
  // Mark challenge as completed
  challengesStore.markChallengeCompleted(challengeId.value)
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function backToHome() {
  router.push('/')
}

onMounted(() => {
  if (!challenge.value) {
    router.push('/challenges')
  }
})
</script>

<template>
  <div class="challenge-detail-container" v-if="challenge">
    <!-- Instructions Step -->
    <div v-if="currentStep === 0" class="challenge-instructions">
      <div class="challenge-header">
        <div class="challenge-title-wrapper">
          <div class="challenge-thumbnail">{{ challenge.thumbnail }}</div>
          <div>
            <h1>{{ challenge.title }}</h1>
            <div class="challenge-meta">
              <span class="challenge-type">{{ challenge.type }}</span>
              <span class="challenge-difficulty">{{ challenge.difficulty }}</span>
              <span class="challenge-duration">⏱️ {{ challenge.duration }} min</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="instructions-content">
        <h2>Instructions</h2>
        <p>{{ challenge.instructions }}</p>
        
        <div class="challenge-info">
          <div class="info-item">
            <h3>Benefits</h3>
            <p>This exercise helps improve your {{ challenge.type }} abilities, which are essential for everyday tasks.</p>
          </div>
          
          <div class="info-item">
            <h3>Scoring</h3>
            <p>Earn points for each correct answer. Complete faster for time bonus points!</p>
          </div>
        </div>
        
        <div class="start-actions">
          <button 
            class="btn btn-primary" 
            @click="startChallenge"
            v-voix="'Start Challenge'"
            hint="Begin this mental exercise"
          >Start Challenge</button>
          <button 
            class="btn btn-secondary" 
            @click="backToHome"
            v-voix="'Return to Home'"
            hint="Go back to the home page"
          >Back to Home</button>
        </div>
      </div>
    </div>
    
    <!-- In Progress Step -->
    <div v-if="currentStep === 1" class="challenge-in-progress">
      <div class="challenge-header">
        <h1>{{ challenge.title }}</h1>
        
        <div class="challenge-stats">
          <div class="timer">⏱️ {{ formatTime(timeLeft) }}</div>
          <div class="score">Score: {{ score }}</div>
        </div>
      </div>
      
      <!-- Memory Matrix Game -->
      <div v-if="challenge.type === 'memory'" class="memory-game">
        <div class="game-instructions" v-if="isShowingPattern">
          Memorize the pattern...
        </div>
        <div class="game-instructions" v-else>
          Reproduce the pattern
        </div>
        
        <div class="matrix-container" :style="{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)` }">
          <div 
            v-for="(cell, index) in matrix" 
            :key="index"
            class="matrix-cell"
            :class="{ 'active': cell }"
            @click="handleCellClick(index)"
            v-voix="'Matrix Cell ' + (index + 1)"
            hint="Select this cell as part of the pattern"
          ></div>
        </div>
        
        <div class="round-indicator">
          Round {{ roundsCompleted + 1 }}
        </div>
      </div>
      
      <button 
        class="btn btn-danger" 
        @click="completeChallenge"
        v-voix="'End Challenge'"
        hint="Finish the current challenge and see your results"
      >End Challenge</button>
    </div>
    
    <!-- Completed Step -->
    <div v-if="currentStep === 2" class="challenge-completed">
      <div class="completion-header">
        <div class="completion-icon">🎉</div>
        <h1>Challenge Complete!</h1>
      </div>
      
      <div class="completion-stats">
        <div class="stat-item">
          <div class="stat-label">Score</div>
          <div class="stat-value">{{ score }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">Rounds Completed</div>
          <div class="stat-value">{{ roundsCompleted }}</div>
        </div>
      </div>
      
      <div class="completion-message">
        <p>Great job! You've completed this challenge and earned {{ score }} points.</p>
        <p>Continue your daily mental workout with more challenges.</p>
      </div>
      
      <div class="completion-actions">
        <button 
          class="btn btn-primary" 
          @click="backToHome"
          v-voix="'Back to Home'"
          hint="Return to the home page"
        >Back to Home</button>
        <button 
          class="btn btn-secondary" 
          @click="router.push('/challenges')"
          v-voix="'More Challenges'"
          hint="Browse more challenges to complete"
        >More Challenges</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.challenge-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.challenge-header {
  margin-bottom: 2rem;
}

.challenge-title-wrapper {
  display: flex;
  align-items: center;
}

.challenge-thumbnail {
  font-size: 3rem;
  margin-right: 1.5rem;
}

.challenge-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.challenge-type, .challenge-difficulty, .challenge-duration {
  background-color: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  color: #666;
}

.instructions-content {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.challenge-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
}

.info-item h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.info-item p {
  margin: 0;
  color: #666;
}

.start-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3a86ff;
  color: white;
}

.btn-primary:hover {
  background-color: #2a75e8;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-danger {
  background-color: #ff4757;
  color: white;
}

.btn-danger:hover {
  background-color: #e04252;
}

/* In Progress Styles */
.challenge-in-progress {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.challenge-stats {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 2rem;
}

.timer, .score {
  font-size: 1.2rem;
  font-weight: 600;
}

/* Memory Matrix Game */
.memory-game {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.game-instructions {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.matrix-container {
  display: grid;
  gap: 0.5rem;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  margin-bottom: 1.5rem;
}

.matrix-cell {
  background-color: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  aspect-ratio: 1;
}

.matrix-cell.active {
  background-color: #3a86ff;
}

.matrix-cell:hover:not(.active) {
  background-color: #e0e0e0;
}

.round-indicator {
  margin-top: 1rem;
  font-weight: 600;
  color: #666;
}

/* Completion Styles */
.challenge-completed {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  text-align: center;
}

.completion-header {
  margin-bottom: 2rem;
}

.completion-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.completion-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3a86ff;
}

.completion-message {
  color: #666;
  margin-bottom: 2rem;
}

.completion-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

@media (max-width: 767px) {
  .challenge-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .start-actions, .completion-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .completion-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>