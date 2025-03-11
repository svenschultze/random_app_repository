<script setup>
import { ref } from 'vue';
import { useVoix } from 'vue-voix';
import { VoixLLM } from 'vue-voix';

const voix = useVoix();
const inputText = ref('');
const isLoading = ref(false);

const include_credentials_fetch = (url, options = {}) => {
  return fetch(url, {
    credentials: "include",
    mode: "cors",
    ...options
  });
};

const voixLLM = new VoixLLM({
  apiKey: "-", 
  dangerouslyAllowBrowser: true,
  baseURL: "https://chat.litviva.com/ai/voix/v1",
  fetch: include_credentials_fetch  
});

async function send() {
  if (!inputText.value.trim()) return;
  
  isLoading.value = true;
  try {
    await voixLLM.runTask(inputText.value, voix);
    inputText.value = ''; // Clear input after sending
  } catch (error) {
    console.error('Error sending command:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="voix-input-container">
    <div class="voix-input-wrapper">
      <input 
        type="text" 
        v-model="inputText" 
        @keydown.enter="send" 
        placeholder="Type a command..." 
        :disabled="isLoading"
        class="voix-input"
        hint="Type a command and press Enter to execute"
      />
      <button 
        @click="send" 
        :disabled="isLoading" 
        class="voix-send-btn"
        hint="Send the command"
      >
        <span v-if="isLoading">...</span>
        <span v-else>Send</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.voix-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px;
  z-index: 1000;
}

.voix-input-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
}

.voix-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

.voix-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.voix-send-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.voix-send-btn:hover {
  background-color: var(--primary-dark);
}

.voix-send-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .voix-input-container {
    padding: 12px;
  }
  
  .voix-input {
    padding: 10px 12px;
  }
}
</style>