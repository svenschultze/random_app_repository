<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock price alerts
const priceAlerts = ref([
  {
    id: '1',
    from: 'SFO',
    to: 'NYC',
    priceThreshold: 350,
    dateRange: 'Apr 15 - Apr 30, 2025',
    enabled: true
  },
  {
    id: '2',
    from: 'LAX',
    to: 'LHR',
    priceThreshold: 700,
    dateRange: 'May 10 - May 25, 2025',
    enabled: true
  },
  {
    id: '3',
    from: 'SEA',
    to: 'TYO',
    priceThreshold: 800,
    dateRange: 'Jun 5 - Jun 20, 2025',
    enabled: false
  }
])

// Mock flight status notifications
const flightNotifications = ref([
  {
    id: '1',
    flightNumber: 'DL1234',
    route: 'SFO → NYC',
    date: 'Apr 15, 2025',
    enabled: true
  },
  {
    id: '2',
    flightNumber: 'AA456',
    route: 'LAX → MIA',
    date: 'May 20, 2025',
    enabled: true
  }
])

// Form for new price alert
const newPriceAlert = ref({
  from: '',
  to: '',
  priceThreshold: '',
  startDate: '',
  endDate: ''
})

// Toggle alert state
const toggleAlert = (alert) => {
  alert.enabled = !alert.enabled
}

// Delete alert
const deleteAlert = (alertType, alertId) => {
  if (alertType === 'price') {
    priceAlerts.value = priceAlerts.value.filter(alert => alert.id !== alertId)
  } else if (alertType === 'flight') {
    flightNotifications.value = flightNotifications.value.filter(alert => alert.id !== alertId)
  }
}

