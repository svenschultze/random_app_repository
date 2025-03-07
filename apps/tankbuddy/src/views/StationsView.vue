<script setup>
import { ref, computed, onMounted } from 'vue';
import StationCard from '../components/stations/StationCard.vue';
import StationDetails from '../components/stations/StationDetails.vue';
import StationComparison from '../components/stations/StationComparison.vue';
import PriceHistoryChart from '../components/stations/PriceHistoryChart.vue';
import { getStations, getFavoriteStations, getStationById, getStationPriceHistory } from '../services/storageService';

// Stations data
const stations = ref([]);
const searchTerm = ref('');
const sortBy = ref('nameAsc');
const fuelType = ref('unleaded');
const showFavoritesOnly = ref(false);

// Modal/panel states
const selectedStationId = ref(null);
const showDetails = ref(false);
const showPriceHistory = ref(false);
const comparisonStations = ref([]);
const showComparison = ref(false);

// Available sort options
const sortOptions = [
  { value: 'nameAsc', label: 'Name (A-Z)' },
  { value: 'nameDesc', label: 'Name (Z-A)' },
  { value: 'priceAsc', label: 'Price (Low to High)' },
  { value: 'priceDesc', label: 'Price (High to Low)' },
  { value: 'rating', label: 'Rating (High to Low)' }
];

// Available fuel type options
const fuelTypeOptions = [
  { value: 'unleaded', label: 'Unleaded' },
  { value: 'premium', label: 'Premium' },
  { value: 'diesel', label: 'Diesel' }
];

// Filter stations based on search term and favorites
const filteredStations = computed(() => {
  let result = stations.value;
  
  // Filter by favorites if option is enabled
  if (showFavoritesOnly.value) {
    result = result.filter(station => station.favorite);
  }
  
  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(station => {
      return station.name.toLowerCase().includes(term) || 
             station.address.toLowerCase().includes(term);
    });
  }
  
  return result;
});

// Sort stations based on selected sort option
const sortedStations = computed(() => {
  const stationsList = [...filteredStations.value];
  
  switch (sortBy.value) {
    case 'nameAsc':
      return stationsList.sort((a, b) => a.name.localeCompare(b.name));
    case 'nameDesc':
      return stationsList.sort((a, b) => b.name.localeCompare(a.name));
    case 'priceAsc':
      return stationsList.sort((a, b) => a.prices[fuelType.value] - b.prices[fuelType.value]);
    case 'priceDesc':
      return stationsList.sort((a, b) => b.prices[fuelType.value] - a.prices[fuelType.value]);
    case 'rating':
      return stationsList.sort((a, b) => b.rating - a.rating);
    default:
      return stationsList;
  }
});

// Handle station details view
const viewStationDetails = (stationId) => {
  selectedStationId.value = stationId;
  showDetails.value = true;
  showPriceHistory.value = false;
};

// Handle price history view
const viewPriceHistory = (stationId) => {
  selectedStationId.value = stationId;
  showPriceHistory.value = true;
  showDetails.value = false;
};

// Handle adding a station to comparison
const addToComparison = (stationId) => {
  if (!comparisonStations.value.includes(stationId)) {
    comparisonStations.value.push(stationId);
    showComparison.value = true;
  }
};

// Handle removing a station from comparison
const removeFromComparison = (stationId) => {
  comparisonStations.value = comparisonStations.value.filter(id => id !== stationId);
  
  // Close comparison panel if no stations left
  if (comparisonStations.value.length === 0) {
    showComparison.value = false;
  }
};

// Handle refresh stations data (for favorites toggle)
const refreshStations = () => {
  stations.value = getStations();
};

// Toggle favorites only filter
const toggleFavoritesOnly = () => {
  showFavoritesOnly.value = !showFavoritesOnly.value;
};

// Load stations on component mount
onMounted(() => {
  stations.value = getStations();
});
</script>

