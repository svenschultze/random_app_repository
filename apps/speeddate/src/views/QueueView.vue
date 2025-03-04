<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const queueStatus = ref('searching') // 'searching', 'matched', 'ready'
const matchCountdown = ref(3)
const matchFound = ref(false)
const tipIndex = ref(0)
const cancelDialogVisible = ref(false)

// Mock data - conversation starters and icebreaker tips
const tips = [
  "Ask about recent travel experiences or bucket list destinations",
  "Share an interesting hobby or passion you've been pursuing lately",
  "Ask about favorite books, movies, or shows they've enjoyed recently",
  "Discuss favorite cuisines or restaurants in the area",
  "Talk about a skill you'd like to learn or are currently developing",
  "Ask about their ideal weekend activities",
  "Share a fun fact about yourself that isn't on your profile"
]

let tipInterval
let queueTimer
let matchTimer

function rotateTips() {
  tipInterval = setInterval(() => {
    tipIndex.value = (tipIndex.value + 1) % tips.length
  }, 8000)
}

function simulateMatching() {
  // Simulate searching for a match (3-8 seconds)
  const matchTime = Math.floor(Math.random() * 5000) + 3000
  
  queueTimer = setTimeout(() => {
    queueStatus.value = 'matched'
    matchFound.value = true
    
    // Start countdown to call
    matchTimer = setInterval(() => {
      matchCountdown.value--
      
      if (matchCountdown.value <= 0) {
        clearInterval(matchTimer)
        queueStatus.value = 'ready'
        
        // Navigate to video call after a brief delay
        setTimeout(() => {
          router.push('/video-call')
        }, 1000)
      }
    }, 1000)
  }, matchTime)
}

function showCancelDialog() {
  cancelDialogVisible.value = true
}

function hideCancelDialog() {
  cancelDialogVisible.value = false
}

function leaveQueue() {
  router.push('/dashboard')
}

onMounted(() => {
  rotateTips()
  simulateMatching()
})

onBeforeUnmount(() => {
  // Clear all timers
  clearInterval(tipInterval)
  clearTimeout(queueTimer)
  clearInterval(matchTimer)
})
</script>

<template>
  <div class="queue-view">
    <div class="queue-container">
      <!-- Header -->
      <header class="queue-header">
        <h1 v-voix="'Queue status'">
          {{ 
            queueStatus === 'searching' ? 'Finding your match...' : 
            queueStatus === 'matched' ? 'Match found!' : 
            'Preparing your date...'
          }}
        </h1>
      </header>
      
      <!-- Status Animation -->
      <div class="status-animation">
        <div v-if="queueStatus === 'searching'" class="searching-animation">
          <div class="pulse-circle"></div>
          <div class="finding-text" v-voix="'Searching animation'">Searching for matches</div>
        </div>
        
        <div v-else-if="queueStatus === 'matched'" class="matched-animation">
          <div class="match-icon">🎉</div>
          <div class="countdown" v-voix="'Match countdown'">
            Starting in {{ matchCountdown }}
          </div>
        </div>
        
        <div v-else class="ready-animation">
          <div class="ready-icon">✓</div>
          <div class="ready-text" v-voix="'Ready status'">Connecting...</div>
        </div>
      </div>
      
      <!-- Tips Section -->
      <div class="tips-section" v-if="queueStatus === 'searching'">
        <h3 v-voix="'Conversation tips heading'">Conversation Tip:</h3>
        <div class="tip-card" v-voix="'Conversation tip'">{{ tips[tipIndex] }}</div>
      </div>
      
      <!-- Cancel Button -->
      <div class="button-container">
        <button 
          v-if="queueStatus !== 'ready'" 
          class="cancel-button" 
          @click="showCancelDialog"
          v-voix="'Cancel matching'"
          hint="Click to stop searching for matches and return to dashboard">
          Cancel
        </button>
      </div>
    </div>
    
    <!-- Cancel Confirmation Dialog -->
    <div v-if="cancelDialogVisible" class="cancel-dialog-overlay">
      <div 
        class="cancel-dialog"
        v-voix="'Cancel confirmation dialog'"
        hint="Confirm if you want to stop the matching process">
        <h3>Leave Queue?</h3>
        <p>Are you sure you want to cancel and return to the dashboard?</p>
        <div class="dialog-buttons">
          <button 
            class="dialog-button secondary" 
            @click="hideCancelDialog"
            v-voix="'Stay in queue'"
            hint="Continue searching for matches">
            Stay in Queue
          </button>
          <button 
            class="dialog-button primary" 
            @click="leaveQueue"
            v-voix="'Leave queue'"
            hint="Stop searching and return to dashboard">
            Leave Queue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.queue-view {
  min-height: 100vh;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.queue-container {
  max-width: 500px;
  width: 90%;
  padding: 2rem;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.queue-header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.5rem;
  color: #333;
}

.status-animation {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.searching-animation {
  position: relative;
}

.pulse-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: rgba(255, 75, 125, 0.2);
  position: relative;
  animation: pulse 2s infinite;
}

.pulse-circle::before {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  top: 20px;
  left: 20px;
  border-radius: 50%;
  background-color: rgba(255, 75, 125, 0.4);
  animation: pulse 2s infinite 0.3s;
}

.pulse-circle::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  top: 40px;
  left: 40px;
  border-radius: 50%;
  background-color: rgba(255, 75, 125, 1);
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
}

.finding-text {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 130px;
  font-size: 0.9rem;
  color: #666;
}

.matched-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.match-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease-in-out infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-15px);
  }
}

.countdown {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff4b7d;
}

.ready-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ready-icon {
  width: 60px;
  height: 60px;
  background-color: #4cd964;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.ready-text {
  font-size: 1.2rem;
  color: #555;
}

.tips-section {
  margin-bottom: 2rem;
}

h3 {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 0.75rem;
}

.tip-card {
  background-color: #f8f8f8;
  border-left: 3px solid #ff4b7d;
  padding: 1rem;
  text-align: left;
  font-size: 0.95rem;
  color: #555;
  border-radius: 5px;
  transition: opacity 0.5s;
}

.button-container {
  margin-top: 2rem;
}

.cancel-button {
  background: none;
  border: 1px solid #ccc;
  color: #777;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-button:hover {
  border-color: #999;
  color: #555;
}

/* Cancel Dialog */
.cancel-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.cancel-dialog {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 350px;
  text-align: center;
}

.cancel-dialog h3 {
  margin-top: 0;
}

.cancel-dialog p {
  color: #666;
  margin-bottom: 1.5rem;
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
}

.dialog-button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.dialog-button.primary {
  background-color: #ff4b7d;
  color: white;
  margin-left: 0.5rem;
}

.dialog-button.secondary {
  background-color: #f0f0f0;
  color: #555;
  margin-right: 0.5rem;
}
</style>