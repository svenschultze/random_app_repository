<script setup>
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const { annotations } = storeToRefs(bookStore)

// Initialize
onMounted(() => {
  const bookId = route.params.id
  if (bookId) {
    bookStore.selectBook(bookId)
  } else {
    router.push('/')
  }
})

// Computed
const bookAnnotations = computed(() => {
  if (!bookStore.currentBook) return []
  
  return annotations.value.filter(
    annotation => annotation.bookId === bookStore.currentBook.id
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Group annotations by type
const highlightAnnotations = computed(() => 
  bookAnnotations.value.filter(a => a.type === 'highlight')
)

const commentAnnotations = computed(() => 
  bookAnnotations.value.filter(a => a.type === 'comment')
)

// Methods
const navigateToAnnotation = (annotation) => {
  bookStore.goToPage(annotation.page)
  router.push({ 
    name: 'reader', 
    params: { id: bookStore.currentBook.id }
  })
}

const deleteAnnotation = (annotationId) => {
  bookStore.deleteAnnotation(annotationId)
}
</script>

<template>
  <div class="annotations-view">
    <div class="annotations-header">
      <h1 v-voix="'annotations-title'">Annotations</h1>
      <p v-if="bookStore.currentBook">
        for <strong>{{ bookStore.currentBook.title }}</strong> by {{ bookStore.currentBook.author }}
      </p>
      <router-link 
        :to="{ name: 'reader', params: { id: bookStore.currentBook?.id } }" 
        class="back-to-reader"
        v-voix="'back-to-reader'"
      >
        Back to Reading
      </router-link>
    </div>
    
    <div class="tabs">
      <button 
        class="tab-button active" 
        v-voix="'all-annotations-tab'"
      >
        All ({{ bookAnnotations.length }})
      </button>
      <button 
        class="tab-button" 
        v-voix="'highlights-tab'"
      >
        Highlights ({{ highlightAnnotations.length }})
      </button>
      <button 
        class="tab-button" 
        v-voix="'comments-tab'"
      >
        Comments ({{ commentAnnotations.length }})
      </button>
    </div>
    
    <div class="annotations-list">
      <div v-if="bookAnnotations.length === 0" class="no-annotations">
        <p>No annotations found for this book.</p>
        <p>Start reading and highlight text or add comments to create annotations.</p>
      </div>
      
      <div 
        v-for="annotation in bookAnnotations" 
        :key="annotation.id" 
        class="annotation-item"
        :class="annotation.type"
      >
        <div class="annotation-meta">
          <span class="annotation-type">{{ annotation.type === 'highlight' ? 'Highlight' : 'Comment' }}</span>
          <span class="annotation-page">Page {{ annotation.page + 1 }}</span>
          <span class="annotation-user">{{ annotation.userName }}</span>
          <span class="annotation-time">
            {{ new Date(annotation.createdAt).toLocaleDateString() }}
          </span>
        </div>
        
        <div 
          v-if="annotation.type === 'highlight'" 
          class="highlight-text"
          :style="{ backgroundColor: annotation.color }"
        >
          "{{ annotation.text }}"
        </div>
        
        <div v-if="annotation.type === 'comment'" class="comment-content">
          <div class="selected-text">"{{ annotation.text }}"</div>
          <div class="comment-text">{{ annotation.comment }}</div>
        </div>
        
        <div v-if="annotation.replies && annotation.replies.length > 0" class="replies-section">
          <h4>Replies:</h4>
          <div 
            v-for="reply in annotation.replies" 
            :key="reply.id" 
            class="reply-item"
          >
            <div class="reply-header">
              <span class="reply-user">{{ reply.userName }}</span>
              <span class="reply-time">
                {{ new Date(reply.createdAt).toLocaleDateString() }}
              </span>
            </div>
            <div class="reply-text">{{ reply.text }}</div>
          </div>
        </div>
        
        <div class="annotation-actions">
          <button 
            @click="navigateToAnnotation(annotation)" 
            class="action-button"
            v-voix="'go-to-annotation-' + annotation.id"
            :hint="'Navigate to page ' + (annotation.page + 1) + ' to view this annotation in context'"
          >
            Go to Page
          </button>
          <button 
            @click="deleteAnnotation(annotation.id)" 
            class="action-button delete"
            v-voix="'delete-annotation-' + annotation.id"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.annotations-view {
  max-width: 800px;
  margin: 0 auto;
}

.annotations-header {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.annotations-header h1 {
  margin-bottom: 0.5rem;
}

.back-to-reader {
  margin-top: 1rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-to-reader:hover {
  background-color: #1e2b38;
}

.tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.tab-button {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  position: relative;
}

.tab-button.active {
  color: #2c3e50;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #2c3e50;
}

.no-annotations {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.annotation-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.annotation-item.highlight {
  border-left: 4px solid gold;
}

.annotation-item.comment {
  border-left: 4px solid #2c3e50;
}

.annotation-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.annotation-type {
  font-weight: 600;
  color: #2c3e50;
}

.highlight-text {
  font-style: italic;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.comment-content {
  margin-bottom: 1rem;
}

.selected-text {
  font-style: italic;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.comment-text {
  padding: 0.5rem;
  background-color: #f0f7ff;
  border-radius: 4px;
}

.replies-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.replies-section h4 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.reply-item {
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.reply-user {
  font-weight: 600;
}

.reply-time {
  color: #666;
}

.annotation-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.action-button {
  background-color: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.action-button.delete {
  color: #d9534f;
}

.action-button.delete:hover {
  background-color: #ffebee;
}

@media (max-width: 768px) {
  .annotation-meta {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .annotation-actions {
    flex-direction: column;
  }
}
</style>