<template>
  <div class="stations-view">
    <header class="stations-header">
      <div class="header-main">
        <h1 class="page-title">Gas Stations</h1>
        
        <div class="header-actions">
          <button 
            class="btn favorites-btn" 
            :class="{ active: showFavoritesOnly }"
            @click="toggleFavoritesOnly"
            v-voix="showFavoritesOnly ? 'Show all stations' : 'Show favorites only'"
          >
            <span v-if="showFavoritesOnly">Show All</span>
            <span v-else>Show Favorites Only</span>
          </button>
          
          <button 
            class="btn comparison-btn" 
            @click="showComparison = !showComparison"
            :class="{ active: showComparison }"
            v-voix="'Toggle comparison panel'"
            :disabled="comparisonStations.length === 0"
          >
            <span v-if="showComparison">Hide Comparison</span>
            <span v-else>Show Comparison</span>
            <span v-if="comparisonStations.length > 0" class="badge">
              {{ comparisonStations.length }}
            </span>
          </button>
        </div>
      </div>
      
      <div class="filter-options">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Search stations..." 
            class="search-input"
            v-voix="'Search stations input'"
            hint="Search by station name or address"
          >
        </div>
        
        <div class="sort-container">
          <label for="sort-select" class="sort-label">Sort by:</label>
          <select 
            id="sort-select" 
            v-model="sortBy" 
            class="sort-select"
            v-voix="'Sort by dropdown'"
            hint="Choose how to sort the station list"
          >
            <option 
              v-for="option in sortOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <div class="fuel-container">
          <label for="fuel-select" class="fuel-label">Fuel Type:</label>
          <select 
            id="fuel-select" 
            v-model="fuelType" 
            class="fuel-select"
            v-voix="'Fuel type dropdown'"
            hint="Choose which fuel type to compare prices for"
          >
            <option 
              v-for="option in fuelTypeOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </header>
    
    <!-- Station Comparison Panel -->
    <StationComparison 
      v-if="showComparison && comparisonStations.length > 0"
      :station-ids="comparisonStations"
      @close="showComparison = false"
      @remove-station="removeFromComparison"
    />
    
    <!-- Station Details Panel -->
    <StationDetails 
      v-if="showDetails && selectedStationId"
      :station-id="selectedStationId"
      @close="showDetails = false"
    />
    
    <!-- Price History Panel -->
    <div v-if="showPriceHistory && selectedStationId" class="price-history-panel">
      <div class="panel-header">
        <h2 class="panel-title">Price History</h2>
        <button 
          class="close-btn" 
          @click="showPriceHistory = false"
          v-voix="'Close price history'"
        >
          ×
        </button>
      </div>
      
      <div class="panel-content">
        <div class="fuel-type-tabs">
          <button 
            v-for="option in fuelTypeOptions" 
            :key="option.value"
            class="fuel-tab" 
            :class="{ active: fuelType === option.value }"
            @click="fuelType = option.value"
            v-voix="'View ' + option.label + ' price history'"
          >
            {{ option.label }}
          </button>
        </div>
        
        <PriceHistoryChart 
          :price-history="getStationById(selectedStationId)?.priceHistory || []" 
          :fuel-type="fuelType" 
        />
        
        <div class="station-name">
          {{ getStationById(selectedStationId)?.name || 'Station' }}
        </div>
      </div>
    </div>
    
    <!-- Stations Grid -->
    <div v-if="sortedStations.length" class="stations-grid">
      <StationCard 
        v-for="station in sortedStations" 
        :key="station.stationId" 
        :station="station"
        @view-details="viewStationDetails"
        @view-history="viewPriceHistory"
        @compare="addToComparison"
        @favorite-toggled="refreshStations"
      />
    </div>
    
    <div v-else class="no-stations">
      <p v-if="searchTerm">No stations match your search. Try a different term.</p>
      <p v-else-if="showFavoritesOnly">No favorite stations yet. Mark some stations as favorites!</p>
      <p v-else>No stations available. Generate random data from the dashboard.</p>
    </div>
  </div>
</template>

<style scoped>
.stations-view {
  padding: 1.5rem;
}

.stations-header {
  margin-bottom: 2rem;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease-in-out;
}

.btn:hover {
  background-color: #f3f4f6;
}

.btn.active {
  background-color: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.favorites-btn.active {
  background-color: #f59e0b;
  border-color: #f59e0b;
}

.badge {
  background-color: #ef4444;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-container {
  flex: 1;
  min-width: 250px;
}

.search-input {
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 100%;
  outline: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.sort-container, .fuel-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label, .fuel-label {
  font-size: 0.875rem;
  color: #4b5563;
  white-space: nowrap;
}

.sort-select, .fuel-select {
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.sort-select:focus, .fuel-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.stations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.no-stations {
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
  font-style: italic;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.price-history-panel {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  margin-bottom: 2rem;
}

.panel-header {
  padding: 1.5rem;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  font-size: 1.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.panel-content {
  padding: 1.5rem;
}

.fuel-type-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.fuel-tab {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #f9fafb;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.fuel-tab:not(:last-child) {
  border-right: 1px solid #e5e7eb;
}

.fuel-tab.active {
  background-color: #3b82f6;
  color: #ffffff;
}

.station-name {
  text-align: center;
  font-weight: 600;
  color: #1f2937;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .header-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .filter-options {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sort-container, .fuel-container {
    width: 100%;
  }
  
  .sort-select, .fuel-select {
    flex: 1;
  }
}
</style>