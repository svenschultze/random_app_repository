<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAlertsStore } from '@/stores/alerts'
import { useListingsStore } from '@/stores/listings'
import { useToast } from 'primevue/usetoast'

const alertsStore = useAlertsStore()
const listingsStore = useListingsStore()
const toast = useToast()

// States
const loading = ref(true)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const selectedAlert = ref(null)

// Alert form
const alertForm = reactive({
  name: '',
  filters: {
    priceMin: null,
    priceMax: null,
    bedrooms: null,
    propertyType: null,
    location: '',
    amenities: []
  },
  frequency: 'daily', // daily, weekly, instant
  active: true
})

// Property types
const propertyTypes = [
  { label: 'Any Type', value: null },
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
  { label: 'Studio', value: 'studio' },
  { label: 'Townhouse', value: 'townhouse' },
  { label: 'Condo', value: 'condo' }
]

// Bedroom options
const bedroomOptions = [
  { label: 'Any', value: null },
  { label: 'Studio', value: 0 },
  { label: '1 Bedroom', value: 1 },
  { label: '2 Bedrooms', value: 2 },
  { label: '3 Bedrooms', value: 3 },
  { label: '4+ Bedrooms', value: 4 }
]

// Frequency options
const frequencyOptions = [
  { label: 'Instant', value: 'instant' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' }
]

// Amenity options
const amenityOptions = [
  { label: 'Parking', value: 'parking' },
  { label: 'Gym', value: 'gym' },
  { label: 'Pool', value: 'pool' },
  { label: 'Pets Allowed', value: 'pets_allowed' },
  { label: 'Garden', value: 'garden' },
  { label: 'Doorman', value: 'doorman' },
  { label: 'Rooftop', value: 'rooftop' }
]

// Get matching properties count for each alert
const matchingCounts = computed(() => {
  const counts = {}
  
  alertsStore.alerts.forEach(alert => {
    // Set filters based on alert
    const tempFilters = { ...alert.filters }
    
    // Count matching properties
    counts[alert.id] = listingsStore.listings.filter(listing => {
      // Price filter
      if (tempFilters.priceMin && listing.price < tempFilters.priceMin) {
        return false
      }
      if (tempFilters.priceMax && listing.price > tempFilters.priceMax) {
        return false
      }
      
      // Bedrooms filter
      if (tempFilters.bedrooms && listing.bedrooms !== tempFilters.bedrooms) {
        return false
      }
      
      // Property type filter
      if (tempFilters.propertyType && listing.propertyType !== tempFilters.propertyType) {
        return false
      }
      
      // Location filter
      if (tempFilters.location && !listing.location.toLowerCase().includes(tempFilters.location.toLowerCase())) {
        return false
      }
      
      // Amenities filter (any match)
      if (tempFilters.amenities && tempFilters.amenities.length > 0) {
        const hasAmenity = tempFilters.amenities.some(amenity => 
          listing.amenities.includes(amenity)
        )
        if (!hasAmenity) return false
      }
      
      return true
    }).length
  })
  
  return counts
})

// Open create dialog
function openCreateDialog() {
  // Reset form
  alertForm.name = ''
  alertForm.filters = {
    priceMin: null,
    priceMax: null,
    bedrooms: null,
    propertyType: null,
    location: '',
    amenities: []
  }
  alertForm.frequency = 'daily'
  alertForm.active = true
  
  showCreateDialog.value = true
}

// Open edit dialog
function openEditDialog(alert) {
  selectedAlert.value = alert
  
  // Populate form with alert data
  alertForm.name = alert.name
  alertForm.filters = { ...alert.filters }
  alertForm.frequency = alert.frequency
  alertForm.active = alert.active
  
  showEditDialog.value = true
}

// Create alert
async function createAlert() {
  if (!alertForm.name) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please provide a name for this alert',
      life: 3000
    })
    return
  }
  
  try {
    await alertsStore.createAlert({
      name: alertForm.name,
      filters: alertForm.filters,
      frequency: alertForm.frequency,
      active: alertForm.active
    })
    
    toast.add({
      severity: 'success',
      summary: 'Alert Created',
      detail: 'Your alert has been created successfully',
      life: 3000
    })
    
    showCreateDialog.value = false
  } catch (error) {
    console.error('Error creating alert:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create alert. Please try again.',
      life: 3000
    })
  }
}

