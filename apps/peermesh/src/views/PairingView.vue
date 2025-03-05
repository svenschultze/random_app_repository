<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { nanoid } from 'nanoid'
import p2pService from '../services/p2pService'
import { connectionStore } from '../store'
import QrCodeGenerator from '../components/pairing/QrCodeGenerator.vue'
import TokenInput from '../components/pairing/TokenInput.vue'

const router = useRouter()
const route = useRoute()
const connectionMode = ref('create') // create, join
const targetPeerId = ref(nanoid(10))
const connectionToken = ref(null)
const isLoading = ref(false)
const error = ref('')
const success = ref('')

// Check if we have a peerId in the query params (from reconnect)
const peerId = computed(() => route.query.peerId)

onMounted(() => {
  // If peerId is provided in the query, pre-select join mode
  if (peerId.value) {
    targetPeerId.value = peerId.value
    connectionMode.value = 'join'
  }
  
  // Initialize a new token for sharing
  generateToken()
})

// Generate a token for the current user
const generateToken = () => {
  // Generate a new token
  connectionToken.value = p2pService.generateToken()
}

// Handle initiating a connection (creating an offer)
const initializeConnection = () => {
  try {
    // Create a peer connection
    p2pService.initiatePeerConnection(targetPeerId.value)
    
    // Set connection status
    connectionStore.getState().setConnectionStatus('connecting')
    
    success.value = 'Connection initialized. Share your token or QR code with your contact.'
  } catch (err) {
    error.value = 'Error creating connection: ' + err.message
  }
}

// Handle accepting a connection from a token
const connectWithToken = async (token) => {
  isLoading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // Accept the connection
    p2pService.acceptConnection(token)
    
    // Set success message
    success.value = 'Connecting to peer...'
    
    // After successful connection, redirect to chat
    // We'll wait a bit for the connection to establish
    setTimeout(() => {
      const connections = connectionStore.getState().connections
      
      if (connections[token.id] && connections[token.id].connected) {
        // Navigate to the chat view
        router.push(`/chat/${token.id}`)
      }
      
      isLoading.value = false
    }, 2000)
  } catch (err) {
    error.value = 'Error connecting: ' + err.message
    isLoading.value = false
  }
}

// Toggle between create and join modes
const toggleMode = (mode) => {
  connectionMode.value = mode
  error.value = ''
  success.value = ''
}

// Go back to dashboard
const goBack = () => {
  router.push('/dashboard')
}

// Handle token copied
const handleTokenCopied = () => {
  success.value = 'Token copied to clipboard!'
}
</script>

<template>
  <div class="pairing-view">
    <header class="pairing-header">
      <button 
        class="back-button" 
        @click="goBack"
        v-voix="'back-button'"
        hint="Return to dashboard"
      >
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      
      <h1 class="title" v-voix="'pairing-title'">Connect with Others</h1>
    </header>
    
    <div class="pairing-container">
      <div class="mode-selector">
        <button 
          class="mode-button" 
          :class="{ active: connectionMode === 'create' }" 
          @click="toggleMode('create')"
          v-voix="'create-connection-button'"
          hint="Generate a token to share with others"
        >
          <span class="material-symbols-outlined">share</span>
          <span>Share Your Token</span>
        </button>
        
        <button 
          class="mode-button" 
          :class="{ active: connectionMode === 'join' }" 
          @click="toggleMode('join')"
          v-voix="'join-connection-button'"
          hint="Enter someone else's token to connect"
        >
          <span class="material-symbols-outlined">link</span>
          <span>Join Connection</span>
        </button>
      </div>
      
      <div v-if="error" class="alert error" v-voix="'connection-error-message'">
        {{ error }}
      </div>
      
      <div v-if="success" class="alert success" v-voix="'connection-success-message'">
        {{ success }}
      </div>
      
      <div class="pairing-content">
        <!-- Create Connection Mode -->
        <div v-if="connectionMode === 'create'" class="create-mode">
          <p class="instructions">
            Generate a connection token and share it with the person you want to connect with
          </p>
          
          <button 
            class="btn-primary initialize-button" 
            @click="initializeConnection"
            v-voix="'initialize-connection-button'"
            hint="Generate connection details for sharing"
          >
            <span class="material-symbols-outlined">wifi_tethering</span>
            <span>Initialize Connection</span>
          </button>
          
          <div v-if="connectionToken" class="token-section">
            <QrCodeGenerator 
              :token="connectionToken" 
              @token-copied="handleTokenCopied"
            />
          </div>
        </div>
        
        <!-- Join Connection Mode -->
        <div v-else-if="connectionMode === 'join'" class="join-mode">
          <p class="instructions">
            Enter the connection token shared by your contact
          </p>
          
          <TokenInput 
            :isLoading="isLoading"
            @connect="connectWithToken"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pairing-view {
  padding: 1rem;
}

.pairing-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background-color: var(--light-bg);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.pairing-container {
  max-width: 600px;
  margin: 0 auto;
}

.mode-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.mode-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: white;
  border: 2px solid transparent;
  border-radius: var(--border-radius);
  transition: border-color 0.2s, transform 0.2s;
  cursor: pointer;
}

.mode-button.active {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.mode-button .material-symbols-outlined {
  font-size: 2rem;
  color: var(--primary-color);
}

.alert {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
}

.error {
  background-color: #fee2e2;
  color: #b91c1c;
}

.success {
  background-color: #d1fae5;
  color: #047857;
}

.pairing-content {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.instructions {
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
}

.initialize-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto 2rem;
  padding: 0.75rem 1.5rem;
}

.token-section {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .pairing-view {
    padding: 2rem;
  }
  
  .mode-button {
    flex-direction: row;
    justify-content: center;
  }
}
</style>