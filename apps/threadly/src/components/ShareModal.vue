<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  thread: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

// Get the current URL and append the thread ID to create a shareable link
const shareableLink = ref('');

onMounted(() => {
  if (window) {
    // Create a URL for sharing - in a real app this would be an actual URL
    // Here we're simulating it with the current base URL + the thread path
    const baseUrl = window.location.origin;
    shareableLink.value = `${baseUrl}/thread/${props.thread.id}`;
  }
});

function handleClose() {
  emit('close');
}

const copyStatus = ref('');

function copyToClipboard() {
  // Use the browser's clipboard API
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareableLink.value)
      .then(() => {
        copyStatus.value = 'Copied!';
        
        // Reset status after 2 seconds
        setTimeout(() => {
          copyStatus.value = '';
        }, 2000);
      })
      .catch(() => {
        copyStatus.value = 'Failed to copy';
      });
  }
}

function simulateShare(platform) {
  // In a real app, this would integrate with actual share APIs
  // For this demo, we'll just simulate the sharing with a status message
  copyStatus.value = `Shared to ${platform}!`;
  
  // Reset status after 2 seconds
  setTimeout(() => {
    copyStatus.value = '';
    handleClose();
  }, 1500);
}
</script>

<template>
  <div v-if="isOpen" class="share-modal">
    <div class="share-modal__backdrop" @click="handleClose"></div>
    
    <div 
      class="share-modal__content"
      v-voix="'Share thread dialog'"
    >
      <div class="share-modal__header">
        <h2 v-voix="'Share this thread'">Share this thread</h2>
        <button 
          class="share-modal__close-btn" 
          @click="handleClose"
          v-voix="'Close share dialog'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="share-modal__body">
        <div class="share-modal__options">
          <button 
            class="share-modal__option share-modal__option--twitter" 
            @click="simulateShare('Twitter')"
            v-voix="'Share to Twitter'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1DA1F2">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
            <span>Twitter</span>
          </button>
          
          <button 
            class="share-modal__option share-modal__option--facebook" 
            @click="simulateShare('Facebook')"
            v-voix="'Share to Facebook'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            <span>Facebook</span>
          </button>
          
          <button 
            class="share-modal__option share-modal__option--linkedin" 
            @click="simulateShare('LinkedIn')"
            v-voix="'Share to LinkedIn'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            <span>LinkedIn</span>
          </button>
          
          <button 
            class="share-modal__option share-modal__option--email" 
            @click="simulateShare('Email')"
            v-voix="'Share via Email'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#EA4335" stroke="#EA4335" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Email</span>
          </button>
        </div>
        
        <div class="share-modal__link-section">
          <p class="share-modal__link-title">Or copy link:</p>
          <div class="share-modal__copy-wrapper">
            <input 
              type="text" 
              :value="shareableLink" 
              readonly 
              class="share-modal__link-input"
              v-voix="'Shareable link'"
              hint="This is a read-only link to this thread"
            />
            <button 
              class="share-modal__copy-btn" 
              @click="copyToClipboard"
              v-voix="'Copy link'"
              hint="Click to copy the link to your clipboard"
            >
              <template v-if="!copyStatus">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy</span>
              </template>
              <span v-else>{{ copyStatus }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-modal__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.share-modal__content {
  position: relative;
  width: 100%;
  max-width: 500px;
  background-color: var(--color-background);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  animation: modal-slide-up 0.3s ease;
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.share-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.share-modal__header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
}

.share-modal__close-btn {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.share-modal__close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.share-modal__body {
  padding: 1.5rem;
}

.share-modal__options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.share-modal__option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--color-background-soft);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.share-modal__option:hover {
  background-color: var(--color-background-mute);
}

.share-modal__option svg {
  margin-bottom: 0.5rem;
}

.share-modal__option span {
  font-weight: 600;
  font-size: 0.9rem;
}

.share-modal__link-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.share-modal__copy-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.share-modal__link-input {
  flex-grow: 1;
  padding: 0.75rem;
  border: none;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
}

.share-modal__link-input:focus {
  outline: none;
}

.share-modal__copy-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--color-background-soft);
  border: none;
  border-left: 1px solid var(--color-border);
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.share-modal__copy-btn:hover {
  background-color: var(--color-background-mute);
}

.share-modal__copy-btn svg {
  margin-right: 0.5rem;
}

/* For dark mode */
:root[data-theme="dark"] .share-modal__close-btn:hover,
:root[data-theme="dark"] .share-modal__option:hover,
:root[data-theme="dark"] .share-modal__copy-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>