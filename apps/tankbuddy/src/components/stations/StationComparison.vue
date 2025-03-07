<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getStationById } from '../../services/storageService';

const props = defineProps({
  stationIds: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'remove-station']);

// Stations data
const stations = ref([]);
const selectedFuelType = ref('unleaded');

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Calculate price difference with the cheapest station
const getPriceDifference = (station) => {
  if (!stations.value.length || !station) return 0;
  
  // Find the cheapest price for the selected fuel type
  const prices = stations.value.map(s => s.prices[selectedFuelType]);
  const cheapestPrice = Math.min(...prices);
  
  // Calculate difference
  const difference = station.prices[selectedFuelType] - cheapestPrice;
  return difference;
};

// Get class for price comparison
const getPriceClass = (station) => {
  const difference = getPriceDifference(station);
  
  if (difference === 0) return 'cheapest-price';
  if (difference < 0.1) return 'good-price';
  if (difference < 0.2) return 'average-price';
  return 'expensive-price';
};

// Format price difference for display
const formatPriceDifference = (station) => {
  const difference = getPriceDifference(station);
  
  if (difference === 0) return 'Cheapest';
  return `+${formatCurrency(difference)}`;
};

// Calculate estimated savings
const calculateSavings = (station) => {
  const difference = getPriceDifference(station);
  if (difference <= 0) return '—';
  
  // Assuming a 40L tank (fill-up)
  const savings = difference * 40;
  return formatCurrency(savings);
};

// Load stations data
const loadStations = () => {
  stations.value = props.stationIds.map(id => getStationById(id)).filter(Boolean);
};

// Remove a station from comparison
const removeStation = (stationId) => {
  emit('remove-station', stationId);
};

// Close the comparison panel
const closeComparison = () => {
  emit('close');
};

// Watch for changes in station IDs
watch(() => props.stationIds, () => {
  loadStations();
}, { deep: true });

// Load stations data when component mounts
onMounted(() => {
  loadStations();
});
</script>

<template>
  <div class="station-comparison">
    <div class="comparison-header">
      <h2 class="comparison-title">Compare Stations</h2>
      <button 
        class="close-btn" 
        @click="closeComparison"
        v-voix="'Close comparison'"
      >
        ×
      </button>
    </div>
    
    <div class="fuel-type-selector">
      <button 
        class="fuel-type-btn" 
        :class="{ active: selectedFuelType === 'unleaded' }"
        @click="selectedFuelType = 'unleaded'"
        v-voix="'Compare unleaded prices'"
      >
        Unleaded
      </button>
      <button 
        class="fuel-type-btn" 
        :class="{ active: selectedFuelType === 'premium' }"
        @click="selectedFuelType = 'premium'"
        v-voix="'Compare premium prices'"
      >
        Premium
      </button>
      <button 
        class="fuel-type-btn" 
        :class="{ active: selectedFuelType === 'diesel' }"
        @click="selectedFuelType = 'diesel'"
        v-voix="'Compare diesel prices'"
      >
        Diesel
      </button>
    </div>
    
    <div class="comparison-table-container">
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Station</th>
            <th>Price</th>
            <th>Difference</th>
            <th>Savings (40L)</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="station in stations" 
            :key="station.stationId"
            class="station-row"
          >
            <td>
              <div class="station-info">
                <div class="station-name">{{ station.name }}</div>
                <div class="station-address">{{ station.address }}</div>
              </div>
            </td>
            <td :class="getPriceClass(station)">
              {{ formatCurrency(station.prices[selectedFuelType]) }}
            </td>
            <td :class="getPriceClass(station)">
              {{ formatPriceDifference(station) }}
            </td>
            <td>{{ calculateSavings(station) }}</td>
            <td>
              <div class="station-rating">
                <span class="rating-stars">
                  {{ '★'.repeat(Math.floor(station.rating)) }}{{ station.rating % 1 >= 0.5 ? '½' : '' }}{{ '☆'.repeat(5 - Math.ceil(station.rating)) }}
                </span>
                <span class="rating-value">{{ station.rating }}</span>
              </div>
            </td>
            <td>
              <button 
                class="remove-btn" 
                @click="removeStation(station.stationId)"
                v-voix="'Remove ' + station.name + ' from comparison'"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="!stations.length" class="no-stations">
      No stations added to comparison yet.
    </div>
    
    <div class="comparison-footer">
      <p class="comparison-note">
        * Savings are calculated for a full tank (40L) compared to the cheapest station.
      </p>
    </div>
  </div>
</template>

<style scoped>
.station-comparison {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  margin-bottom: 2rem;
}

.comparison-header {
  padding: 1.5rem;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comparison-title {
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

.fuel-type-selector {
  display: flex;
  margin: 1.5rem;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.fuel-type-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #f9fafb;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.fuel-type-btn:not(:last-child) {
  border-right: 1px solid #e5e7eb;
}

.fuel-type-btn.active {
  background-color: #3b82f6;
  color: #ffffff;
}

.comparison-table-container {
  padding: 0 1.5rem;
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.comparison-table th {
  font-weight: 600;
  color: #4b5563;
  font-size: 0.875rem;
}

.station-info {
  display: flex;
  flex-direction: column;
}

.station-name {
  font-weight: 600;
  color: #1f2937;
}

.station-address {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.station-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  color: #f59e0b;
  letter-spacing: 0.1em;
}

.rating-value {
  font-weight: 600;
  color: #1f2937;
}

.cheapest-price {
  font-weight: 700;
  color: #047857;
}

.good-price {
  color: #059669;
}

.average-price {
  color: #d97706;
}

.expensive-price {
  color: #dc2626;
}

.remove-btn {
  padding: 0.375rem 0.75rem;
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.remove-btn:hover {
  background-color: #fecaca;
}

.no-stations {
  padding: 3rem 1.5rem;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.comparison-footer {
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.comparison-note {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .comparison-table th,
  .comparison-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .station-address {
    display: none;
  }
}
</style>