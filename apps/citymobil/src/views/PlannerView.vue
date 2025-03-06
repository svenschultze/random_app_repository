<script setup>
import { ref, reactive, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { generateCustomRoute } from '../utils/mockData'

const router = useRouter()

// Get German cities from mock data
const germanCities = [
  'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 
  'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen', 'Bremen', 'Dresden'
];

// Form inputs
const routeForm = reactive({
  fromCity: '',
  toCity: '',
  date: '',
  time: '12:00'
})

// Autocomplete suggestions
const fromSuggestions = ref([])
const toSuggestions = ref([])
const showFromSuggestions = ref(false)
const showToSuggestions = ref(false)

// Routes results
const customRoutes = ref([])
const isLoading = ref(false)
const hasSearched = ref(false)

// Date formatting for the date picker
const today = new Date()
const formattedToday = today.toISOString().split('T')[0]

// Selected route for details view
const selectedRoute = ref(null)
const showRouteDetails = ref(false)

// Filter cities based on input
const filterCities = (input, exclude = '') => {
  if (!input) return []
  input = input.toLowerCase()
  return germanCities
    .filter(city => city.toLowerCase().includes(input) && city !== exclude)
    .slice(0, 5)
}

// Watch for input changes to update suggestions
const updateFromSuggestions = () => {
  fromSuggestions.value = filterCities(routeForm.fromCity, routeForm.toCity)
  showFromSuggestions.value = fromSuggestions.value.length > 0
}

const updateToSuggestions = () => {
  toSuggestions.value = filterCities(routeForm.toCity, routeForm.fromCity)
  showToSuggestions.value = toSuggestions.value.length > 0
}

// Select suggestion
const selectFromSuggestion = (city) => {
  routeForm.fromCity = city
  showFromSuggestions.value = false
}

const selectToSuggestion = (city) => {
  routeForm.toCity = city
  showToSuggestions.value = false
}

// Search for routes
const searchRoutes = () => {
  if (!routeForm.fromCity || !routeForm.toCity) {
    return
  }
  
  isLoading.value = true
  hasSearched.value = true
  
  // Simulate network delay
  setTimeout(() => {
    customRoutes.value = generateCustomRoute(routeForm.fromCity, routeForm.toCity)
    isLoading.value = false
  }, 1500)
}

// Select a route for detailed view
const viewRouteDetails = (route) => {
  selectedRoute.value = route
  showRouteDetails.value = true
}

// Close route details
const closeRouteDetails = () => {
  showRouteDetails.value = false
}

// Navigate back to home
const navigateToHome = () => {
  router.push('/')
}

// Navigate to tickets page
const buyTicket = (route) => {
  router.push('/tickets')
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'Heute'
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('de-DE', options)
}

// Format total time display
const formatTotalTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours} Std ${mins} Min`
  }
  
  return `${mins} Min`
}

// Switch departure and arrival cities
const switchCities = () => {
  const temp = routeForm.fromCity
  routeForm.fromCity = routeForm.toCity
  routeForm.toCity = temp
  
  if (hasSearched.value) {
    searchRoutes()
  }
}

// On component load
onMounted(() => {
  // Set today's date as default
  routeForm.date = formattedToday
})
</script>

<template>
  <div class="planner-view">
    <button 
      class="back-button" 
      @click="navigateToHome" 
      v-voix="'back-to-home-from-planner'"
      hint="Zurück zur Startseite">
      ← Zurück
    </button>

    <div class="container">
      <h1 v-voix="'route-planner-title'">Routenplaner</h1>
      
      <div class="route-form-container">
        <div class="route-form">
          <div class="form-row">
            <div class="form-group from-group">
              <label for="fromCity" v-voix="'from-city-label'">Von:</label>
              <div class="input-with-suggestions">
                <input 
                  type="text" 
                  id="fromCity" 
                  class="form-control" 
                  v-model="routeForm.fromCity" 
                  @input="updateFromSuggestions"
                  @focus="updateFromSuggestions"
                  @blur="setTimeout(() => showFromSuggestions = false, 200)"
                  placeholder="Startstadt eingeben"
                  v-voix="'from-city-input'"
                  hint="Geben Sie Ihre Abfahrtsstadt ein">
                
                <div class="suggestions" v-if="showFromSuggestions">
                  <div 
                    v-for="city in fromSuggestions" 
                    :key="city" 
                    class="suggestion-item"
                    @click="selectFromSuggestion(city)"
                    v-voix="'from-suggestion-' + city"
                    :hint="`Vorschlag: ${city} als Abfahrtsort auswählen`">
                    {{ city }}
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              class="switch-button" 
              @click="switchCities"
              v-voix="'switch-cities'"
              hint="Abfahrts- und Ankunftsort tauschen">
              ⇄
            </button>
            
            <div class="form-group to-group">
              <label for="toCity" v-voix="'to-city-label'">Nach:</label>
              <div class="input-with-suggestions">
                <input 
                  type="text" 
                  id="toCity" 
                  class="form-control" 
                  v-model="routeForm.toCity" 
                  @input="updateToSuggestions"
                  @focus="updateToSuggestions"
                  @blur="setTimeout(() => showToSuggestions = false, 200)"
                  placeholder="Zielstadt eingeben"
                  v-voix="'to-city-input'"
                  hint="Geben Sie Ihre Zielstadt ein">
                
                <div class="suggestions" v-if="showToSuggestions">
                  <div 
                    v-for="city in toSuggestions" 
                    :key="city" 
                    class="suggestion-item"
                    @click="selectToSuggestion(city)"
                    v-voix="'to-suggestion-' + city"
                    :hint="`Vorschlag: ${city} als Ankunftsort auswählen`">
                    {{ city }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-row date-time-row">
            <div class="form-group">
              <label for="date" v-voix="'date-label'">Datum:</label>
              <input 
                type="date" 
                id="date" 
                class="form-control" 
                v-model="routeForm.date"
                :min="formattedToday"
                v-voix="'date-input'"
                hint="Wählen Sie das Reisedatum">
            </div>
            
            <div class="form-group">
              <label for="time" v-voix="'time-label'">Uhrzeit:</label>
              <input 
                type="time" 
                id="time" 
                class="form-control" 
                v-model="routeForm.time"
                v-voix="'time-input'"
                hint="Wählen Sie die Abfahrtszeit">
            </div>
          </div>
          
          <button 
            class="btn btn-primary search-button" 
            @click="searchRoutes"
            :disabled="!routeForm.fromCity || !routeForm.toCity"
            v-voix="'search-routes'"
            hint="Suche nach Verbindungen starten">
            Verbindungen suchen
          </button>
        </div>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-animation">
          <div class="loading-icon">🚆</div>
          <div class="loading-bar">
            <div class="loading-progress"></div>
          </div>
        </div>
        <p>Suche nach den besten Verbindungen...</p>
      </div>
      
      <!-- No routes found -->
      <div v-else-if="hasSearched && customRoutes.length === 0" class="no-routes">
        <div class="no-routes-icon">🔍</div>
        <h3>Keine Verbindungen gefunden</h3>
        <p>Bitte versuchen Sie es mit anderen Städten oder zu einem anderen Zeitpunkt.</p>
      </div>
      
      <!-- Routes results -->
      <div v-else-if="!isLoading && hasSearched" class="routes-results">
        <h2 v-voix="'found-connections-title'">Verbindungen: {{ routeForm.fromCity }} → {{ routeForm.toCity }}</h2>
        <p class="travel-date">{{ formatDate(routeForm.date) }}, ab {{ routeForm.time }} Uhr</p>
        
        <div 
          v-for="route in customRoutes" 
          :key="route.id"
          class="route-option"
          @click="viewRouteDetails(route)"
          v-voix="'route-option-' + route.id"
          :hint="`Route ${route.id} mit ${route.segments.length} Teilstrecken. Gesamtzeit: ${formatTotalTime(route.totalTime)}, Preis: ${route.totalPrice} Euro.`">
          
          <div class="route-overview">
            <div class="route-time-price">
              <div class="route-time">{{ formatTotalTime(route.totalTime) }}</div>
              <div class="route-price">{{ route.totalPrice }} €</div>
            </div>
            
            <div class="route-segments">
              <div class="route-cities">
                <span>{{ route.segments[0].from }}</span>
                <span class="route-arrow">→</span>
                <span>{{ route.segments[route.segments.length - 1].to }}</span>
              </div>
              
              <div class="transport-types">
                <div 
                  v-for="(segment, idx) in route.segments" 
                  :key="idx" 
                  class="transport-pill"
                  :style="{ backgroundColor: segment.transportColor + '20', color: segment.transportColor }">
                  {{ segment.transportIcon }} {{ segment.lineNumber }}
                </div>
              </div>
            </div>
            
            <div class="route-eco-info">
              <div class="eco-badge">
                <span class="eco-icon">🌱</span>
                <span>{{ route.co2Savings }}% CO₂-Einsparung</span>
              </div>
            </div>
          </div>
          
          <div class="route-action">
            <span class="view-details">Details anzeigen</span>
          </div>
        </div>
      </div>
      
      <!-- Route details side panel -->
      <div class="route-details-panel" :class="{ 'show': showRouteDetails }">
        <div class="panel-header">
          <button 
            class="close-panel" 
            @click="closeRouteDetails"
            v-voix="'close-route-details'"
            hint="Routendetails schließen">
            ×
          </button>
          <h3 v-if="selectedRoute">Verbindungsdetails</h3>
        </div>
        
        <div v-if="selectedRoute" class="panel-content">
          <div class="route-summary">
            <div class="route-summary-cities">
              <div class="summary-from">{{ selectedRoute.segments[0].from }}</div>
              <div class="summary-arrow">→</div>
              <div class="summary-to">{{ selectedRoute.segments[selectedRoute.segments.length - 1].to }}</div>
            </div>
            
            <div class="route-summary-info">
              <div class="summary-time">
                <span class="info-label">Reisezeit:</span>
                <span class="info-value">{{ formatTotalTime(selectedRoute.totalTime) }}</span>
              </div>
              <div class="summary-price">
                <span class="info-label">Preis:</span>
                <span class="info-value">{{ selectedRoute.totalPrice }} €</span>
              </div>
            </div>
            
            <div class="route-date-time">
              <span>{{ formatDate(routeForm.date) }}</span>
              <span>{{ routeForm.time }} Uhr</span>
            </div>
          </div>
          
          <div class="segments-timeline">
            <div 
              v-for="(segment, index) in selectedRoute.segments" 
              :key="index"
              class="timeline-segment">
              
              <div class="timeline-dot" :style="{ backgroundColor: segment.transportColor }"></div>
              
              <div class="timeline-content">
                <div class="segment-station">
                  <div class="station-time">{{ segment.departureTime }}</div>
                  <div class="station-name">{{ segment.from }}</div>
                </div>
                
                <div class="segment-transport" :style="{ color: segment.transportColor }">
                  <div class="transport-icon-line">{{ segment.transportIcon }}</div>
                  <div class="transport-line"></div>
                  <div class="transport-info">
                    {{ segment.transportType }} {{ segment.lineNumber }} ・ {{ segment.travelTime }} Min
                    <span v-if="segment.delay > 0" class="delay-info">(+{{ segment.delay }} Min Verspätung)</span>
                  </div>
                </div>
                
                <div class="segment-station" v-if="index === selectedRoute.segments.length - 1">
                  <div class="station-time">
                    {{ 
                      (() => {
                        const [hours, minutes] = segment.departureTime.split(':').map(Number);
                        const totalMinutes = hours * 60 + minutes + segment.travelTime + segment.delay;
                        const newHours = Math.floor(totalMinutes / 60) % 24;
                        const newMinutes = totalMinutes % 60;
                        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
                      })()
                    }}
                  </div>
                  <div class="station-name">{{ segment.to }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="details-eco-info">
            <div class="eco-icon">🌍</div>
            <div class="eco-text">
              Mit dieser Verbindung sparen Sie im Vergleich zur Autofahrt etwa {{ selectedRoute.co2Savings }}% CO₂-Emissionen.
            </div>
          </div>
          
          <div class="detail-actions">
            <button 
              class="btn btn-primary buy-ticket" 
              @click="buyTicket(selectedRoute)"
              v-voix="'buy-ticket-for-route'"
              hint="Ticket für diese Verbindung kaufen">
              Ticket kaufen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.planner-view {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  background-color: #f8f9fa;
}

.back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: none;
  border: none;
  color: #007bff;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding-top: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #007bff;
}

h2 {
  margin-bottom: 0.5rem;
  color: #212529;
}

/* Route search form */
.route-form-container {
  margin-bottom: 3rem;
}

.route-form {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.date-time-row {
  justify-content: flex-start;
}

.date-time-row .form-group {
  flex: 0 0 45%;
}

.form-group {
  flex: 1;
  position: relative;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #007bff;
  outline: none;
}

.switch-button {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  width: 40px;
  height: 40px;
  margin-bottom: 0.75rem;
  border-radius: 50%;
  border: none;
  background-color: #f1f3f5;
  color: #007bff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.switch-button:hover {
  background-color: #e9ecef;
  transform: rotate(180deg);
}

.search-button {
  width: 100%;
  padding: 0.9rem;
  font-size: 1.1rem;
}

/* Autocomplete suggestions */
.input-with-suggestions {
  position: relative;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 4px;
}

.suggestion-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: #f1f3f5;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 3rem 0;
}

.loading-animation {
  display: inline-block;
  margin-bottom: 1.5rem;
}

.loading-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: move 2s infinite ease-in-out;
}

.loading-bar {
  height: 8px;
  width: 200px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  width: 50%;
  background-color: #007bff;
  border-radius: 4px;
  animation: progress 1.5s infinite ease-in-out;
}

@keyframes move {
  0%, 100% {
    transform: translateX(-20px);
  }
  50% {
    transform: translateX(20px);
  }
}

@keyframes progress {
  0% {
    width: 0%;
    transform: translateX(0%);
  }
  50% {
    width: 50%;
  }
  100% {
    width: 0%;
    transform: translateX(400%);
  }
}

/* No routes found */
.no-routes {
  text-align: center;
  padding: 3rem 0;
}

.no-routes-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #6c757d;
}

/* Routes results */
.routes-results {
  margin-top: 2rem;
}

.travel-date {
  color: #6c757d;
  margin-bottom: 2rem;
}

.route-option {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.route-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.route-overview {
  flex: 1;
}

.route-time-price {
  display: flex;
  margin-bottom: 1rem;
}

.route-time {
  font-weight: 600;
  font-size: 1.2rem;
  margin-right: 1.5rem;
}

.route-price {
  font-weight: 700;
  color: #007bff;
  font-size: 1.2rem;
}

.route-cities {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.route-arrow {
  margin: 0 0.75rem;
  color: #6c757d;
}

.transport-types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.transport-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
}

.route-eco-info {
  margin-top: 1rem;
}

.eco-badge {
  display: inline-flex;
  align-items: center;
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
}

.eco-icon {
  margin-right: 0.4rem;
}

.route-action {
  color: #007bff;
  font-weight: 500;
}

/* Route details panel */
.route-details-panel {
  position: fixed;
  top: 0;
  right: -450px;
  width: 450px;
  height: 100vh;
  background-color: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 2rem;
  overflow-y: auto;
  transition: right 0.3s ease;
}

.route-details-panel.show {
  right: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.close-panel {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.route-summary {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.route-summary-cities {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.2rem;
}

.summary-arrow {
  margin: 0 1rem;
  color: #6c757d;
}

.route-summary-info {
  display: flex;
  margin-bottom: 1rem;
  gap: 1.5rem;
}

.info-label {
  color: #6c757d;
  margin-right: 0.5rem;
}

.info-value {
  font-weight: 600;
}

.route-date-time {
  color: #6c757d;
  font-size: 0.9rem;
}

/* Timeline view */
.segments-timeline {
  margin-bottom: 2rem;
}

.timeline-segment {
  display: flex;
  position: relative;
}

.timeline-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-top: 0.5rem;
  margin-right: 1rem;
  z-index: 1;
}

.timeline-segment:not(:last-child) .timeline-dot::after {
  content: '';
  position: absolute;
  top: 0.75rem;
  left: 7px;
  width: 2px;
  height: calc(100% - 0.5rem);
  background-color: #dee2e6;
}

.timeline-content {
  flex: 1;
  padding-bottom: 1.5rem;
}

.segment-station {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.station-time {
  width: 60px;
  font-weight: 600;
}

.station-name {
  font-weight: 500;
}

.segment-transport {
  display: flex;
  align-items: flex-start;
  margin: 0.5rem 0 1rem;
  padding-left: 60px;
}

.transport-icon-line {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.transport-info {
  margin-left: 0.75rem;
}

.delay-info {
  color: #fd7e14;
  margin-left: 0.5rem;
}

.details-eco-info {
  display: flex;
  align-items: flex-start;
  background-color: rgba(40, 167, 69, 0.1);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.details-eco-info .eco-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.detail-actions {
  text-align: center;
}

.buy-ticket {
  width: 100%;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .switch-button {
    align-self: center;
    margin: 0.5rem 0;
    transform: rotate(90deg);
  }
  
  .switch-button:hover {
    transform: rotate(270deg);
  }
  
  .route-details-panel {
    width: 100%;
    right: -100%;
  }
  
  .date-time-row .form-group {
    flex: 1;
  }
}
</style>