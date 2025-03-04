<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Timer state
const timeRemaining = ref(5 * 60) // 5 minutes in seconds
const formattedTime = ref('5:00')
const timerWarning = ref(false)
const timerDanger = ref(false)
const timerId = ref(null)

// Controls state
const isMuted = ref(false)
const isVideoOff = ref(false)
const isMinimized = ref(false)
const showControls = ref(true)
const confirmEndDialogVisible = ref(false)

let controlsTimeout

function startTimer() {
  timerId.value = setInterval(() => {
    timeRemaining.value -= 1
    
    if (timeRemaining.value <= 0) {
      clearInterval(timerId.value)
      endCall()
      return
    }
    
    // Update formatted time
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    formattedTime.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    
    // Set warning states
    timerWarning.value = timeRemaining.value < 60 // Last minute
    timerDanger.value = timeRemaining.value < 30 // Last 30 seconds
  }, 1000)
}

function toggleMute() {
  isMuted.value = !isMuted.value
  resetControlsTimer()
}

function toggleVideo() {
  isVideoOff.value = !isVideoOff.value
  resetControlsTimer()
}

function toggleMinimize() {
  isMinimized.value = !isMinimized.value
  resetControlsTimer()
}

function handleUserActivity() {
  showControls.value = true
  resetControlsTimer()
}

function resetControlsTimer() {
  // Hide controls after 3 seconds of inactivity
  clearTimeout(controlsTimeout)
  controlsTimeout = setTimeout(() => {
    showControls.value = false
  }, 3000)
}

function showEndCallDialog() {
  confirmEndDialogVisible.value = true
  clearTimeout(controlsTimeout)
}

function hideEndCallDialog() {
  confirmEndDialogVisible.value = false
  resetControlsTimer()
}

function endCall() {
  // Cleanup timers
  clearInterval(timerId.value)
  clearTimeout(controlsTimeout)
  
  // Navigate to feedback screen
  router.push('/feedback')
}

onMounted(() => {
  startTimer()
  resetControlsTimer()
  
  // Setup event listeners
  window.addEventListener('mousemove', handleUserActivity)
  window.addEventListener('click', handleUserActivity)
  window.addEventListener('keydown', handleUserActivity)
})

onBeforeUnmount(() => {
  // Cleanup
  clearInterval(timerId.value)
  clearTimeout(controlsTimeout)
  
  window.removeEventListener('mousemove', handleUserActivity)
  window.removeEventListener('click', handleUserActivity)
  window.removeEventListener('keydown', handleUserActivity)
})
</script>

