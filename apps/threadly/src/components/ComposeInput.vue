<script setup>
import { ref, computed } from 'vue';
import store from '../store';

const props = defineProps({
  placeholder: {
    type: String,
    default: "What's happening?"
  },
  parentId: {
    type: String,
    default: null
  },
  autoFocus: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel']);

const text = ref(store.state.composeText);
const showActions = computed(() => text.value.trim().length > 0);
const inputRef = ref(null);

function submitThread() {
  if (!text.value.trim()) return;

  if (props.parentId) {
    // Add reply
    const newReply = store.addReply(props.parentId, text.value);
    if (newReply) {
      text.value = '';
      store.clearComposeText();
      emit('submit', newReply);
    }
  } else {
    // Add new thread
    const newThread = store.addThread(text.value);
    if (newThread) {
      text.value = '';
      store.clearComposeText();
      emit('submit', newThread);
    }
  }
}

function cancelCompose() {
  text.value = '';
  store.clearComposeText();
  emit('cancel');
}

function updateText(e) {
  text.value = e.target.value;
  store.setComposeText(text.value);
}

function handleKeydown(e) {
  // Submit on Ctrl+Enter or Command+Enter
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    submitThread();
  }
}
</script>

<template>
  <div class="compose-input">
    <div class="compose-input__avatar">
      <img 
        :src="store.state.mockData.currentUser.avatar" 
        :alt="store.state.mockData.currentUser.username"
        v-voix="'Your profile avatar'"
      />
    </div>
    
    <div class="compose-input__content">
      <textarea
        ref="inputRef"
        v-model="text"
        :placeholder="placeholder"
        class="compose-input__textarea"
        @input="updateText"
        @keydown="handleKeydown"
        v-voix="'Compose new thread text input'"
        hint="Type your message here. Use Ctrl+Enter to submit"
      ></textarea>
      
      <div v-if="showActions" class="compose-input__actions">
        <button 
          class="compose-input__cancel-btn" 
          @click="cancelCompose"
          v-voix="'Cancel'"
        >
          Cancel
        </button>
        <button 
          class="compose-input__submit-btn" 
          @click="submitThread"
          v-voix="parentId ? 'Reply' : 'Post'"
        >
          {{ parentId ? 'Reply' : 'Post' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compose-input {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.compose-input__avatar {
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.compose-input__avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.compose-input__content {
  flex-grow: 1;
}

.compose-input__textarea {
  width: 100%;
  min-height: 80px;
  border: none;
  resize: none;
  font-size: 1.1rem;
  font-family: inherit;
  padding: 0.5rem 0;
  background: transparent;
  color: var(--color-text);
}

.compose-input__textarea:focus {
  outline: none;
}

.compose-input__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.compose-input__cancel-btn,
.compose-input__submit-btn {
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.compose-input__cancel-btn {
  background: transparent;
  color: var(--color-text-muted);
  margin-right: 0.5rem;
}

.compose-input__cancel-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.compose-input__submit-btn {
  background-color: #1da1f2;
  color: white;
}

.compose-input__submit-btn:hover {
  background-color: #1a91da;
}
</style>