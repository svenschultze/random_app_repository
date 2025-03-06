<script setup>
import { computed, ref, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import ThreadItem from '../components/ThreadItem.vue';
import ComposeInput from '../components/ComposeInput.vue';
import store from '../store';

const sortedThreads = computed(() => {
  // Get only top-level threads (not replies)
  const mainThreads = store.state.mockData.threads.filter(t => !t.parentId);
  // Sort by timestamp (newest first)
  return mainThreads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

const isLoading = computed(() => store.state.isRefreshing);

// For infinite scroll
const displayCount = ref(10);
const loadingMore = ref(false);

function loadMore() {
  if (loadingMore.value || displayCount.value >= sortedThreads.value.length) return;
  
  loadingMore.value = true;
  setTimeout(() => {
    displayCount.value += 5;
    loadingMore.value = false;
  }, 500);
}

// Handle scroll
function handleScroll() {
  const scrollPosition = window.innerHeight + window.scrollY;
  const bodyHeight = document.body.offsetHeight;
  
  if (scrollPosition >= bodyHeight - 500 && !loadingMore.value) {
    loadMore();
  }
}

// Setup scroll listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

function handleNewThread(thread) {
  // Scroll to top to see the new thread
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
  <AppLayout>
    <div class="home-view">
      <div class="home-view__header">
        <h1 v-voix="'Home feed'">Home</h1>
      </div>
      
      <div class="home-view__compose">
        <ComposeInput @submit="handleNewThread" />
      </div>
      
      <div v-if="isLoading" class="home-view__loading">
        <div class="home-view__loading-spinner"></div>
        <p>Refreshing feed...</p>
      </div>
      
      <div v-else class="home-view__threads">
        <ThreadItem 
          v-for="thread in sortedThreads.slice(0, displayCount)" 
          :key="thread.id" 
          :thread="thread" 
        />
        
        <div v-if="loadingMore" class="home-view__loading-more">
          <div class="home-view__loading-spinner"></div>
          <p>Loading more...</p>
        </div>
        
        <div v-if="displayCount >= sortedThreads.length && sortedThreads.length > 0" class="home-view__end">
          <p>You've reached the end of your feed!</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.home-view {
  width: 100%;
}

.home-view__header {
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  z-index: 10;
}

.home-view__header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.home-view__compose {
  border-bottom: 1px solid var(--color-border);
}

.home-view__loading,
.home-view__loading-more,
.home-view__end {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

.home-view__loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(29, 161, 242, 0.2);
  border-radius: 50%;
  border-top-color: #1da1f2;
  margin: 0 auto 1rem;
  animation: spinner 1s linear infinite;
}

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* For dark mode */
:root[data-theme="dark"] .home-view__header {
  background-color: rgba(21, 32, 43, 0.9);
}
</style>
