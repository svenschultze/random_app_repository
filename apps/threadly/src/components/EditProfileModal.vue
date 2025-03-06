<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import store from '../store';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

const displayName = ref('');
const username = ref('');
const bio = ref('');

// Initialize form values when modal opens
onMounted(() => {
  if (props.user) {
    displayName.value = props.user.displayName;
    username.value = props.user.username;
    bio.value = props.user.bio;
  }
});

// Watch for user changes
watch(() => props.user, (newUser) => {
  if (newUser) {
    displayName.value = newUser.displayName;
    username.value = newUser.username;
    bio.value = newUser.bio;
  }
}, { immediate: true });

function handleClose() {
  emit('close');
}

function handleSave() {
  // Validation
  if (!displayName.value.trim()) {
    return;
  }
  
  const updatedUser = {
    ...props.user,
    displayName: displayName.value.trim(),
    username: username.value.trim(),
    bio: bio.value.trim()
  };
  
  emit('save', updatedUser);
}

const bioLength = computed(() => bio.value ? bio.value.length : 0);
const maxBioLength = 160;
const remainingChars = computed(() => maxBioLength - bioLength.value);
</script>

<template>
  <div v-if="isOpen" class="edit-profile-modal">
    <div class="edit-profile-modal__backdrop" @click="handleClose"></div>
    
    <div 
      class="edit-profile-modal__content"
      v-voix="'Edit profile dialog'"
    >
      <div class="edit-profile-modal__header">
        <button 
          class="edit-profile-modal__close-btn" 
          @click="handleClose"
          v-voix="'Close edit profile'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 v-voix="'Edit profile'">Edit profile</h2>
        <button 
          class="edit-profile-modal__save-btn" 
          @click="handleSave"
          v-voix="'Save changes'"
        >
          Save
        </button>
      </div>
      
      <div class="edit-profile-modal__form">
        <div class="edit-profile-modal__form-group">
          <label 
            for="displayName" 
            class="edit-profile-modal__label"
            v-voix="'Display name field'"
          >
            Name
          </label>
          <input 
            id="displayName" 
            v-model="displayName" 
            type="text" 
            class="edit-profile-modal__input" 
            maxlength="50"
            v-voix="'Display name input'"
            hint="Enter your display name as shown on your profile"
          />
        </div>
        
        <div class="edit-profile-modal__form-group">
          <label 
            for="username" 
            class="edit-profile-modal__label"
            v-voix="'Username field'"
          >
            Username
          </label>
          <div class="edit-profile-modal__username-input-wrapper">
            <span class="edit-profile-modal__username-prefix">@</span>
            <input 
              id="username" 
              v-model="username" 
              type="text" 
              class="edit-profile-modal__input edit-profile-modal__username-input" 
              maxlength="15"
              v-voix="'Username input'"
              hint="Enter your username without the @ symbol"
            />
          </div>
        </div>
        
        <div class="edit-profile-modal__form-group">
          <label 
            for="bio" 
            class="edit-profile-modal__label"
            v-voix="'Bio field'"
          >
            Bio
          </label>
          <textarea 
            id="bio" 
            v-model="bio" 
            class="edit-profile-modal__textarea" 
            :maxlength="maxBioLength"
            v-voix="'Bio input'"
            hint="Enter a short bio about yourself"
          ></textarea>
          <div class="edit-profile-modal__char-count">
            <span :class="{ 'edit-profile-modal__char-count--limit': remainingChars < 20 }">
              {{ remainingChars }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-profile-modal {
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

.edit-profile-modal__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.edit-profile-modal__content {
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  background-color: var(--color-background);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  overflow-y: auto;
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

.edit-profile-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.edit-profile-modal__header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
}

.edit-profile-modal__close-btn {
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

.edit-profile-modal__close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.edit-profile-modal__save-btn {
  background-color: var(--color-text);
  color: var(--color-background);
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-profile-modal__save-btn:hover {
  opacity: 0.9;
}

.edit-profile-modal__form {
  padding: 1rem;
}

.edit-profile-modal__form-group {
  margin-bottom: 1.5rem;
}

.edit-profile-modal__label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.edit-profile-modal__input,
.edit-profile-modal__textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.edit-profile-modal__input:focus,
.edit-profile-modal__textarea:focus {
  outline: none;
  border-color: #1da1f2;
}

.edit-profile-modal__username-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
}

.edit-profile-modal__username-prefix {
  padding: 0 0.75rem;
  color: var(--color-text-muted);
}

.edit-profile-modal__username-input {
  border: none;
  padding-left: 0;
}

.edit-profile-modal__textarea {
  min-height: 100px;
  resize: vertical;
}

.edit-profile-modal__char-count {
  margin-top: 0.5rem;
  text-align: right;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.edit-profile-modal__char-count--limit {
  color: #e0245e;
}

/* For dark mode */
:root[data-theme="dark"] .edit-profile-modal__close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>