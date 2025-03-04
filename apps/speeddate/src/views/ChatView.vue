<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const matchId = computed(() => route.params.id)

// Message input
const newMessage = ref('')
const chatContainer = ref(null)
const showOptions = ref(false)

// Mock data for matched user
const matchedUser = ref({
  id: 1,
  name: 'Sarah',
  age: 28,
  lastActive: '10 minutes ago',
  bio: 'Love hiking, cooking, and photography',
  matchDate: '2 days ago'
})

// Mock chat history
const messages = ref([
  {
    id: 1,
    senderId: 1, // Matched user (Sarah)
    text: 'Hey! It was great talking with you during our speed date 😊',
    timestamp: '2 days ago'
  },
  {
    id: 2,
    senderId: 'me', // Current user
    text: 'Thanks! I really enjoyed our conversation too. Especially when you talked about your trip to Japan.',
    timestamp: '2 days ago'
  },
  {
    id: 3,
    senderId: 1,
    text: 'Yes! Japan was amazing. We should definitely talk more about travel sometime. What other places have you visited?',
    timestamp: '2 days ago'
  },
  {
    id: 4,
    senderId: 'me',
    text: "I've been to Italy, Spain, and Canada most recently. But Japan is definitely on my bucket list!",
    timestamp: '1 day ago'
  },
  {
    id: 5,
    senderId: 1,
    text: 'Italy is one of my favorites too! I loved the food there 🍕',
    timestamp: '1 day ago'
  }
])

const suggestedResponses = [
  'What was your favorite part of your trip to Japan?',
  'Would you like to grab coffee sometime?',
  'What other hobbies are you into?'
]

function sendMessage() {
  // Don't send empty messages
  if (newMessage.value.trim() === '') return
  
  // Add the new message to the chat
  messages.value.push({
    id: messages.value.length + 1,
    senderId: 'me',
    text: newMessage.value,
    timestamp: 'Just now'
  })
  
  // Clear the input
  newMessage.value = ''
  
  // Auto-scroll to bottom
  scrollToBottom()
  
  // Simulate a response after a delay
  setTimeout(() => {
    messages.value.push({
      id: messages.value.length + 1,
      senderId: matchedUser.value.id,
      text: 'That sounds great! Looking forward to chatting more soon.',
      timestamp: 'Just now'
    })
    
    scrollToBottom()
  }, 2000)
}

