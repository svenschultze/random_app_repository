<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/store'

const props = defineProps({
  annotations: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add-reply'])

const bookStore = useBookStore()
const { currentUser } = storeToRefs(bookStore)

const replyText = ref('')
const activeReply = ref(null)
const sortOption = ref('newest') // 'newest', 'oldest', 'type'

// Filtered and sorted annotations
const sortedAnnotations = computed(() => {
  let result = [...props.annotations]
  
  // Sort based on selected option
  if (sortOption.value === 'newest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortOption.value === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } else if (sortOption.value === 'type') {
    result.sort((a, b) => a.type.localeCompare(b.type))
  }
  
  return result
})

// Format date to relative time (e.g. "2h ago")
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  if (seconds < 60) {
    return 'just now'
  }
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}m ago`
  }
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }
  
  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days}d ago`
  }
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const openReply = (annotationId) => {
  activeReply.value = annotationId
  replyText.value = ''
}

const cancelReply = () => {
  activeReply.value = null
  replyText.value = ''
}

const submitReply = (annotationId) => {
  if (!replyText.value.trim()) return
  
  emit('add-reply', annotationId, replyText.value)
  replyText.value = ''
  activeReply.value = null
}
</script>

<template>
  <aside class="annotation-sidebar">
    <div class="sidebar-header">
      <h3 v-voix="'annotations-heading'">Notes & Highlights</h3>
      
      <div class="sorting-controls">
        <select 
          v-model="sortOption" 
          class="sort-selector"
          v-voix="'sort-annotations'"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="type">By Type</option>
        </select>
      </div>
    </div>
    
    <div v-if="annotations.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <p>No annotations on this page yet</p>
      <p class="empty-help">Select text to add highlights or comments</p>
    </div>
    
    <div v-else class="annotation-list">
      <div 
        v-for="annotation in sortedAnnotations" 
        :key="annotation.id" 
        class="annotation-item"
        :class="annotation.type"
      >
        <div class="annotation-meta">
          <div class="user-info">
            <img 
              v-if="annotation.userAvatar" 
              :src="annotation.userAvatar" 
              :alt="annotation.userName" 
              class="user-avatar"
            />
            <span class="annotation-user">{{ annotation.userName }}</span>
          </div>
          
          <div class="annotation-badges">
            <span class="annotation-type-badge" :class="annotation.type">
              {{ annotation.type === 'highlight' ? 'Highlight' : 'Comment' }}
            </span>
            <span class="annotation-time" :title="new Date(annotation.createdAt).toLocaleString()">
              {{ formatRelativeTime(annotation.createdAt) }}
            </span>
          </div>
        </div>
        
        <div v-if="annotation.type === 'highlight'" 
          class="highlight-content" 
          :style="{ backgroundColor: annotation.color }"
        >
          "{{ annotation.text }}"
        </div>
        
        <div v-if="annotation.type === 'comment'" class="comment-content">
          <div class="selected-text">"{{ annotation.text }}"</div>
          <div class="comment-text">{{ annotation.comment }}</div>
        </div>
        
        <!-- Replies -->
        <div v-if="annotation.replies && annotation.replies.length > 0" class="replies">
          <div 
            v-for="reply in annotation.replies" 
            :key="reply.id" 
            class="reply"
          >
            <div class="reply-meta">
              <div class="reply-user-info">
                <img 
                  v-if="reply.userAvatar" 
                  :src="reply.userAvatar" 
                  :alt="reply.userName" 
                  class="reply-avatar"
                />
                <span class="reply-user">{{ reply.userName }}</span>
              </div>
              <span class="reply-time" :title="new Date(reply.createdAt).toLocaleString()">
                {{ formatRelativeTime(reply.createdAt) }}
              </span>
            </div>
            <div class="reply-content">{{ reply.text }}</div>
          </div>
        </div>
        
        <!-- Reply form -->
        <div class="annotation-actions">
          <button 
            v-if="activeReply !== annotation.id" 
            @click="openReply(annotation.id)" 
            class="reply-button"
            v-voix="'reply-to-' + annotation.id"
          >
            <span class="reply-icon">💬</span> Reply
          </button>
          
          <div v-else class="reply-form">
            <div class="reply-form-header">
              <div class="current-user-info">
                <img :src="currentUser.avatar" :alt="currentUser.name" class="user-avatar" />
                <span class="current-user-name">{{ currentUser.name }}</span>
              </div>
            </div>
            
            <textarea 
              v-model="replyText" 
              placeholder="Write a reply..."
              class="reply-input"
              v-voix="'reply-text-' + annotation.id"
            ></textarea>
            
            <div class="reply-actions">
              <button 
                @click="cancelReply" 
                class="cancel-button"
                v-voix="'cancel-reply-' + annotation.id"
              >
                Cancel
              </button>
              <button 
                @click="submitReply(annotation.id)" 
                class="submit-button"
                :disabled="!replyText.trim()"
                v-voix="'submit-reply-' + annotation.id"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.annotation-sidebar {
  background-color: var(--bg-color);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-color);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background-color: var(--bg-color);
  z-index: 5;
}

h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.sorting-controls {
  display: flex;
  align-items: center;
}

.sort-selector {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--card-bg);
  cursor: pointer;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  text-align: center;
  padding: 4rem 2rem;
  flex-grow: 1;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-help {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

.annotation-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.annotation-item {
  padding: 1.25rem;
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.annotation-item:hover {
  box-shadow: var(--shadow-md);
}

.annotation-item.highlight {
  border-left: 3px solid #FFEB3B;
}

.annotation-item.comment {
  border-left: 3px solid var(--primary-color);
}

.annotation-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar, .reply-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.annotation-user {
  font-weight: 600;
}

.annotation-badges {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.annotation-type-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 99px;
  font-weight: 500;
}

.annotation-type-badge.highlight {
  background-color: rgba(255, 235, 59, 0.2);
  color: #f57c00;
}

.annotation-type-badge.comment {
  background-color: rgba(75, 108, 183, 0.1);
  color: var(--primary-color);
}

.annotation-time {
  color: var(--text-light);
  font-size: 0.8rem;
}

.highlight-content {
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  font-style: italic;
  margin-bottom: 0.75rem;
}

.comment-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.selected-text {
  font-style: italic;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: var(--radius-sm);
  color: var(--text-light);
}

.comment-text {
  padding: 0.75rem;
  background-color: rgba(75, 108, 183, 0.05);
  border-radius: var(--radius-sm);
  line-height: 1.5;
}

.replies {
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-left: 2px solid var(--border-color);
  padding-left: 1rem;
}

.reply {
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
}

.reply-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.reply-user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reply-user {
  font-weight: 600;
}

.reply-content {
  line-height: 1.5;
}

.annotation-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
}

.reply-button {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s ease;
}

.reply-button:hover {
  background-color: rgba(75, 108, 183, 0.05);
}

.reply-icon {
  font-size: 1rem;
}

.reply-form {
  width: 100%;
  margin-top: 0.5rem;
}

.reply-form-header {
  margin-bottom: 0.75rem;
}

.current-user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.current-user-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.reply-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  background-color: var(--card-bg);
}

.reply-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(75, 108, 183, 0.1);
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.cancel-button, .submit-button {
  padding: 0.5rem 0.9rem;
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