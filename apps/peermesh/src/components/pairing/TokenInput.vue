<script setup>
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['connect'])
const tokenInput = ref('')
const error = ref('')

const connectWithToken = () => {
  if (!tokenInput.value.trim()) {
    error.value = 'Please enter a connection token'
    return
  }
  
  try {
    // Try to parse the token
    const parsedToken = JSON.parse(tokenInput.value)
    
    // Validate token format
    if (!parsedToken.id || !parsedToken.type) {
      error.value = 'Invalid token format'
      return
    }
    
    // Emit the token to parent
    emit('connect', parsedToken)
    error.value = ''
  } catch (err) {
    error.value = 'Invalid token: ' + err.message
  }
}
</script>

<template>
  <div class="token-input-container">
    <label 
      for="token" 
      class="input-label"
      v-voix="'token-input-label'"
    >
      Enter Connection Token
    </label>
    
    <div class="input-with-button">
      <input 
        id="token" 
        v-model="tokenInput" 
        type="text" 
        placeholder="Paste connection token here..." 
        class="token-input"
        :disabled="isLoading"
        v-voix="'connection-token-input'"
        hint="Paste a connection token from another user"
      />
      
      <button 
        class="connect-button btn-primary" 
        @click="connectWithToken"
        :disabled="isLoading || !tokenInput.trim()"
        v-voix="'connect-with-token-button'"
        hint="Connect using the pasted token"
      >
        <span v-if="isLoading">Connecting...</span>
        <span v-else>Connect</span>
      </button>
    </div>
    
    <div v-if="error" class="error-message" v-voix="'token-error-message'">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.token-input-container {
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 500px;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.token-input {
  flex: 1;
}

.connect-button {
  white-space: nowrap;
}

.error-message {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--error-color);
}
</style>