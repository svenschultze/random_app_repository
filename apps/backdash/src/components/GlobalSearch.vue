<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import mockDataStore from '@/store/mockDataStore';

const router = useRouter();
const searchQuery = ref('');
const isSearchOpen = ref(false);
const searchResults = ref([]);
const selectedIndex = ref(-1);
const searchInput = ref(null);

// Get all services
const services = computed(() => {
  if (!mockDataStore.state.data || !mockDataStore.state.data.services) {
    return [];
  }
  return Object.values(mockDataStore.state.data.services);
});

// Search through available items
const performSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  const results = [];
  
  // Search services
  if (services.value) {
    services.value.forEach(service => {
      if (service.name.toLowerCase().includes(query)) {
        results.push({
          type: 'service',
          id: service.id,
          name: service.name,
          description: `${service.status} - ${service.uptime}`,
          icon: '🔧'
        });
      }
      
      // Search routes in service
      if (service.routes) {
        service.routes.forEach(route => {
          if (route.path.toLowerCase().includes(query)) {
            results.push({
              type: 'route',
              id: service.id,
              serviceId: service.id,
              name: route.path,
              description: `Route in ${service.name}`,
              icon: '🔗'
            });
          }
        });
      }
    });
  }
  
  // Add special pages
  if ('dashboard'.includes(query) || 'home'.includes(query) || 'overview'.includes(query)) {
    results.push({
      type: 'page',
      route: { name: 'home' },
      name: 'Dashboard',
      description: 'Main dashboard overview',
      icon: '📊'
    });
  }
  
  if ('logs'.includes(query) || 'log'.includes(query)) {
    results.push({
      type: 'page',
      route: { name: 'logs' },
      name: 'Logs',
      description: 'System logs viewer',
      icon: '📝'
    });
  }
  
  if ('insights'.includes(query) || 'insight'.includes(query) || 'alerts'.includes(query)) {
    results.push({
      type: 'page',
      route: { name: 'insights' },
      name: 'Insights',
      description: 'System insights and alerts',
      icon: '💡'
    });
  }
  
  if ('about'.includes(query) || 'info'.includes(query) || 'information'.includes(query)) {
    results.push({
      type: 'page',
      route: { name: 'about' },
      name: 'About',
      description: 'Information about BackDash',
      icon: 'ℹ️'
    });
  }
  
  searchResults.value = results;
  selectedIndex.value = results.length > 0 ? 0 : -1;
};

// Handle selection
const handleSelect = (result) => {
  if (!result) return;
  
  switch (result.type) {
    case 'service':
      router.push({ name: 'service-detail', params: { id: result.id } });
      break;
    case 'route':
      router.push({ name: 'service-detail', params: { id: result.serviceId } });
      break;
    case 'page':
      router.push(result.route);
      break;
  }
  
  closeSearch();
};

// Handle navigation with keyboard
const handleKeydown = (e) => {
  // Global shortcut to open search: Ctrl/Cmd + K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
    return;
  }
  
  if (!isSearchOpen.value) return;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
      break;
    case 'Enter':
      e.preventDefault();
      if (selectedIndex.value >= 0 && selectedIndex.value < searchResults.value.length) {
        handleSelect(searchResults.value[selectedIndex.value]);
      }
      break;
    case 'Escape':
      e.preventDefault();
      closeSearch();
      break;
  }
};

// Open search modal
const openSearch = () => {
  isSearchOpen.value = true;
  // Focus the input after the modal is open
  setTimeout(() => {
    if (searchInput.value) {
      searchInput.value.focus();
    }
  }, 100);
};

// Close search modal
const closeSearch = () => {
  isSearchOpen.value = false;
  searchQuery.value = '';
  searchResults.value = [];
  selectedIndex.value = -1;
};

// Watch for search query changes
watch(searchQuery, performSearch);

// Set up event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

// Clean up
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="global-search">
    <!-- Search trigger button -->
    <button 
      v-voix="'open-search-button'"
      hint="Press to search or use Ctrl+K shortcut"
      @click="openSearch" 
      class="flex items-center text-gray-400 hover:text-white"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
      <span class="ml-1 hidden md:inline-block">Search (Ctrl+K)</span>
    </button>
    
    <!-- Search modal -->
    <div v-if="isSearchOpen" class="search-modal-overlay" @click="closeSearch">
      <div class="search-modal" @click.stop>
        <div class="search-input-container">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input
            v-voix="'search-input'" 
            ref="searchInput"
            v-model="searchQuery"
            type="text" 
            class="search-input"
            placeholder="Search for services, routes, or pages..."
            @keydown.esc="closeSearch"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-button">
            ✕
          </button>
        </div>
        
        <div v-if="searchResults.length > 0" class="search-results">
          <div 
            v-for="(result, index) in searchResults" 
            :key="index"
            class="search-result-item"
            :class="{ 'selected': index === selectedIndex }"
            @click="handleSelect(result)"
            @mouseover="selectedIndex = index"
          >
            <div class="result-icon">{{ result.icon }}</div>
            <div class="result-content">
              <div class="result-name">{{ result.name }}</div>
              <div class="result-description">{{ result.description }}</div>
            </div>
          </div>
        </div>
        
        <div v-else-if="searchQuery && !searchResults.length" class="no-results">
          No results found for "{{ searchQuery }}"
        </div>
        
        <div v-else class="search-help">
          <p>Try searching for:</p>
          <ul>
            <li>Service names (e.g., "user-service")</li>
            <li>API routes (e.g., "/users")</li>
            <li>Pages (e.g., "logs", "insights")</li>
          </ul>
        </div>
        
        <div class="search-footer">
          <span>Navigate: <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Select: <kbd>Enter</kbd></span>
          <span>Close: <kbd>Esc</kbd></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5rem;
  z-index: 50;
}

.search-modal {
  width: 100%;
  max-width: 36rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  max-height: calc(100vh - 10rem);
  display: flex;
  flex-direction: column;
}

.search-input-container {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
}

.clear-button {
  color: #6b7280;
  cursor: pointer;
}

.search-results {
  overflow-y: auto;
  max-height: 20rem;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.search-result-item:hover,
.search-result-item.selected {
  background-color: #f3f4f6;
}

.result-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  width: 1.5rem;
  text-align: center;
}

.result-content {
  flex: 1;
}

.result-name {
  font-weight: 500;
}

.result-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.no-results,
.search-help {
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
}

.search-help ul {
  list-style: disc;
  text-align: left;
  margin-left: 2rem;
  margin-top: 0.5rem;
}

.search-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
  border-top: 1px solid #e5e7eb;
}

kbd {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
}
</style>