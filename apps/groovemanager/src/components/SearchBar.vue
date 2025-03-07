<script setup>
import { ref } from 'vue'
import { useLibraryStore } from '../stores/library'

const libraryStore = useLibraryStore()

const updateSearch = (event) => {
  libraryStore.searchQuery = event.target.value
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-container">
      <span class="search-icon">🔍</span>
      <input
        v-voix="'search-input'"
        type="text"
        placeholder="Search for tracks, albums, or artists..."
        class="search-input"
        :value="libraryStore.searchQuery"
        @input="updateSearch"
        aria-label="Search for tracks, albums, or artists"
      />
      <button 
        v-if="libraryStore.searchQuery"
        v-voix="'clear-search-button'"
        class="clear-button"
        @click="libraryStore.searchQuery = ''"
        aria-label="Clear search"
      >
        ×
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  padding: 16px 24px;
}

.search-input-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border-radius: 24px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.search-input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.15);
}

.search-input::placeholder {
  color: #888;
}

.clear-button {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.clear-button:hover {
  color: #fff;
}
</style>