function sendSuggestedResponse(response) {
  newMessage.value = response
  sendMessage()
  showOptions.value = false
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

function goBack() {
  router.push('/matches')
}

function toggleOptions() {
  showOptions.value = !showOptions.value
}

function scheduleVideoCall() {
  // In a real app, this would open a scheduling dialog
  alert('Video call scheduling feature would appear here')
  showOptions.value = false
}

function goToProfile() {
  // In a real app, this would navigate to the user's profile
  alert(`View ${matchedUser.value.name}'s profile`)
  showOptions.value = false
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat-view">
    <!-- Chat Header -->
    <header class="chat-header">
      <button 
        class="back-button" 
        @click="goBack"
        v-voix="'Back to matches'"
        hint="Return to your matches list">
        ←
      </button>
      
      <div 
        class="chat-user-info"
        v-voix="'Chatting with ' + matchedUser.name">
        <div class="user-photo">
          {{ matchedUser.name.charAt(0) }}
        </div>
        <div class="user-details">
          <div class="user-name">{{ matchedUser.name }}, {{ matchedUser.age }}</div>
          <div class="user-status">{{ matchedUser.lastActive }}</div>
        </div>
      </div>
      
      <button 
        class="options-button" 
        @click="toggleOptions"
        v-voix="'Chat options'"
        hint="Access additional chat options">
        •••
      </button>
      
      <!-- Options Menu -->
      <div v-if="showOptions" class="options-menu">
        <button 
          class="option-item" 
          @click="scheduleVideoCall"
          v-voix="'Schedule video call option'"
          hint="Set up a longer video call">
          <span class="option-icon">📹</span>
          Schedule Video Call
        </button>
        
        <button 
          class="option-item" 
          @click="goToProfile"
          v-voix="'View profile option'"
          hint="See this person's full profile">
          <span class="option-icon">👤</span>
          View Profile
        </button>
      </div>
    </header>
    
    <!-- Chat Messages -->
    <div class="chat-messages" ref="chatContainer">
      <div class="match-info">
        <div class="match-icon">❤️</div>
        <div 
          class="match-text"
          v-voix="'Match info'">
          You matched with {{ matchedUser.name }} {{ matchedUser.matchDate }}
        </div>
      </div>
      
      <div 
        v-for="message in messages" 
        :key="message.id" 
        :class="['message', { 'outgoing': message.senderId === 'me', 'incoming': message.senderId !== 'me' }]"
        v-voix="message.senderId === 'me' ? 'Your message: ' + message.text : matchedUser.name + ': ' + message.text">
        <div class="message-content">{{ message.text }}</div>
        <div class="message-time">{{ message.timestamp }}</div>
      </div>
    </div>
    
    <!-- Suggested Responses -->
    <div class="suggested-responses" v-if="messages.length > 0">
      <button 
        v-for="(response, index) in suggestedResponses" 
        :key="index" 
        class="suggested-response" 
        @click="sendSuggestedResponse(response)"
        v-voix="'Suggested response: ' + response"
        hint="Click to send this pre-written response">
        {{ response }}
      </button>
    </div>
    
    <!-- Chat Input -->
    <div class="chat-input">
      <textarea 
        v-model="newMessage" 
        placeholder="Type a message..." 
        @keypress.enter.prevent="sendMessage"
        v-voix="'Message input'"
        hint="Type your message here and press enter to send">
      </textarea>
      
      <button 
        class="send-button" 
        @click="sendMessage" 
        :disabled="!newMessage.trim()"
        v-voix="'Send message button'"
        hint="Click to send your message">
        Send
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.back-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #555;
  cursor: pointer;
  padding: 0.3rem 0.8rem;
  margin-right: 0.5rem;
}

.chat-user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.user-photo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff4b7d, #ff7eb3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-right: 0.8rem;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}

.user-status {
  font-size: 0.8rem;
  color: #777;
}

.options-button {
  background: none;
  border: none;
  color: #555;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0.5rem;
}

.options-menu {
  position: absolute;
  top: 100%;
  right: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  width: 200px;
  overflow: hidden;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.option-item:hover {
  background-color: #f5f5f5;
}

.option-icon {
  margin-right: 0.8rem;
  font-size: 1.2rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.match-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem;
}

.match-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.match-text {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

.message {
  max-width: 80%;
  margin-bottom: 1rem;
  align-self: flex-start;
}

.message-content {
  padding: 0.8rem 1rem;
  border-radius: 18px;
  font-size: 0.95rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.3rem;
  padding: 0 0.5rem;
}

.outgoing {
  align-self: flex-end;
}

.outgoing .message-content {
  background-color: #ff4b7d;
  color: white;
  border-bottom-right-radius: 4px;
}

.outgoing .message-time {
  text-align: right;
}

.incoming .message-content {
  background-color: white;
  color: #333;
  border-bottom-left-radius: 4px;
}

.suggested-responses {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  overflow-x: auto;
  background-color: #f0f0f0;
}

.suggested-response {
  white-space: nowrap;
  padding: 0.6rem 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}

.suggested-response:hover {
  background-color: #f8f8f8;
}

.chat-input {
  display: flex;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #eee;
}

textarea {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  resize: none;
  height: 50px;
  max-height: 100px;
}

textarea:focus {
  outline: none;
  border-color: #ff4b7d;
}

.send-button {
  margin-left: 0.8rem;
  background-color: #ff4b7d;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 1.5rem;
  font-weight: 600;
  cursor: pointer;
}

.send-button:disabled {
  background-color: #ffb1c6;
  cursor: not-allowed;
}
</style>