// Add new price alert
const addPriceAlert = () => {
  // Validate form
  if (!newPriceAlert.value.from || !newPriceAlert.value.to || 
      !newPriceAlert.value.priceThreshold || !newPriceAlert.value.startDate || 
      !newPriceAlert.value.endDate) {
    return
  }
  
  // Create new alert
  const newAlert = {
    id: Date.now().toString(),
    from: newPriceAlert.value.from,
    to: newPriceAlert.value.to,
    priceThreshold: parseInt(newPriceAlert.value.priceThreshold),
    dateRange: `${formatDate(newPriceAlert.value.startDate)} - ${formatDate(newPriceAlert.value.endDate)}`,
    enabled: true
  }
  
  // Add to alerts list
  priceAlerts.value.unshift(newAlert)
  
  // Reset form
  newPriceAlert.value = {
    from: '',
    to: '',
    priceThreshold: '',
    startDate: '',
    endDate: ''
  }
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { month: 'short', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}
</script>

<template>
  <div class="alerts-view">
    <h1 v-voix="'Alerts and Notifications Heading'">Alerts & Notifications</h1>
    
    <div class="tabs-container">
      <div class="tabs">
        <button 
          class="tab active" 
          v-voix="'Price Alerts Tab'"
          hint="View and manage your price alerts"
        >
          Price Alerts
        </button>
        <button 
          class="tab" 
          v-voix="'Flight Status Tab'"
          hint="View and manage your flight status notifications"
        >
          Flight Status
        </button>
      </div>
    </div>
    
    <!-- Price Alerts Section -->
    <div class="section">
      <h2 v-voix="'Create Price Alert Heading'">Create Price Alert</h2>
      
      <div class="alert-form">
        <div class="form-row">
          <div class="form-group">
            <label for="from-airport" v-voix="'From Airport Label'">From</label>
            <input 
              type="text" 
              id="from-airport" 
              v-model="newPriceAlert.from" 
              placeholder="City or airport"
              v-voix="'From Airport Input'"
              hint="Enter departure city or airport code"
            >
          </div>
          
          <div class="form-group">
            <label for="to-airport" v-voix="'To Airport Label'">To</label>
            <input 
              type="text" 
              id="to-airport" 
              v-model="newPriceAlert.to" 
              placeholder="City or airport"
              v-voix="'To Airport Input'"
              hint="Enter destination city or airport code"
            >
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="price-threshold" v-voix="'Price Threshold Label'">Price Threshold</label>
            <div class="price-input">
              <span class="currency-symbol">$</span>
              <input 
                type="number" 
                id="price-threshold" 
                v-model="newPriceAlert.priceThreshold" 
                placeholder="Max price"
                v-voix="'Price Threshold Input'"
                hint="Enter maximum price you want to pay"
              >
            </div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="start-date" v-voix="'Start Date Label'">From Date</label>
            <input 
              type="date" 
              id="start-date" 
              v-model="newPriceAlert.startDate"
              v-voix="'Start Date Input'"
              hint="Select earliest travel date"
            >
          </div>
          
          <div class="form-group">
            <label for="end-date" v-voix="'End Date Label'">To Date</label>
            <input 
              type="date" 
              id="end-date" 
              v-model="newPriceAlert.endDate"
              v-voix="'End Date Input'"
              hint="Select latest travel date"
            >
          </div>
        </div>
        
        <button 
          class="create-alert-button" 
          @click="addPriceAlert"
          v-voix="'Create Alert Button'"
          hint="Create a new price alert with your criteria"
        >
          Create Alert
        </button>
      </div>
    </div>
    
    <div class="section">
      <h2 v-voix="'Active Price Alerts Heading'">Your Price Alerts</h2>
      
      <div class="alerts-list">
        <div 
          v-for="alert in priceAlerts" 
          :key="alert.id" 
          class="alert-card"
          v-voix="'Price Alert Card'"
          :hint="`Alert for flights from ${alert.from} to ${alert.to} under $${alert.priceThreshold}`"
        >
          <div class="alert-main-info">
            <div class="alert-route">{{ alert.from }} → {{ alert.to }}</div>
            <div class="alert-price">Under ${{ alert.priceThreshold }}</div>
            <div class="alert-dates">{{ alert.dateRange }}</div>
          </div>
          
          <div class="alert-actions">
            <label class="toggle-container" v-voix="'Toggle Price Alert'">
              <input 
                type="checkbox" 
                :checked="alert.enabled" 
                @change="toggleAlert(alert)"
              >
              <span class="toggle-slider"></span>
            </label>
            
            <button 
              class="delete-button" 
              @click.stop="deleteAlert('price', alert.id)"
              v-voix="'Delete Price Alert Button'"
              hint="Delete this price alert"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div v-if="priceAlerts.length === 0" class="no-alerts">
          <p>No price alerts set. Create your first alert above.</p>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2 v-voix="'Flight Status Notifications Heading'">Flight Status Notifications</h2>
      
      <div class="alerts-list">
        <div 
          v-for="notification in flightNotifications" 
          :key="notification.id" 
          class="alert-card"
          v-voix="'Flight Status Notification Card'"
          :hint="`Flight ${notification.flightNumber} from ${notification.route} on ${notification.date}`"
        >
          <div class="alert-main-info">
            <div class="alert-flight-number">{{ notification.flightNumber }}</div>
            <div class="alert-route">{{ notification.route }}</div>
            <div class="alert-dates">{{ notification.date }}</div>
          </div>
          
          <div class="alert-actions">
            <label class="toggle-container" v-voix="'Toggle Flight Notification'">
              <input 
                type="checkbox" 
                :checked="notification.enabled" 
                @change="toggleAlert(notification)"
              >
              <span class="toggle-slider"></span>
            </label>
            
            <button 
              class="delete-button" 
              @click.stop="deleteAlert('flight', notification.id)"
              v-voix="'Delete Flight Notification Button'"
              hint="Delete this flight status notification"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div v-if="flightNotifications.length === 0" class="no-alerts" v-voix="'No Flight Notifications Message'">
          <p>No flight status notifications. These are automatically added when you book a flight.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alerts-view {
  padding-bottom: 5rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

h2 {
  color: #333;
  margin-bottom: 1rem;
}

.tabs-container {
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #666;
  position: relative;
}

.tab.active {
  color: #4a90e2;
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4a90e2;
}

.section {
  margin-bottom: 2.5rem;
}

.alert-form {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.price-input {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  color: #666;
}

.price-input input {
  padding-left: 1.5rem;
}

.create-alert-button {
  width: 100%;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-route, .alert-flight-number {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.alert-price {
  color: #4a90e2;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.alert-dates {
  color: #666;
  font-size: 0.9rem;
}

.alert-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-container {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-container input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #4a90e2;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.delete-button {
  background: none;
  border: none;
  color: #ff5252;
  cursor: pointer;
  font-size: 0.9rem;
}

.no-alerts {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .alert-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .alert-actions {
    width: 100%;
    justify-content: space-between;
    margin-top: 1rem;
  }
}
</style>