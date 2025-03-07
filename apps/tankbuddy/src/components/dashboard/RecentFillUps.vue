<script setup>
import { ref, computed, onMounted } from 'vue';
import { getFillUps, getStationById } from '../../services/storageService';

const fillUps = ref([]);

// Get a limited number of the most recent fill-ups
const recentFillUps = computed(() => {
  return fillUps.value.slice(0, 3);
});

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// Get station name from ID
const getStationName = (stationId) => {
  if (!stationId) return 'Unknown Station';
  
  const station = getStationById(stationId);
  return station ? station.name : 'Unknown Station';
};

// Load fill-ups data
onMounted(() => {
  fillUps.value = getFillUps();
});
</script>

<template>
  <div class="recent-fillups">
    <h2 class="recent-fillups-title">Recent Fill-ups</h2>
    
    <div v-if="recentFillUps.length" class="fillups-list">
      <div 
        v-for="fillUp in recentFillUps" 
        :key="fillUp.entryId" 
        class="fillup-item"
        v-voix="'Fillup on ' + formatDate(fillUp.date)"
      >
        <div class="fillup-date">{{ formatDate(fillUp.date) }}</div>
        <div class="fillup-details">
          <div class="fillup-station">{{ getStationName(fillUp.stationId) }}</div>
          <div class="fillup-amount">{{ fillUp.volume.toFixed(1) }} L at {{ fillUp.pricePerLiter.toFixed(2) }}/L</div>
          <div class="fillup-odometer">{{ fillUp.odometer }} km</div>
        </div>
        <div class="fillup-total">{{ formatCurrency(fillUp.totalCost) }}</div>
      </div>
    </div>
    
    <div v-else class="no-data">
      No fill-ups yet. Add your first fill-up to see your records.
    </div>
  </div>
</template>

<style scoped>
.recent-fillups {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-fillups-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1f2937;
}

.fillups-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fillup-item {
  display: flex;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: #f9fafb;
  align-items: center;
}

.fillup-date {
  flex: 0 0 100px;
  font-weight: 500;
  color: #4b5563;
}

.fillup-details {
  flex: 1;
}

.fillup-station {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.fillup-amount, .fillup-odometer {
  font-size: 0.875rem;
  color: #6b7280;
}

.fillup-total {
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