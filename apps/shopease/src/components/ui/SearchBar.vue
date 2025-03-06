<script setup>
import { ref, watch } from 'vue';
import IconButton from './IconButton.vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search for products...'
  },
  id: {
    type: String,
    default: 'search-products'
  },
  hint: {
    type: String,
    default: 'Search for products by name, category, or description'
  }
});

const emit = defineEmits(['search', 'clear']);

const searchQuery = ref('');
const searchInput = ref(null);
const showClearButton = ref(false);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value);
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  showClearButton.value = false;
  emit('clear');
  searchInput.value.focus();
};

watch(searchQuery, (newValue) => {
  showClearButton.value = !!newValue.trim();
});
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <div class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <input
        ref="searchInput"
        type="text"
        :placeholder="placeholder"
        v-model="searchQuery"
        @keydown="handleKeyDown"
        v-voix="id"
        :hint="hint"
      />
      <IconButton
        v-if="showClearButton"
        icon='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        label="Clear search"
        color="dark"
        size="sm"
        @click="clearSearch"
        id="clear-search"
        hint="Clear the search field"
      />
    </div>
    <div class="search-button">
      <button 
        class="btn-search" 
        @click="handleSearch"
        v-voix="'search-button'"
        hint="Click to search for products"
      >
        Search
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--color-background-soft, #f5f5f5);
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-bar:focus-within {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
}

.search-icon {
  color: var(--color-text-light, #646464);
  padding: 0 12px;
  display: flex;
  align-items: center;
}

input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 14px 16px 14px 0;
  font-size: 1rem;
  outline: none;
  color: var(--color-text, #2b2b2b);
  width: 100%;
}

.search-button {
  padding-right: 8px;
}

.btn-search {
  background-color: var(--color-primary, #4361ee);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-search:hover {
  background-color: var(--color-primary-dark, #3a56d4);
}

@media (max-width: 640px) {
  .search-bar {
    flex-direction: column;
    border-radius: 8px;
  }
  
  .search-input-wrapper {
    width: 100%;
  }
  
  .search-button {
    width: 100%;
    padding: 0 8px 8px 8px;
  }
  
  .btn-search {
    width: 100%;
  }
}
</style>