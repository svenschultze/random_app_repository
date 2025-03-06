<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import QRCode from 'qrcode.vue'

const props = defineProps({
  token: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['tokenCopied'])
const tokenString = ref('')
const copySuccess = ref(false)
const copyTimeout = ref(null)

onMounted(() => {
  // Convert token to JSON string
  tokenString.value = JSON.stringify(props.token)
})

const copyTokenToClipboard = () => {
  navigator.clipboard.writeText(tokenString.value)
    .then(() => {
      copySuccess.value = true
      
      // Clear previous timeout if exists
      if (copyTimeout.value) {
        clearTimeout(copyTimeout.value)
      }
      
      // Reset after 2 seconds
      copyTimeout.value = setTimeout(() => {
        copySuccess.value = false
      }, 2000)
      
      emit('tokenCopied')
    })
    .catch(err => {
      console.error('Failed to copy: ', err)
    })
}
</script>

<template>
  <div class="qr-generator">
    <div class="qr-code-container">
      <QRCode 
        :value="tokenString" 
        :size="200" 
        :margin="2"
        :color="'#111827'" 
        :background="'#ffffff'"
        class="qr-code"
      />
    </div>
    
    <p class="instructions">
      Scan this QR code with your contact's PeerMesh app or copy the token below
    </p>
    
    <div class="token-container">
      <div class="token-text">{{ tokenString.substring(0, 20) }}...</div>
      
      <button 
        class="copy-button" 
        @click="copyTokenToClipboard"
        v-voix="'copy-token-button'"
        hint="Copy connection token to clipboard"
      >
        <span v-if="!copySuccess" class="material-symbols-outlined">content_copy</span>
        <span v-else class="material-symbols-outlined check">check</span>
        <span>{{ copySuccess ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.qr-generator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-code-container {
  background-color: white;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.qr-code {
  display: block;
}

.instructions {
  text-align: center;
  margin-bottom: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.token-container {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-bottom: 1rem;
}

.token-text {
  flex: 1;
  padding: 0.75rem 1rem;
  font-family: monospace;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background-color: var(--light-bg);
  border: none;
  border-left: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.copy-button:hover {
  background-color: #e5e7eb;
}

.copy-button .material-symbols-outlined {
  font-size: 1rem;
}

.copy-button .check {
  color: var(--success-color);
}
</style>