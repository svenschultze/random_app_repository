<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const error = ref(null)
const recentSearches = ref([
  { id: 1, name: 'New York, NY', temp: 68, icon: 'cloud' },
  { id: 2, name: 'Los Angeles, CA', temp: 75, icon: 'sun' },
  { id: 3, name: 'Chicago, IL', temp: 62, icon: 'rain' }
])

// Helper function to generate a random id
const generateRandomId = () => {
  return Math.floor(1000 + Math.random() * 9000);
}

// List of countries for random results
const countries = [
  'United States', 'Canada', 'United Kingdom', 'France', 'Germany', 
  'Italy', 'Spain', 'Australia', 'Japan', 'Brazil', 'Mexico', 
  'Sweden', 'Norway', 'Denmark', 'Finland', 'Netherlands'
];

// List of state/province abbreviations
const regions = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE'
];

// Mock search function
const searchLocations = () => {
  if (!searchQuery.value.trim()) {
    return
  }
  
  searching.value = true
  error.value = null
  
  // Simulate API request
  setTimeout(() => {
    const query = searchQuery.value.toLowerCase()
    
    // Predefined mock results
    if (query.includes('new york') || query.includes('ny')) {
      searchResults.value = [
        { id: 101, name: 'New York, NY', country: 'United States' },
        { id: 102, name: 'New York Mills, NY', country: 'United States' }
      ]
    } else if (query.includes('london')) {
      searchResults.value = [
        { id: 201, name: 'London, UK', country: 'United Kingdom' },
        { id: 202, name: 'London, ON', country: 'Canada' }
      ]
    } else if (query.includes('san')) {
      searchResults.value = [
        { id: 301, name: 'San Francisco, CA', country: 'United States' },
        { id: 302, name: 'San Diego, CA', country: 'United States' },
        { id: 303, name: 'San Jose, CA', country: 'United States' }
      ]
    } else if (query.includes('paris')) {
      searchResults.value = [
        { id: 401, name: 'Paris, France', country: 'France' },
        { id: 402, name: 'Paris, TX', country: 'United States' }
      ]
    } else {
      // Generate random mock results for any other search
      const numResults = Math.floor(1 + Math.random() * 4); // 1-4 results
      const results = [];
      
      // Main result - Capitalized query + random region
      const mainLocation = {
        id: generateRandomId(),
        name: `${query.charAt(0).toUpperCase() + query.slice(1)}, ${regions[Math.floor(Math.random() * regions.length)]}`,
        country: 'United States'
      };
      results.push(mainLocation);
      
      // Add variations for larger result sets
      for (let i = 1; i < numResults; i++) {
        const country = countries[Math.floor(Math.random() * countries.length)];
        const variation = {
          id: generateRandomId(),
          name: `${query.charAt(0).toUpperCase() + query.slice(1)}${i === 1 ? ' City' : i === 2 ? ' Village' : ' Township'}`,
          country: country
        };
        results.push(variation);
      }
      
      searchResults.value = results;
    }
    
    searching.value = false
  }, 800)
}

const selectLocation = (locationId) => {
  // Find the location object
  let selectedLocation;
  if (searchResults.value.length > 0) {
    selectedLocation = searchResults.value.find(loc => loc.id === locationId);
  } else {
    selectedLocation = recentSearches.value.find(loc => loc.id === locationId);
  }
  
  if (selectedLocation) {
    // In a real app, we would add to recent searches in localStorage
    // For this demo, we'll just navigate to details with location name as query param
    router.push({
      path: `/details/${locationId}`,
      query: { name: selectedLocation.name }
    });
  } else {
    // If not found for some reason, just navigate with ID
    router.push(`/details/${locationId}`);
  }
}

// Weather icons mapping 
const getWeatherIcon = (iconCode) => {
  const icons = {
    'sun': '☀️',
    'cloud': '⛅',
    'rain': '🌧️',
    'snow': '❄️',
    'thunder': '⚡',
    'fog': '🌫️'
  }
  return icons[iconCode] || '☀️'
}
</script>

<template>
  <div class="search-container">
    <h1 class="search-title" v-voix="'search locations'">Search Locations</h1>
    
    <div class="search-box">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by city name or zip code"
        class="search-input"
        v-voix="'location search input'"
        hint="Type a city name or postal code to search for weather"
        @keyup.enter="searchLocations"
      />
      <button 
        class="search-button" 
        @click="searchLocations"
        v-voix="'search button'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
    
    <!-- Search Results -->
    <div class="results-container" v-if="searching || searchResults.length > 0">
      <h2 class="section-title" v-voix="'search results'">Search Results</h2>
      
      <div v-if="searching" class="loading-message" v-voix="'searching'">
        Searching...
      </div>
      
      <div v-else-if="searchResults.length === 0" class="no-results" v-voix="'no search results'">
        No results found for "{{ searchQuery }}". Try another search term.
      </div>
      
      <ul v-else class="search-results-list">
        <li 
          v-for="result in searchResults" 
          :key="result.id" 
          class="result-item"
          @click="selectLocation(result.id)"
          v-voix="'search result ' + result.name"
        >
          <div class="result-name">{{ result.name }}</div>
          <div class="result-country">{{ result.country }}</div>
        </li>
      </ul>
    </div>
    
    <!-- Recent Searches -->
    <div class="recent-searches" v-if="recentSearches.length > 0" v-voix="'recent searches'">
      <h2 class="section-title">Recent Searches</h2>
      
      <ul class="recent-list">
        <li 
          v-for="location in recentSearches" 
          :key="location.id" 
          class="recent-item"
          @click="selectLocation(location.id)"
          v-voix="'recent location ' + location.name"
        >
          <div class="recent-info">
            <div class="recent-name">{{ location.name }}</div>
          </div>
          <div class="recent-weather">
            <span class="recent-temp">{{ location.temp }}°</span>
            <span class="recent-icon">{{ getWeatherIcon(location.icon) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.search-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  margin-bottom: 2rem;
  position: relative;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.search-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--secondary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.results-container {
  margin-bottom: 2rem;
}

.loading-message {
  text-align: center;
  padding: 1rem;
  color: var(--light-text);
}

.no-results {
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: var(--shadow);
  color: var(--light-text);
}

.search-results-list, .recent-list {
  list-style: none;
  padding: 0;
}

.result-item, .recent-item {
  background-color: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s;
}

.result-item:hover, .recent-item:hover {
  transform: translateY(-2px);
}

.result-name, .recent-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.result-country {
  color: var(--light-text);
  font-size: 0.9rem;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-weather {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recent-temp {
  font-weight: 600;
  font-size: 1.1rem;
}

.recent-icon {
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .search-container {
    padding: 2rem;
  }
  
  .search-title {
    font-size: 1.8rem;
  }
  
  .search-input {
    padding: 1rem 1.25rem;
  }
}
</style>