<script setup>
import { defineProps, defineEmits, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/store'

const props = defineProps({
  position: {
    type: Object,
    required: true
  },
  selectedText: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['add-highlight', 'add-comment', 'close'])

const bookStore = useBookStore()
const { currentUser } = storeToRefs(bookStore)

const showCommentForm = ref(false)
const commentText = ref('')

const highlightColors = [
  '#FFEB3B', // Yellow
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FF9800', // Orange
  '#E91E63'  // Pink
]

// Compute truncated text for display
const truncatedText = computed(() => {
  const maxLength = 60
  if (props.selectedText.length <= maxLength) {
    return props.selectedText
  }
  return props.selectedText.substring(0, maxLength) + '...'
})

const handleHighlight = (color) => {
  emit('add-highlight', color)
}

const toggleCommentForm = () => {
  showCommentForm.value = !showCommentForm.value
}

const submitComment = () => {
  if (!commentText.value.trim()) return
  emit('add-comment', commentText.value)
  commentText.value = ''
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.highlight-popover')) {
    emit('close')
  }
}

// Listen for clicks outside the popover
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div 
    class="highlight-popover" 
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
  >
    <div class="popover-header">
      <div class="selected-text-preview">{{ truncatedText }}</div>
    </div>

    <div v-if="!showCommentForm" class="popover-content">
      <h4 class="popover-title">Highlight options</h4>
      <div class="highlight-options">
        <button 
          v-for="(color, index) in highlightColors" 
          :key="index"
          @click="handleHighlight(color)"
          class="color-button"
          :style="{ backgroundColor: color }"
          v-voix="'highlight-color-' + index"
          :hint="`Highlight selected text with color ${index + 1}`"
        ></button>
      </div>
      
      <div class="divider">
        <span>or</span>
      </div>
      
      <button 
        @click="toggleCommentForm" 
        class="comment-button"
        v-voix="'add-comment-button'"
      >
        <span class="comment-icon">💬</span>
        Add Comment
      </button>
    </div>
    
    <div v-else class="comment-form">
      <div class="form-header">
        <div class="user-info">
          <img :src="currentUser.avatar" :alt="currentUser.name" class="user-avatar" />
          <span class="user-name">{{ currentUser.name }}</span>
        </div>
      </div>
      
      <textarea 
        v-model="commentText" 
        placeholder="Add your comment..." 
        class="comment-input"
        v-voix="'comment-text-input'"
        autoFocus
      ></textarea>
      
      <div class="form-actions">
        <button 
          @click="toggleCommentForm" 
          class="cancel-button"
          v-voix="'cancel-comment'"
        >
          Cancel
        </button>
        <button 
          @click="submitComment" 
          class="submit-button"
          :disabled="!commentText.trim()"
          v-voix="'submit-comment'"
        >
          Save Comment
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.highlight-popover {
  position: absolute;
  z-index: 100;
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 0;
  transform: translateX(-50%);
  width: 320px;
  overflow: hidden;
}

.highlight-popover::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 16px;
  height: 16px;
  background-color: var(--card-bg);
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.05);
}

.popover-header {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.selected-text-preview {
  font-style: italic;
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.4;
}

.popover-content {
  padding: 1rem;
}

.popover-title {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-color);
}

.highlight-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.color-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-button:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.divider {
  display: flex;
  align-items: center;
  margin: 1rem 0;
  color: var(--text-light);
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  padding: 0 0.75rem;
}

.comment-button {
  width: 100%;
  padding: 0.6rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.comment-button:hover {
  background-color: var(--primary-dark);
}

.comment-icon {
  font-size: 1.1rem;
}

.comment-form {
  padding: 1rem;
}

.form-header {
  margin-bottom: 0.75rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.comment-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  background-color: var(--card-bg);
}

.comment-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(75, 108, 183, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.cancel-button, .submit-button {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.cancel-button:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>