// Update alert
async function updateAlert() {
  if (!alertForm.name) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please provide a name for this alert',
      life: 3000
    })
    return
  }
  
  try {
    await alertsStore.updateAlert(selectedAlert.value.id, {
      name: alertForm.name,
      filters: alertForm.filters,
      frequency: alertForm.frequency,
      active: alertForm.active
    })
    
    toast.add({
      severity: 'success',
      summary: 'Alert Updated',
      detail: 'Your alert has been updated successfully',
      life: 3000
    })
    
    showEditDialog.value = false
  } catch (error) {
    console.error('Error updating alert:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update alert. Please try again.',
      life: 3000
    })
  }
}

// Delete alert
async function deleteAlert(alertId) {
  try {
    await alertsStore.deleteAlert(alertId)
    
    toast.add({
      severity: 'success',
      summary: 'Alert Deleted',
      detail: 'Your alert has been deleted successfully',
      life: 3000
    })
  } catch (error) {
    console.error('Error deleting alert:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete alert. Please try again.',
      life: 3000
    })
  }
}

// Toggle alert active status
async function toggleAlertActive(alertId) {
  try {
    await alertsStore.toggleAlertActive(alertId)
    
    const alert = alertsStore.alerts.find(a => a.id === alertId)
    const status = alert.active ? 'enabled' : 'disabled'
    
    toast.add({
      severity: 'success',
      summary: 'Alert Updated',
      detail: `Your alert has been ${status}`,
      life: 3000
    })
  } catch (error) {
    console.error('Error toggling alert:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update alert. Please try again.',
      life: 3000
    })
  }
}

// Get frequency label
function getFrequencyLabel(value) {
  const option = frequencyOptions.find(opt => opt.value === value)
  return option ? option.label : value
}

// Format filters for display
function formatFilters(filters) {
  const parts = []
  
  if (filters.location) {
    parts.push(`Location: ${filters.location}`)
  }
  
  if (filters.propertyType) {
    const type = propertyTypes.find(t => t.value === filters.propertyType)
    parts.push(`Type: ${type ? type.label : filters.propertyType}`)
  }
  
  if (filters.bedrooms !== null) {
    parts.push(`${filters.bedrooms} bd`)
  }
  
  if (filters.priceMin || filters.priceMax) {
    const min = filters.priceMin ? `$${filters.priceMin}` : ''
    const max = filters.priceMax ? `$${filters.priceMax}` : ''
    parts.push(`Price: ${min} - ${max}`)
  }
  
  return parts.join(' • ')
}

// Initialize component
onMounted(async () => {
  loading.value = true
  
  // Load all listings if not loaded yet
  if (listingsStore.listings.length === 0) {
    await listingsStore.fetchListings()
  }
  
  // Load alerts
  await alertsStore.fetchAlerts()
  
  loading.value = false
})
</script>