<template>
  <div 
    class="video-call-view" 
    :class="{ 'controls-visible': showControls }"
    v-voix="'Video call screen'"
    hint="You are in a 5-minute video speed date">
    
    <!-- Remote Video (Other Person) -->
    <div 
      class="remote-video" 
      :class="{ minimized: isMinimized }"
      v-voix="'Remote video feed'"
      hint="Shows the video of the person you're talking to">
      <!-- Placeholder for remote user's video -->
      <div class="placeholder-video"></div>
    </div>
    
    <!-- Local Video (User's Camera) -->
    <div 
      class="local-video" 
      :class="{ minimized: !isMinimized, 'video-off': isVideoOff }"
      v-voix="'Your video feed'"
      hint="Shows your own video camera feed">
      <!-- Placeholder for local user's video -->
      <div v-if="isVideoOff" class="video-off-indicator">
        <div class="camera-off-icon">🎥</div>
        <div>Camera Off</div>
      </div>
      <div v-else class="placeholder-local-video"></div>
    </div>
    
    <!-- Timer -->
    <div 
      class="timer" 
      :class="{ warning: timerWarning, danger: timerDanger }"
      v-voix="'Timer showing ' + formattedTime"
      hint="Countdown timer for your 5-minute date">
      {{ formattedTime }}
    </div>
    
    <!-- Controls -->
    <div class="controls" :class="{ hidden: !showControls }">
      <button 
        class="control-button" 
        :class="{ active: isMuted }" 
        @click="toggleMute"
        v-voix="isMuted ? 'Unmute audio' : 'Mute audio'"
        :hint="isMuted ? 'Turn your microphone back on' : 'Turn your microphone off'">
        <div class="button-icon">{{ isMuted ? '🔇' : '🔊' }}</div>
        <div class="button-label">{{ isMuted ? 'Unmute' : 'Mute' }}</div>
      </button>
      
      <button 
        class="control-button" 
        :class="{ active: isVideoOff }" 
        @click="toggleVideo"
        v-voix="isVideoOff ? 'Turn video on' : 'Turn video off'"
        :hint="isVideoOff ? 'Turn your camera back on' : 'Turn your camera off'">
        <div class="button-icon">{{ isVideoOff ? '📵' : '📹' }}</div>
        <div class="button-label">{{ isVideoOff ? 'Show Video' : 'Hide Video' }}</div>
      </button>
      
      <button 
        class="control-button end-call" 
        @click="showEndCallDialog"
        v-voix="'End call button'"
        hint="Click to end this video call early">
        <div class="button-icon">📞</div>
        <div class="button-label">End Call</div>
      </button>
      
      <button 
        class="control-button" 
        @click="toggleMinimize"
        v-voix="'Swap video positions'"
        hint="Swap which video is shown larger">
        <div class="button-icon">🔄</div>
        <div class="button-label">Swap</div>
      </button>
    </div>
    
    <!-- End Call Confirmation Dialog -->
    <div v-if="confirmEndDialogVisible" class="dialog-overlay">
      <div 
        class="dialog-box"
        v-voix="'End call confirmation'"
        hint="Confirm if you want to end the call early">
        <h3>End Call?</h3>
        <p>Are you sure you want to end the call early?</p>
        <div class="dialog-buttons">
          <button 
            class="dialog-button cancel" 
            @click="hideEndCallDialog"
            v-voix="'Cancel end call'"
            hint="Continue with the video call">
            Cancel
          </button>
          <button 
            class="dialog-button confirm" 
            @click="endCall"
            v-voix="'Confirm end call'"
            hint="End the call and go to feedback screen">
            End Call
          </button>
        </div>
      </div>
    </div>
    
    <!-- Muted Indicator -->
    <div v-if="isMuted" class="muted-indicator" v-voix="'Microphone is muted'">
      Microphone Muted
    </div>
  </div>
</template>

<style scoped>
.video-call-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  overflow: hidden;
}

.remote-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: all 0.3s ease;
}

.remote-video.minimized {
  width: 30%;
  height: 30%;
  top: 10px;
  right: 10px;
  left: auto;
  z-index: 3;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.local-video {
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 25%;
  max-width: 180px;
  aspect-ratio: 4/3;
  z-index: 2;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.local-video.minimized {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: auto;
  bottom: auto;
  max-width: none;
  border-radius: 0;
  z-index: 1;
}

.placeholder-video {
  width: 100%;
  height: 100%;
  background: linear-gradient(210deg, #2a3a4a, #1a2a3a);
}

.placeholder-local-video {
  width: 100%;
  height: 100%;
  background: linear-gradient(210deg, #4a3a2a, #3a2a1a);
}

.video-off {
  background-color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-off-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #888;
  font-size: 0.8rem;
}

.camera-off-icon {
  font-size: 1.5rem;
  margin-bottom: 5px;
  opacity: 0.5;
}

.timer {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  z-index: 10;
  transition: all 0.3s ease;
}

.timer.warning {
  background-color: rgba(255, 165, 0, 0.8);
}

.timer.danger {
  background-color: rgba(255, 0, 0, 0.8);
  animation: pulse-danger 1s infinite;
}

@keyframes pulse-danger {
  0% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.1);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  border-radius: 12px;
  z-index: 10;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.controls.hidden {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
  pointer-events: none;
}

.control-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  width: 60px;
  transition: all 0.2s ease;
}

.button-icon {
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.button-label {
  font-size: 0.7rem;
  opacity: 0.8;
}

.control-button.active {
  color: #ff4b7d;
}

.control-button.end-call {
  color: #ff4b4b;
}

.control-button.end-call .button-icon {
  transform: rotate(135deg);
}

.control-button:hover {
  transform: scale(1.1);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.dialog-box {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 350px;
  text-align: center;
}

.dialog-box h3 {
  margin-top: 0;
  color: #333;
}

.dialog-box p {
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
  transition: background-color 0.2s;
}

.dialog-button.cancel {
  background-color: #eee;
  color: #333;
  margin-right: 0.5rem;
}

.dialog-button.confirm {
  background-color: #ff4b4b;
  color: white;
  margin-left: 0.5rem;
}

.dialog-button:hover {
  opacity: 0.9;
}

.muted-indicator {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  z-index: 10;
}
</style>