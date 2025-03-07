<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/store'

// Import components
import AnnotationSidebar from '@/components/AnnotationSidebar.vue'
import HighlightPopover from '@/components/HighlightPopover.vue'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const { currentBook, currentPage, annotations, currentUser } = storeToRefs(bookStore)

// Initialize data
onMounted(() => {
  const bookId = route.params.id
  if (bookId) {
    bookStore.selectBook(bookId)
  } else {
    router.push('/')
  }
})

// States
const showSidebar = ref(true)
const selection = ref(null)
const popoverPosition = ref({ x: 0, y: 0 })
const showPopover = ref(false)
const selectedText = ref('')
const textContainer = ref(null)
const isFullscreen = ref(false)
const isNightMode = ref(false)
const fontSize = ref(18)

// Computed
const displayText = computed(() => {
  if (!currentBook.value || !currentBook.value.content[currentPage.value]) {
    return ''
  }
  return currentBook.value.content[currentPage.value]
})

const pageAnnotations = computed(() => {
  if (!currentBook.value) return []
  
  return annotations.value.filter(
    annotation => annotation.bookId === currentBook.value.id && 
                 annotation.page === currentPage.value
  )
})

const bookProgress = computed(() => {
  if (!currentBook.value) return 0
  return Math.round(((currentPage.value + 1) / currentBook.value.content.length) * 100)
})

const formattedDate = computed(() => {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  return now.toLocaleDateString('en-US', options);
})

// Common tags for the current book
const bookTags = computed(() => {
  if (!currentBook.value) return [];
  return currentBook.value.tags || [];
})

// Reading time estimate
const readingTimeEstimate = computed(() => {
  if (!currentBook.value) return "";
  
  // Rough estimate: average adult reads ~250 words per minute
  const wordsPerPage = 250;
  const totalPages = currentBook.value.content.length;
  const totalMinutes = totalPages * wordsPerPage / 250;
  
  if (totalMinutes < 60) {
    return `~${Math.round(totalMinutes)} min`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `~${hours}h ${minutes}m`;
  }
})

// Methods
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  document.body.classList.toggle('reader-fullscreen', isFullscreen.value)
}

const toggleNightMode = () => {
  isNightMode.value = !isNightMode.value
}

const adjustFontSize = (adjustment) => {
  const newSize = fontSize.value + adjustment
  if (newSize >= 14 && newSize <= 28) {
    fontSize.value = newSize
  }
}

const viewAllAnnotations = () => {
  if (currentBook.value) {
    router.push({ name: 'annotations', params: { id: currentBook.value.id } })
  }
}

const handleTextSelection = () => {
  const windowSelection = window.getSelection()
  
  if (windowSelection.isCollapsed) {
    showPopover.value = false
    return
  }
  
  const range = windowSelection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  
  // Only handle selections inside the text container
  if (!textContainer.value.contains(range.commonAncestorContainer)) {
    return
  }
  
  selectedText.value = windowSelection.toString()
  
  if (selectedText.value.trim().length > 0) {
    popoverPosition.value = {
      x: rect.left + (rect.width / 2),
      y: rect.bottom + window.scrollY + 10
    }
    
    showPopover.value = true
    selection.value = {
      text: selectedText.value,
      position: { start: range.startOffset, end: range.endOffset },
      context: range.startContainer.textContent
    }
  }
}

const addHighlight = (color) => {
  if (!selection.value) return

  const annotation = {
    type: 'highlight',
    text: selection.value.text,
    context: selection.value.context,
    position: selection.value.position,
    color,
    userAvatar: currentUser.value.avatar
  }
  
  bookStore.addAnnotation(annotation)
  resetSelection()
}

const addComment = (text) => {
  if (!selection.value) return
  
  const annotation = {
    type: 'comment',
    text: selection.value.text,
    context: selection.value.context,
    position: selection.value.position,
    comment: text,
    replies: [],
    userAvatar: currentUser.value.avatar
  }
  
  bookStore.addAnnotation(annotation)
  resetSelection()
}

const resetSelection = () => {
  window.getSelection().removeAllRanges()
  selection.value = null
  selectedText.value = ''
  showPopover.value = false
}

const handlePageNavigation = (direction) => {
  if (direction === 'prev') {
    bookStore.previousPage()
  } else {
    bookStore.nextPage()
  }
  resetSelection()
}

// Watch for annotations changes to apply highlights
watch([displayText, pageAnnotations], () => {
  // Defer to the next tick to ensure the DOM is updated
  setTimeout(() => {
    // Applying highlights is a complex DOM manipulation task
    // In a real application, this would be handled more robustly
  }, 0)
})
</script>

