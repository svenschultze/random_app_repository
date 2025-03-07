<script setup>
import { ref, computed, onMounted } from 'vue';
import { getStations, addFillUp } from '../../services/storageService';
import { FillUp } from '../../models/FillUp';

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  fillUpData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['saved', 'cancel']);

// Form data
const date = ref(props.editMode ? props.fillUpData.date : new Date().toISOString().split('T')[0]);
const odometer = ref(props.editMode ? props.fillUpData.odometer : '');
const volume = ref(props.editMode ? props.fillUpData.volume : '');
const pricePerLiter = ref(props.editMode ? props.fillUpData.pricePerLiter : '');
const totalCost = ref(props.editMode ? props.fillUpData.totalCost : '');
const stationId = ref(props.editMode ? props.fillUpData.stationId : '');
const notes = ref(props.editMode ? props.fillUpData.notes : '');

// Stations list for dropdown
const stations = ref([]);

// Calculate total cost when volume or price changes
const calculateTotalCost = () => {
  if (volume.value && pricePerLiter.value) {
    totalCost.value = (parseFloat(volume.value) * parseFloat(pricePerLiter.value)).toFixed(2);
  }
};

// Calculate price per liter when total cost or volume changes
const calculatePricePerLiter = () => {
  if (volume.value && totalCost.value) {
    pricePerLiter.value = (parseFloat(totalCost.value) / parseFloat(volume.value)).toFixed(2);
  }
};

// Form validation
const isFormValid = computed(() => {
  return date.value && 
    odometer.value && 
    volume.value && 
    pricePerLiter.value && 
    parseFloat(odometer.value) > 0 &&
    parseFloat(volume.value) > 0 &&
    parseFloat(pricePerLiter.value) > 0;
});

// Handle form submission
const handleSubmit = () => {
  if (!isFormValid.value) return;
  
  const fillUpData = new FillUp({
    entryId: props.editMode ? props.fillUpData.entryId : undefined,
    date: date.value,
    odometer: parseFloat(odometer.value),
    volume: parseFloat(volume.value),
    pricePerLiter: parseFloat(pricePerLiter.value),
    totalCost: parseFloat(totalCost.value || (volume.value * pricePerLiter.value).toFixed(2)),
    stationId: stationId.value,
    notes: notes.value
  });
  
  addFillUp(fillUpData);
  emit('saved', fillUpData);
};

// Cancel form
const handleCancel = () => {
  emit('cancel');
};

// Load stations when component mounts
onMounted(() => {
  stations.value = getStations();
});
</script>

<template>
  <div class="fillup-form">
    <h2 class="form-title">{{ editMode ? 'Edit Fill-up' : 'Add New Fill-up' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="form-content">
      <div class="form-row">
        <div class="form-group">
          <label for="date" class="form-label">Date</label>
          <input 
            type="date" 
            id="date" 
            v-model="date" 
            class="form-input" 
            required
            v-voix="'Date input'"
            hint="Enter the date of your fill-up"
          >
        </div>
        
        <div class="form-group">
          <label for="odometer" class="form-label">Odometer (km)</label>
          <input 
            type="number" 
            id="odometer" 
            v-model="odometer" 
            class="form-input" 
            min="0" 
            step="1" 
            required
            v-voix="'Odometer input in kilometers'"
            hint="Enter your current odometer reading"
          >
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="volume" class="form-label">Volume (liters)</label>
          <input 
            type="number" 
            id="volume" 
            v-model="volume" 
            class="form-input" 
            min="0.1" 
            step="0.1" 
            required
            @input="calculateTotalCost"
            v-voix="'Volume input in liters'"
            hint="Enter the amount of fuel you purchased"
          >
        </div>
        
        <div class="form-group">
          <label for="pricePerLiter" class="form-label">Price per liter</label>
          <input 
            type="number" 
            id="pricePerLiter" 
            v-model="pricePerLiter" 
            class="form-input" 
            min="0.01" 
            step="0.01" 
            required
            @input="calculateTotalCost"
            v-voix="'Price per liter input'"
            hint="Enter the price of fuel per liter"
          >
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="totalCost" class="form-label">Total Cost</label>
          <input 
            type="number" 
            id="totalCost" 
            v-model="totalCost" 
            class="form-input" 
            min="0" 
            step="0.01"
            @input="calculatePricePerLiter"
            v-voix="'Total Cost input'"
            hint="Enter the total amount paid, or it will be calculated automatically"
          >
        </div>
        
        <div class="form-group">
          <label for="station" class="form-label">Station</label>
          <select 
            id="station" 
            v-model="stationId" 
            class="form-input"
            v-voix="'Station selection dropdown'"
            hint="Select the gas station where you filled up"
          >
            <option value="">-- Select Station --</option>
            <option 
              v-for="station in stations" 
              :key="station.stationId" 
              :value="station.stationId"
            >
              {{ station.name }} ({{ station.address }})
            </option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="notes" class="form-label">Notes</label>
        <textarea 
          id="notes" 
          v-model="notes" 
          class="form-input form-textarea"
          v-voix="'Notes textarea'"
          hint="Enter any additional notes about this fill-up"
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="handleCancel"
          v-voix="'Cancel button'"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="!isFormValid"
          v-voix="'Save fill-up button'"
        >
          {{ editMode ? 'Update' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.fillup-form {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 1.25rem;
  }
}
</style>