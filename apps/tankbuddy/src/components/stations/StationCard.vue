<script setup>
import { defineProps, defineEmits } from 'vue';
import { toggleStationFavorite } from '../../services/storageService';

const props = defineProps({
  station: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['view-details', 'view-history', 'compare']);

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Toggle favorite status
const toggleFavorite = () => {
  toggleStationFavorite(props.station.stationId);
  emit('favorite-toggled', props.station.stationId);
};

// View station details
const viewStationDetails = () => {
  emit('view-details', props.station.stationId);
};

// View price history
const viewPriceHistory = () => {
  emit('view-history', props.station.stationId);
};

// Add to comparison
const addToComparison = () => {
  emit('compare', props.station.stationId);
};

// Open directions in a map
const openDirections = () => {
  // In a real app, this would open Google Maps or another mapping service
  const { latitude, longitude } = props.station.location;
};
</script>

<template>
  <div 
    class="station-card"
    v-voix="station.name + ' station on ' + station.address"
  >
    <div class="station-card-header">
      <div class="header-main">
        <h3 class="station-name">{{ station.name }}</h3>
        <button 
          class="favorite-btn" 
          @click="toggleFavorite"
          v-voix="'Toggle favorite for ' + station.name"
        >
          <span v-if="station.favorite" class="favorite-icon filled">★</span>
          <span v-else class="favorite-icon">☆</span>
        </button>
      </div>
      <div class="station-address">{{ station.address }}</div>
      <div class="station-rating">
        <span class="rating-stars">
          {{ '★'.repeat(Math.floor(station.rating)) }}{{ station.rating % 1 >= 0.5 ? '½' : '' }}{{ '☆'.repeat(5 - Math.ceil(station.rating)) }}
        </span>
        <span class="rating-value">{{ station.rating }}</span>
        <span class="reviews-count" v-if="station.reviews.length">({{ station.reviews.length }} reviews)</span>
      </div>
    </div>
    
    <div class="station-card-content">
      <div class="fuel-prices">
        <div class="fuel-price-item">
          <div class="fuel-type">Unleaded</div>
          <div class="fuel-price">{{ formatCurrency(station.prices.unleaded) }}</div>
        </div>
        
        <div class="fuel-price-item">
          <div class="fuel-type">Premium</div>
          <div class="fuel-price">{{ formatCurrency(station.prices.premium) }}</div>
        </div>
        
        <div class="fuel-price-item">
          <div class="fuel-type">Diesel</div>
          <div class="fuel-price">{{ formatCurrency(station.prices.diesel) }}</div>
        </div>
      </div>
      
      <div class="station-amenities" v-if="station.amenities && station.amenities.length">
        <div class="amenities-title">Amenities</div>
        <div class="amenities-list">
          <span 
            v-for="(amenity, index) in station.amenities" 
            :key="index"
            class="amenity-badge"
          >
            {{ amenity }}
          </span>
        </div>
      </div>
      
      <div class="station-hours">
        <div class="hours-label">Hours:</div>
        <div class="hours-value">{{ station.hours.open }} - {{ station.hours.close }}</div>
      </div>
    </div>
    
    <div class="station-card-actions">
      <button 
        class="action-btn details-btn" 
        @click="viewStationDetails"
        v-voix="'View details for ' + station.name"
      >
        Details
      </button>
      <button 
        class="action-btn history-btn" 
        @click="viewPriceHistory"
        v-voix="'View price history for ' + station.name"
      >
        Price History
      </button>
      <button 
        class="action-btn compare-btn" 
        @click="addToComparison"
        v-voix="'Add to comparison'"
      >
        Compare
      </button>
      <button 
        class="action-btn directions-btn" 
        @click="openDirections"
        v-voix="'Get directions to ' + station.name"
      >
        Directions
      </button>
    </div>
  </div>
</template>

<style scoped>
.station-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.station-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.station-card-header {
  padding: 1.25rem;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.station-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.2);
}

.favorite-icon.filled {
  color: #f59e0b;
}

.favorite-icon:not(.filled) {
  color: #d1d5db;
}

.station-address {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.station-rating {
  margin-top: 0.5rem;
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

.reviews-count {
  font-size: 0.75rem;
  color: #6b7280;
}

.station-card-content {
  padding: 1.25rem;
}

.fuel-prices {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}

.fuel-price-item {
  flex: 1;
  text-align: center;
}

.fuel-type {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.fuel-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.station-amenities {
  margin-bottom: 1.25rem;
}

.amenities-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.amenity-badge {
  background-color: #eef2ff;
  color: #4f46e5;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.station-hours {
  display: flex;
  font-size: 0.875rem;
  color: #6b7280;
}

.hours-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.station-card-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0 1.25rem 1.25rem;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.15s ease-in-out, transform 0.15s ease-in-out;
  text-align: center;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.details-btn {
  background-color: #dbeafe;
  color: #2563eb;
}

.details-btn:hover {
  background-color: #bfdbfe;
}

.history-btn {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.history-btn:hover {
  background-color: #c7d2fe;
}

.compare-btn {
  background-color: #fce7f3;
  color: #db2777;
}

.compare-btn:hover {
  background-color: #fbcfe8;
}

.directions-btn {
  background-color: #ecfdf5;
  color: #059669;
}

.directions-btn:hover {
  background-color: #d1fae5;
}

@media (max-width: 480px) {
  .station-card-actions {
    grid-template-columns: 1fr;
  }
}
</style>