<template>
  <div 
    class="reader-view" 
    :class="{ 
      'sidebar-open': showSidebar, 
      'night-mode': isNightMode, 
      'fullscreen-mode': isFullscreen
    }"
  >
    <!-- Book header -->
    <div class="book-header">
      <div class="book-info">
        <button 
          @click="router.push('/')" 
          class="back-button"
          v-voix="'back-to-library-button'"
        >
          <span class="back-icon">←</span>
          <span class="back-text">Library</span>
        </button>
        <div class="title-section">
          <h2 v-if="currentBook" v-voix="'book-title'">{{ currentBook.title }}</h2>
          <p v-if="currentBook" class="book-author">by {{ currentBook.author }}</p>
        </div>
      </div>
      
      <div class="header-controls">
        <div class="reading-options">
          <button 
            @click="adjustFontSize(-2)" 
            class="option-button"
            v-voix="'decrease-font-size'"
            hint="Decrease text size"
          >
            <span>A-</span>
          </button>
          <button 
            @click="adjustFontSize(2)" 
            class="option-button"
            v-voix="'increase-font-size'"
            hint="Increase text size"
          >
            <span>A+</span>
          </button>
          <button 
            @click="toggleNightMode" 
            class="option-button"
            v-voix="'toggle-night-mode'"
            :hint="isNightMode ? 'Switch to day mode' : 'Switch to night mode'"
          >
            <span>{{ isNightMode ? '☀️' : '🌙' }}</span>
          </button>
          <button 
            @click="toggleFullscreen" 
            class="option-button"
            v-voix="'toggle-fullscreen'"
            :hint="isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'"
          >
            <span>{{ isFullscreen ? '⊙' : '⤢' }}</span>
          </button>
        </div>
        
        <button 
          @click="toggleSidebar" 
          class="sidebar-toggle"
          v-voix="'toggle-sidebar'"
          :hint="showSidebar ? 'Hide annotations sidebar' : 'Show annotations sidebar'"
        >
          {{ showSidebar ? 'Hide Notes' : 'Show Notes' }}
        </button>
      </div>
    </div>
    
    <!-- Reading area with navigation -->
    <div class="reader-container">
      <div class="reader-layout">
        <!-- Left sidebar with book details -->
        <div class="book-details-sidebar" v-if="!isFullscreen">
          <div class="book-cover" :style="{ background: currentBook?.coverStyle?.gradient, backgroundImage: currentBook?.coverStyle?.pattern }">
            <span class="book-title-overlay">{{ currentBook?.title }}</span>
          </div>
          
          <div class="book-meta">
            <div class="reading-stats">
              <div class="stat">
                <span class="stat-label">Total Length</span>
                <span class="stat-value">{{ currentBook?.content?.length }} chapters</span>
              </div>
              <div class="stat">
                <span class="stat-label">Est. Reading Time</span>
                <span class="stat-value">{{ readingTimeEstimate }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Your Progress</span>
                <div class="progress-container">
                  <div class="progress-bar">
                    <div class="progress" :style="{ width: `${bookProgress}%` }"></div>
                  </div>
                  <span class="progress-text">{{ bookProgress }}%</span>
                </div>
              </div>
            </div>
            
            <div class="book-tags">
              <span class="tag-heading">Tags:</span>
              <div class="tags-list">
                <span v-for="(tag, index) in bookTags" :key="index" class="book-tag">{{ tag }}</span>
              </div>
            </div>
            
            <div class="annotation-stats">
              <div class="annotation-count">
                <span class="count-icon">💬</span>
                <span class="count-text">{{ pageAnnotations.length }} annotations on this page</span>
              </div>
              <button 
                @click="viewAllAnnotations" 
                class="view-all-notes"
                v-voix="'view-all-annotations'"
              >
                View All Notes
              </button>
            </div>
          </div>
        </div>
        
        <!-- Main content area -->
        <div class="content-area">
          <!-- Navigation buttons -->
          <div class="page-navigation">
            <button 
              @click="handlePageNavigation('prev')" 
              :disabled="currentPage === 0"
              class="nav-button prev"
              v-voix="'prev-page'"
              :hint="'Go to previous page, current page ' + (currentPage + 1) + ' of ' + (currentBook?.content?.length || 1)"
            >
              ← Previous
            </button>
            
            <div class="page-info">
              <span class="current-date">{{ formattedDate }}</span>
              <span class="page-counter" v-voix="'page-counter'">Page {{ currentPage + 1 }} of {{ currentBook?.content?.length }}</span>
            </div>
            
            <button 
              @click="handlePageNavigation('next')" 
              :disabled="!currentBook || currentPage >= currentBook.content.length - 1"
              class="nav-button next"
              v-voix="'next-page'"
              :hint="'Go to next page, current page ' + (currentPage + 1) + ' of ' + (currentBook?.content?.length || 1)"
            >
              Next →
            </button>
          </div>
          
          <!-- Text content area -->
          <div 
            class="text-content" 
            ref="textContainer"
            @mouseup="handleTextSelection"
            @touchend="handleTextSelection"
            :style="{ fontSize: `${fontSize}px` }"
          >
            <p v-if="displayText" v-html="displayText.replace(/\n/g, '<br>')"></p>
            <p v-else class="no-content">No content available for this page.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Annotation sidebar -->
    <AnnotationSidebar 
      v-if="showSidebar" 
      :annotations="pageAnnotations"
      @add-reply="bookStore.addReply"
      v-voix="'annotation-sidebar'"
    />
    
    <!-- Highlight/Comment popover -->
    <HighlightPopover
      v-if="showPopover"
      :position="popoverPosition"
      :selected-text="selectedText"
      @add-highlight="addHighlight"
      @add-comment="addComment"
      @close="resetSelection"
      v-voix="'highlight-popover'"
    />
  </div>
</template>

<style>
/* Define global styles for highlight spans that will be injected into content */
.highlight-span {
  padding: 2px 0;
  border-radius: 2px;
}
</style>

<style scoped>
.reader-view {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: calc(100vh - 4rem);
  position: relative;
  transition: all 0.3s ease;
  background-color: var(--bg-color);
}

.reader-view.sidebar-open {
  grid-template-columns: 1fr 350px;
}

.reader-view.fullscreen-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
}

