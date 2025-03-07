<script setup>
import { ref, computed, onMounted } from 'vue';
import { getFillUps, getStationById, deleteFillUp } from '../../services/storageService';

const emit = defineEmits(['edit']);

// Fill-ups data
const fillUps = ref([]);
const searchTerm = ref('');

// Computed filtered fill-ups based on search term
const filteredFillUps = computed(() => {
  if (!searchTerm.value) return fillUps.value;
  
  const term = searchTerm.value.toLowerCase();
  return fillUps.value.filter(fillUp => {
    const date = new Date(fillUp.date).toLocaleString().toLowerCase();
    const station = getStationName(fillUp.stationId).toLowerCase();
    
    return date.includes(term) || 
      station.includes(term) || 
      fillUp.notes.toLowerCase().includes(term);
  });
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

// Calculate distance between two fill-ups
const calculateDistance = (index) => {
  if (index >= fillUps.value.length - 1) return '-';
  
  const current = fillUps.value[index];
  const next = fillUps.value[index + 1];
  
  if (current.odometer && next.odometer) {
    return (current.odometer - next.odometer).toFixed(0);
  }
  
  return '-';
};

// Calculate fuel efficiency (L/100km)
const calculateEfficiency = (index) => {
  if (index >= fillUps.value.length - 1) return '-';
  
  const current = fillUps.value[index];
  const next = fillUps.value[index + 1];
  
  if (current.odometer && next.odometer && current.volume) {
    const distance = current.odometer - next.odometer;
    if (distance <= 0) return '-';
    
    const efficiency = (current.volume / distance) * 100; // L/100km
    return efficiency.toFixed(1);
  }
  
  return '-';
};

// Edit a fill-up
const editFillUp = (fillUp) => {
  emit('edit', fillUp);
};

// Delete a fill-up
const removeFillUp = (entryId) => {
  if (confirm('Are you sure you want to delete this fill-up?')) {
    deleteFillUp(entryId);
    loadFillUps();
  }
};

// Load fill-ups from storage
const loadFillUps = () => {
  fillUps.value = getFillUps();
};

// Load fill-ups when component mounts
onMounted(() => {
  loadFillUps();
});
</script>

<template>
  <div class="fillups-list-container">
    <div class="list-header">
      <h2 class="list-title">Your Fill-up History</h2>
      
      <div class="list-actions">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Search fill-ups..." 
            class="search-input"
            v-voix="'Search fill-ups input'"
            hint="Search by date or station"
          >
        </div>
      </div>
    </div>
    
    <div v-if="filteredFillUps.length" class="fillups-table-container">
      <table class="fillups-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Station</th>
            <th>Odometer</th>
            <th>Distance</th>
            <th>Volume</th>
            <th>Price</th>
            <th>Total</th>
            <th>L/100km</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(fillUp, index) in filteredFillUps" 
            :key="fillUp.entryId"
            class="fillup-row"
            v-voix="'Fill-up on ' + formatDate(fillUp.date) + ' at ' + getStationName(fillUp.stationId)"
          >
            <td>{{ formatDate(fillUp.date) }}</td>
            <td>{{ getStationName(fillUp.stationId) }}</td>
            <td>{{ fillUp.odometer }}</td>
            <td>{{ calculateDistance(index) }}</td>
            <td>{{ fillUp.volume.toFixed(1) }} L</td>
            <td>{{ formatCurrency(fillUp.pricePerLiter) }}</td>
            <td>{{ formatCurrency(fillUp.totalCost) }}</td>
            <td>{{ calculateEfficiency(index) }}</td>
            <td class="actions-cell">
              <button 
                @click="editFillUp(fillUp)" 
                class="action-btn edit-btn"
                v-voix="'Edit fill-up button'"
              >
                Edit
              </button>
              <button 
                @click="removeFillUp(fillUp.entryId)" 
                class="action-btn delete-btn"
                v-voix="'Delete fill-up button'"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="no-data">
      <p v-if="searchTerm">No fill-ups match your search. Try a different term.</p>
      <p v-else>No fill-ups recorded yet. Add your first fill-up to see your history.</p>
    </div>
  </div>
</template>

<style scoped>
.fillups-list-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.list-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.list-actions {
  display: flex;
  gap: 1rem;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 250px;
  outline: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.fillups-table-container {
  overflow-x: auto;
}

.fillups-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.fillups-table th,
.fillups-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.fillups-table th {
  font-weight: 600;
  color: #4b5563;
  background-color: #f9fafb;
}

.fillup-row:hover {
  background-color: #f3f4f6;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.edit-btn {
  background-color: #dbeafe;
  color: #2563eb;
  border: none;
}

.edit-btn:hover {
  background-color: #bfdbfe;
}

.delete-btn {
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
}

.delete-btn:hover {
  background-color: #fecaca;
}

.no-data {
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .search-input {
    width: 100%;
  }
}
</style>