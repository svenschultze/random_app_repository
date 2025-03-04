<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const liked = ref(null) // true, false, or null
const additionalFeedback = ref('')
const isSubmitting = ref(false)
const matchStatus = ref('pending') // 'pending', 'matched', 'not_matched'
const showMatchDialog = ref(false)

function selectLiked(value) {
  liked.value = value
}

function submitFeedback() {
  if (liked.value === null) return

  isSubmitting.value = true
  
  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false
    
    // Simulate match result (50% chance for testing)
    if (liked.value && Math.random() > 0.5) {
      matchStatus.value = 'matched'
      showMatchDialog.value = true
    } else {
      matchStatus.value = 'not_matched'
      
      // If no match, go back to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
  }, 1000)
}

function goToChat() {
  // This would normally navigate to a chat with the specific match
  // For now, we'll just go to a mock chat with ID 1
  router.push('/chat/1')
}

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="feedback-view">
    <div class="feedback-container">
      <!-- Header -->
      <header>
        <h1 v-voix="'Feedback page title'">How was your speed date?</h1>
        <p v-voix="'Feedback page subtitle'">Would you like to connect with this person?</p>
      </header>
      
      <!-- Main Feedback Selection -->
      <div class="feedback-options">
        <button 
          class="feedback-option" 
          :class="{ selected: liked === true }" 
          @click="selectLiked(true)"
          v-voix="'Yes I would like to connect'"
          hint="Select if you're interested in connecting with this person">
          <div class="feedback-icon yes">👍</div>
          <div class="feedback-label">Yes</div>
        </button>
        
        <button 
          class="feedback-option" 
          :class="{ selected: liked === false }" 
          @click="selectLiked(false)"
          v-voix="'No I would not like to connect'"
          hint="Select if you're not interested in connecting with this person">
          <div class="feedback-icon no">👎</div>
          <div class="feedback-label">No</div>
        </button>
      </div>
      
      <!-- Additional Feedback Textarea -->
      <div class="additional-feedback">
        <label for="feedback-text" v-voix="'Additional feedback label'">Additional Feedback (optional):</label>
        <textarea 
          id="feedback-text" 
          v-model="additionalFeedback" 
          placeholder="Share what went well or how we could improve your experience..."
          rows="3"
          v-voix="'Additional feedback input'"
          hint="Type any additional comments about your experience">
        </textarea>
      </div>
      
      <!-- Submit Button -->
      <button 
        class="submit-button" 
        :disabled="liked === null || isSubmitting" 
        @click="submitFeedback"
        v-voix="'Submit feedback button'"
        hint="Click to submit your feedback">
        <span v-if="isSubmitting">Submitting...</span>
        <span v-else>Submit Feedback</span>
      </button>
      
      <!-- Thank You Message for No Match Result -->
      <div 
        v-if="matchStatus === 'not_matched' && !showMatchDialog" 
        class="thank-you-message"
        v-voix="'Thank you for feedback message'"
        hint="Your feedback has been submitted">
        <div class="message-icon">✓</div>
        <h2>Thank you for your feedback!</h2>
        <p>Returning to dashboard...</p>
      </div>
    </div>
    
    <!-- Match Dialog -->
    <div v-if="showMatchDialog" class="match-dialog-overlay">
      <div 
        class="match-dialog"
        v-voix="'Match confirmed message'"
        hint="You both liked each other and are now matched">
        <div class="match-icon">❤️</div>
        <h2>It's a Match!</h2>
        <p>You both expressed interest in each other!</p>
        
        <div class="match-actions">
          <button 
            class="match-action-button primary" 
            @click="goToChat"
            v-voix="'Start chatting button'"
            hint="Begin chatting with your new match">
            Start Chatting
          </button>
          
          <button 
            class="match-action-button secondary" 
            @click="goToDashboard"
            v-voix="'Go to dashboard button'"
            hint="Return to the main dashboard">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feedback-view {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.feedback-container {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.6rem;
  color: #333;
  margin-bottom: 0.5rem;
}

header p {
  color: #666;
  font-size: 1.1rem;
}

.feedback-options {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
}

.feedback-option {
  background: none;
  border: 2px solid #eee;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  width: 45%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feedback-option:hover {
  border-color: #ddd;
  transform: translateY(-3px);
}

.feedback-option.selected {
  border-color: #ff4b7d;
  box-shadow: 0 4px 12px rgba(255, 75, 125, 0.2);
}

.feedback-option.selected .feedback-icon {
  transform: scale(1.2);
}

.feedback-icon {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  transition: transform 0.3s ease;
}

.feedback-label {
  font-size: 1.1rem;
  font-weight: 500;
}

.additional-feedback {
  margin-bottom: 2rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.95rem;
}

textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
}

textarea:focus {
  border-color: #ff4b7d;
  outline: none;
}

.submit-button {
  background-color: #ff4b7d;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #ff3367;
}

.submit-button:disabled {
  background-color: #ffb1c6;
  cursor: not-allowed;
}

.thank-you-message {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.message-icon {
  background-color: #4cd964;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.thank-you-message h2 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.thank-you-message p {
  color: #666;
}

/* Match Dialog */
.match-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.5s;
}

.match-dialog {
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.match-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: pulse 0.8s infinite alternate;
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.2);
  }
}

.match-dialog h2 {
  font-size: 1.8rem;
  color: #ff4b7d;
  margin-bottom: 0.8rem;
}

.match-dialog p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.match-actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.match-action-button {
  padding: 0.9rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.match-action-button.primary {
  background-color: #ff4b7d;
  color: white;
}

.match-action-button.primary:hover {
  background-color: #ff3367;
}

.match-action-button.secondary {
  background-color: #f0f0f0;
  color: #555;
}

.match-action-button.secondary:hover {
  background-color: #e6e6e6;
}

@media (min-width: 600px) {
  .match-actions {
    flex-direction: row;
  }
  
  .match-action-button {
    flex: 1;
  }
}
</style>