<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import ThreadItem from '../components/ThreadItem.vue';
import store from '../store';
import { searchThreads } from '../services/mockData';

const router = useRouter();
const searchQuery = ref('');
const activeTab = ref('trending');
const isSearching = ref(false);

const trendingTopics = computed(() => {
  return store.state.mockData.trendingTopics;
});

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return [];
  
  return searchThreads(
    store.state.mockData.threads,
    store.state.mockData.users,
    searchQuery.value
  );
});

const isLoading = computed(() => store.state.isRefreshing);

function setActiveTab(tab) {
  activeTab.value = tab;
}

function handleSearch() {
  isSearching.value = true;
  // Reset after short delay
  setTimeout(() => {
    isSearching.value = false;
  }, 300);
}

function handleTopicClick(topic) {
  searchQuery.value = topic.name;
  handleSearch();
  setActiveTab('latest');
}
</script>

<template>
  <AppLayout>
    <div class="explore-view">
      <div class="explore-view__header">
        <h1 v-voix="'Explore'">Explore</h1>
      </div>
      
      <div class="explore-view__search">
        <div class="explore-view__search-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Threadly"
            class="explore-view__search-input"
            @keyup.enter="handleSearch"
            v-voix="'Search input'"
            hint="Type keywords and press Enter to search"
          />
        </div>
      </div>
      
      <div v-if="isLoading || isSearching" class="explore-view__loading">
        <div class="explore-view__loading-spinner"></div>
        <p>{{ isSearching ? 'Searching...' : 'Loading...' }}</p>
      </div>
      
      <div v-else-if="searchQuery && searchResults.length === 0" class="explore-view__no-results">
        <p>No results found for "{{ searchQuery }}"</p>
        <button 
          class="explore-view__clear-search" 
          @click="searchQuery = ''"
          v-voix="'Clear search'"
        >
          Clear search
        </button>
      </div>
      
      <div v-else-if="searchQuery" class="explore-view__search-results">
        <div class="explore-view__section-title">
          <h2>Search results for "{{ searchQuery }}"</h2>
        </div>
        
        <ThreadItem 
          v-for="thread in searchResults" 
          :key="thread.id" 
          :thread="thread"
        />
      </div>
      
      <div v-else>
        <div class="explore-view__tabs">
          <button 
            :class="['explore-view__tab', { 'explore-view__tab--active': activeTab === 'trending' }]" 
            @click="setActiveTab('trending')"
            v-voix="'Trending tab'"
          >
            Trending
          </button>
          <button 
            :class="['explore-view__tab', { 'explore-view__tab--active': activeTab === 'latest' }]" 
            @click="setActiveTab('latest')"
            v-voix="'Latest tab'"
          >
            Latest
          </button>
        </div>
        
        <div v-if="activeTab === 'trending'" class="explore-view__trending">
          <div class="explore-view__trending-list">
            <div 
              v-for="topic in trendingTopics" 
              :key="topic.id" 
              class="explore-view__trending-item"
              @click="handleTopicClick(topic)"
              v-voix="'Trending topic: ' + topic.name"
            >
              <div class="explore-view__trending-name">{{ topic.name }}</div>
              <div class="explore-view__trending-count">{{ topic.postCount }} posts</div>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'latest'" class="explore-view__latest">
          <div class="explore-view__section-title">
            <h2>Latest Threads</h2>
          </div>
          
          <ThreadItem 
            v-for="thread in store.state.mockData.threads.filter(t => !t.parentId).slice(0, 10)" 
            :key="thread.id" 
            :thread="thread"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.explore-view {
  width: 100%;
}

.explore-view__header {
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.explore-view__header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.explore-view__search {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.explore-view__search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--color-background-soft);
  border-radius: 9999px;
  padding: 0.75rem 1rem;
}

.explore-view__search-input-wrapper svg {
  color: var(--color-text-muted);
  margin-right: 0.75rem;
}

.explore-view__search-input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 1rem;
}

.explore-view__search-input:focus {
  outline: none;
}

.explore-view__tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.explore-view__tab {
  flex: 1;
  text-align: center;
  padding: 1rem;
  background: none;
  border: none;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.explore-view__tab--active {
  color: var(--color-text);
}

.explore-view__tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #1da1f2;
  border-radius: 4px 4px 0 0;
}

.explore-view__loading,
.explore-view__no-results {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

.explore-view__loading-spinner {
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

.explore-view__clear-search {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
}

.explore-view__section-title {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.explore-view__section-title h2 {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0;
}

.explore-view__trending-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

@media (min-width: 640px) {
  .explore-view__trending-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

.explore-view__trending-item {
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.explore-view__trending-item:hover {
  background-color: var(--color-background-mute);
}

.explore-view__trending-name {
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.explore-view__trending-count {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

/* For dark mode */
:root[data-theme="dark"] .explore-view__header {
  background-color: rgba(21, 32, 43, 0.9);
}

:root[data-theme="dark"] .explore-view__trending-item {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .explore-view__trending-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>