<template>
  <div class="alerts-view">
    <div class="alerts-header">
      <h1>My Alerts</h1>
      <Button 
        label="Create Alert" 
        icon="pi pi-plus" 
        @click="openCreateDialog" 
        class="p-button-primary"
      />
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Loading your alerts...</p>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="alertsStore.alerts.length === 0" class="empty-state">
      <i class="pi pi-bell"></i>
      <h2>No alerts set</h2>
      <p>Create alerts to get notified about new properties that match your criteria</p>
      <Button 
        label="Create Your First Alert" 
        icon="pi pi-plus" 
        @click="openCreateDialog" 
        class="p-button-primary"
      />
    </div>
    
    <!-- Alerts list -->
    <div v-else class="alerts-list">
      <div v-for="alert in alertsStore.alerts" :key="alert.id" class="alert-card">
        <Card>
          <template #header>
            <div class="alert-header">
              <div class="alert-status" :class="{ active: alert.active }">
                <i :class="alert.active ? 'pi pi-bell' : 'pi pi-bell-slash'"></i>
                <span>{{ alert.active ? 'Active' : 'Paused' }}</span>
              </div>
              
              <div class="alert-frequency">
                <i class="pi pi-clock"></i>
                <span>{{ getFrequencyLabel(alert.frequency) }}</span>
              </div>
            </div>
          </template>
          
          <template #title>
            <div class="alert-title">{{ alert.name }}</div>
          </template>
          
          <template #content>
            <div class="alert-filters">
              {{ formatFilters(alert.filters) }}
            </div>
            
            <div class="matching-count">
              {{ matchingCounts[alert.id] || 0 }} matching properties
            </div>
            
            <div class="alert-actions">
              <Button 
                :icon="alert.active ? 'pi pi-pause' : 'pi pi-play'" 
                :label="alert.active ? 'Pause' : 'Enable'" 
                class="p-button-outlined p-button-sm"
                @click="toggleAlertActive(alert.id)"
              />
              
              <Button 
                icon="pi pi-pencil" 
                label="Edit" 
                class="p-button-outlined p-button-sm"
                @click="openEditDialog(alert)"
              />
              
              <Button 
                icon="pi pi-trash" 
                label="Delete" 
                class="p-button-outlined p-button-danger p-button-sm"
                @click="deleteAlert(alert.id)"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
    
    <!-- Create Alert Dialog -->
    <Dialog 
      v-model:visible="showCreateDialog" 
      header="Create Alert" 
      :modal="true"
      :style="{ width: '500px' }"
      :closable="true"
    >
      <div class="alert-form">
        <div class="p-field">
          <label for="alertName">Alert Name</label>
          <InputText id="alertName" v-model="alertForm.name" class="w-full" />
        </div>
        
        <div class="p-field">
          <label for="alertFrequency">Notification Frequency</label>
          <Dropdown 
            id="alertFrequency"
            v-model="alertForm.frequency" 
            :options="frequencyOptions" 
            optionLabel="label" 
            optionValue="value"
            class="w-full"
          />
        </div>
        
        <h3>Search Criteria</h3>
        
        <div class="p-field">
          <label for="alertLocation">Location</label>
          <InputText id="alertLocation" v-model="alertForm.filters.location" class="w-full" />
        </div>
        
        <div class="form-row">
          <div class="p-field">
            <label for="alertPriceMin">Min Price</label>
            <InputText id="alertPriceMin" v-model.number="alertForm.filters.priceMin" type="number" class="w-full" />
          </div>
          
          <div class="p-field">
            <label for="alertPriceMax">Max Price</label>
            <InputText id="alertPriceMax" v-model.number="alertForm.filters.priceMax" type="number" class="w-full" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="p-field">
            <label for="alertBedrooms">Bedrooms</label>
            <Dropdown 
              id="alertBedrooms"
              v-model="alertForm.filters.bedrooms" 
              :options="bedroomOptions" 
              optionLabel="label" 
              optionValue="value"
              class="w-full"
            />
          </div>
          
          <div class="p-field">
            <label for="alertPropertyType">Property Type</label>
            <Dropdown 
              id="alertPropertyType"
              v-model="alertForm.filters.propertyType" 
              :options="propertyTypes" 
              optionLabel="label" 
              optionValue="value"
              class="w-full"
            />
          </div>
        </div>
        
        <div class="p-field">
          <label for="alertAmenities">Amenities</label>
          <MultiSelect 
            id="alertAmenities"
            v-model="alertForm.filters.amenities" 
            :options="amenityOptions" 
            optionLabel="label" 
            optionValue="value"
            display="chip"
            class="w-full"
          />
        </div>
        
        <div class="p-field-checkbox">
          <Checkbox id="alertActive" v-model="alertForm.active" :binary="true" />
          <label for="alertActive">Enable alert notifications</label>
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showCreateDialog = false" />
        <Button label="Create" icon="pi pi-check" @click="createAlert" />
      </template>
    </Dialog>
    
    <!-- Edit Alert Dialog -->
    <Dialog 
      v-model:visible="showEditDialog" 
      header="Edit Alert" 
      :modal="true"
      :style="{ width: '500px' }"
      :closable="true"
    >
      <div class="alert-form">
        <div class="p-field">
          <label for="editAlertName">Alert Name</label>
          <InputText id="editAlertName" v-model="alertForm.name" class="w-full" />
        </div>
        
        <div class="p-field">
          <label for="editAlertFrequency">Notification Frequency</label>
          <Dropdown 
            id="editAlertFrequency"
            v-model="alertForm.frequency" 
            :options="frequencyOptions" 
            optionLabel="label" 
            optionValue="value"
            class="w-full"
          />
        </div>
        
        <h3>Search Criteria</h3>
        
        <div class="p-field">
          <label for="editAlertLocation">Location</label>
          <InputText id="editAlertLocation" v-model="alertForm.filters.location" class="w-full" />
        </div>
        
        <div class="form-row">
          <div class="p-field">
            <label for="editAlertPriceMin">Min Price</label>
            <InputText id="editAlertPriceMin" v-model.number="alertForm.filters.priceMin" type="number" class="w-full" />
          </div>
          
          <div class="p-field">
            <label for="editAlertPriceMax">Max Price</label>
            <InputText id="editAlertPriceMax" v-model.number="alertForm.filters.priceMax" type="number" class="w-full" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="p-field">
            <label for="editAlertBedrooms">Bedrooms</label>
            <Dropdown 
              id="editAlertBedrooms"
              v-model="alertForm.filters.bedrooms" 
              :options="bedroomOptions" 
              optionLabel="label" 
              optionValue="value"
              class="w-full"
            />
          </div>
          
          <div class="p-field">
            <label for="editAlertPropertyType">Property Type</label>
            <Dropdown 
              id="editAlertPropertyType"
              v-model="alertForm.filters.propertyType" 
              :options="propertyTypes" 
              optionLabel="label" 
              optionValue="value"
              class="w-full"
            />
          </div>
        </div>
        
        <div class="p-field">
          <label for="editAlertAmenities">Amenities</label>
          <MultiSelect 
            id="editAlertAmenities"
            v-model="alertForm.filters.amenities" 
            :options="amenityOptions" 
            optionLabel="label" 
            optionValue="value"
            display="chip"
            class="w-full"
          />
        </div>
        
        <div class="p-field-checkbox">
          <Checkbox id="editAlertActive" v-model="alertForm.active" :binary="true" />
          <label for="editAlertActive">Enable alert notifications</label>
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showEditDialog = false" />
        <Button label="Save Changes" icon="pi pi-check" @click="updateAlert" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.alerts-view {
  margin-bottom: 2rem;
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

/* Loading and empty states */
.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-container i,
.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.empty-state h2 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: var(--text-color-secondary);
}

/* Alerts list */
.alerts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.alert-card {
  height: 100%;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: var(--surface-section);
  border-radius: 6px 6px 0 0;
}

.alert-status,
.alert-frequency {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.alert-status.active {
  color: var(--primary-color);
}

.alert-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.alert-filters {
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
}

.matching-count {
  font-weight: 500;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Form styles */
.alert-form {
  padding: 0 1rem;
}

.alert-form h3 {
  margin: 1.5rem 0 1rem;
  font-size: 1.1rem;
  color: var(--text-color-secondary);
}

.p-field {
  margin-bottom: 1.25rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .p-field {
  flex: 1;
}

.w-full {
  width: 100%;
}

.p-field-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .alerts-list {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>