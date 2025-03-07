<script setup>
import { ref, computed, onMounted } from 'vue';
import { getStations } from '../../services/storageService';

const stations = ref([]);

// Get the stations with the cheapest unleaded prices
const cheapestStations = computed(() => {
  return [...stations.value]
    .sort((a, b) => a.prices.unleaded - b.prices.unleaded)
    .slice(0, 3);
});

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Load stations data
onMounted(() => {
  stations.value = getStations();
});
</script>

<template>
  <div class="top-stations">
    <h2 class="top-stations-title">Cheapest Stations</h2>
    
    <div v-if="cheapestStations.length" class="stations-list">
      <div 
        v-for="station in cheapestStations" 
        :key="station.stationId" 
        class="station-item"
        v-voix="station.name + ' with unleaded price ' + station.prices.unleaded.toFixed(2) + ' per liter'"
      >
        <div class="station-name">{{ station.name }}</div>
        <div class="station-address">{{ station.address }}</div>
        <div class="station-prices">
          <div class="price-item">
            <span class="fuel-type">Unleaded</span>
            <span class="price-value">{{ formatCurrency(station.prices.unleaded) }}</span>
          </div>
          <div class="price-item">
            <span class="fuel-type">Premium</span>
            <span class="price-value">{{ formatCurrency(station.prices.premium) }}</span>
          </div>
          <div class="price-item">
            <span class="fuel-type">Diesel</span>
            <span class="price-value">{{ formatCurrency(station.prices.diesel) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data">
      No stations data available.
    </div>
  </div>
</template>

<style scoped>
.top-stations {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.top-stations-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1f2937;
}

.stations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.station-item {
  padding: 1rem;
  border-radius: 6px;
  background-color: #f9fafb;
}

.station-name {
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  color: #1f2937;
}

.station-address {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.station-prices {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.price-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
}

.fuel-type {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.price-value {
  font-weight: 600;
  color: #1f2937;
}

.no-data {
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
  font-style: italic;
}
</style>