.reader-view.night-mode {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

.reader-view.night-mode .book-header {
  background-color: #242424;
  border-bottom-color: #333;
}

.reader-view.night-mode .sidebar-toggle {
  background-color: #444;
}

.reader-view.night-mode .option-button {
  background-color: #333;
  color: #e0e0e0;
}

.reader-view.night-mode .nav-button {
  background-color: #333;
  border-color: #444;
  color: #e0e0e0;
}

.reader-view.night-mode .text-content {
  background-color: #242424;
  color: #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.reader-view.night-mode .book-details-sidebar {
  background-color: #1f1f1f;
}

/* Book header */
.book-header {
  grid-column: 1 / -1;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.book-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--primary-color);
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: var(--primary-dark);
}

.back-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.title-section h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.book-author {
  margin: 0.25rem 0 0 0;
  color: var(--text-light);
  font-style: italic;
  font-size: 0.9rem;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.reading-options {
  display: flex;
  gap: 0.5rem;
}

.option-button {
  background-color: #f0f0f0;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.option-button:hover {
  background-color: #e0e0e0;
}

.sidebar-toggle {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.sidebar-toggle:hover {
  background-color: var(--primary-dark);
}

/* Reader container layout */
.reader-container {
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem 2rem;
}

.reader-layout {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.fullscreen-mode .reader-layout {
  grid-template-columns: 1fr;
}

/* Book details sidebar */
.book-details-sidebar {
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  height: fit-content;
}

.book-cover {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.book-title-overlay {
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  padding: 0 1rem;
}

.book-meta {
  padding: 1.25rem;
}

.reading-stats {
  margin-bottom: 1.5rem;
}

.stat {
  margin-bottom: 0.75rem;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: 600;
  font-size: 0.95rem;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex-grow: 1;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 3px;
}

.progress-text {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--primary-color);
  min-width: 36px;
  text-align: right;
}

.book-tags {
  margin-bottom: 1.5rem;
}

.tag-heading {
  display: block;
  font-size: 0.8rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.book-tag {
  background-color: #eef2ff;
  color: var(--primary-color);
  padding: 0.25rem 0.5rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 500;
}

.annotation-stats {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.annotation-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.count-icon {
  font-size: 1.2rem;
}

.count-text {
  font-size: 0.9rem;
}

.view-all-notes {
  width: 100%;
  padding: 0.5rem;
  background-color: #eef2ff;
  color: var(--primary-color);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.view-all-notes:hover {
  background-color: #e0e9ff;
}

/* Content area */
.content-area {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.page-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nav-button {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-button:hover:not(:disabled) {
  background-color: #f5f5f5;
  border-color: #d0d0d0;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.current-date {
  font-size: 0.85rem;
  color: var(--text-light);
}

.page-counter {
  font-weight: 500;
}

.text-content {
  font-size: 18px;
  line-height: 1.7;
  padding: 2.5rem;
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  white-space: pre-wrap;
  min-height: 600px;
}

.no-content {
  color: var(--text-light);
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .reader-layout {
    grid-template-columns: 1fr;
  }
  
  .book-details-sidebar {
    display: none;
  }
  
  .reader-container {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .reader-view.sidebar-open {
    grid-template-columns: 1fr;
  }
  
  .book-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .book-info {
    width: 100%;
  }
  
  .header-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .page-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .page-info {
    order: -1;
    width: 100%;
  }
  
  .text-content {
    padding: 1.5rem;
    min-height: 400px;
  }
}
</style>