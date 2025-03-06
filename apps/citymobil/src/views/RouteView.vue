<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const appData = inject('appData')

// Reference to selected route
const selectedRoute = ref(null)
const showDetailedRoute = ref(false)
const loadingRoutes = ref(true)

// Timer for simulated loading
onMounted(() => {
  setTimeout(() => {
    loadingRoutes.value = false
  }, 1500)
})

// Navigate back to home
const navigateToHome = () => {
  router.push('/')
}

// Show route details
const viewRouteDetails = (route) => {
  selectedRoute.value = route
  showDetailedRoute.value = true
}

// Navigate to ticket page from route details
const buyTicketForRoute = () => {
  router.push('/tickets')
}
</script>

<template>
  <div class="route-view">
    <button 
      class="back-button" 
      @click="navigateToHome" 
      v-voix="'back-to-home'"
      hint="Zurück zur Startseite">
      ← Zurück
    </button>

    <div class="container">
      <h1 v-voix="'route-planning-title'">Route planen</h1>
      
      <!-- Loading screen -->
      <div v-if="loadingRoutes" class="loading-container">
        <div class="loading-animation">
          <div class="loading-icon">🚆</div>
          <div class="loading-bar">
            <div class="loading-progress"></div>
          </div>
        </div>
        <p>Suche nach den besten Verbindungen...</p>
      </div>
      
      <!-- Main routes display -->
      <div v-else class="routes-container" v-voix="'found-routes-list'" hint="Liste der gefundenen Routen">
        <p class="routes-intro">Wir haben folgende Verbindungen für dich gefunden:</p>
        
        <!-- Route options -->
        <div 
          v-for="(segment, index) in appData.routes" 
          :key="index"
          class="route-card"
          :class="{ 'with-delay': segment.delay > 5 }"
          @click="viewRouteDetails(segment)"
          v-voix="'route-option-' + index"
          :hint="`Route von ${segment.from} nach ${segment.to} mit ${segment.transportType} ${segment.lineNumber}. Reisezeit: ${segment.travelTime} Minuten.`">
          
          <div class="route-info">
            <div class="route-cities">
              <div class="city-from">{{ segment.from }}</div>
              <div class="route-arrow">→</div>
              <div class="city-to">{{ segment.to }}</div>
            </div>
            
            <div class="transport-info">
              <span class="transport-icon" :style="{ color: segment.transportColor }">{{ segment.transportIcon }}</span>
              <span class="transport-type">{{ segment.transportType }} {{ segment.lineNumber }}</span>
              <span class="departure-time">{{ segment.departureTime }} Uhr</span>
            </div>
            
            <div class="time-info">
              <div class="travel-time">{{ segment.travelTime }} Min</div>
              <div v-if="segment.delay > 0" class="delay-info">
                +{{ segment.delay }} Min Verspätung
              </div>
            </div>
          </div>
          
          <div class="route-cta">
            <span class="route-details-prompt">Details anzeigen</span>
          </div>
        </div>
        
        <p class="route-info-tip">Tipp: Wir aktualisieren Verspätungen automatisch in Echtzeit.</p>
      </div>
      
      <!-- Detailed route view (slide-in) -->
      <div class="route-details" :class="{ 'show': showDetailedRoute }">
        <div class="route-details-header">
          <button 
            class="close-details" 
            @click="showDetailedRoute = false"
            v-voix="'close-route-details'"
            hint="Routendetails schließen">
            ×
          </button>
          <h2 v-if="selectedRoute">Verbindung: {{ selectedRoute.from }} - {{ selectedRoute.to }}</h2>
        </div>
        
        <div v-if="selectedRoute" class="route-details-content">
          <div class="detail-section">
            <h3>Abfahrt</h3>
            <div class="detail-item">
              <span class="detail-label">Von:</span>
              <span class="detail-value">{{ selectedRoute.from }} Hauptbahnhof</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Zeit:</span>
              <span class="detail-value">{{ selectedRoute.departureTime }} Uhr</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Gleis:</span>
              <span class="detail-value">{{ Math.floor(Math.random() * 20) + 1 }}</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Ankunft</h3>
            <div class="detail-item">
              <span class="detail-label">In:</span>
              <span class="detail-value">{{ selectedRoute.to }} Hauptbahnhof</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Zeit:</span>
              <span class="detail-value">
                {{ 
                  (() => {
                    const [hours, minutes] = selectedRoute.departureTime.split(':').map(Number);
                    const totalMinutes = hours * 60 + minutes + selectedRoute.travelTime + selectedRoute.delay;
                    const newHours = Math.floor(totalMinutes / 60) % 24;
                    const newMinutes = totalMinutes % 60;
                    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
                  })()
                }} Uhr
              </span>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Verbindung</h3>
            <div class="detail-item">
              <span class="detail-label">Verkehrsmittel:</span>
              <span class="detail-value">
                <span class="transport-icon" :style="{ color: selectedRoute.transportColor }">
                  {{ selectedRoute.transportIcon }}
                </span>
                {{ selectedRoute.transportType }} {{ selectedRoute.lineNumber }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Reisezeit:</span>
              <span class="detail-value">{{ selectedRoute.travelTime }} Minuten</span>
            </div>
            <div v-if="selectedRoute.delay > 0" class="detail-item">
              <span class="detail-label">Verspätung:</span>
              <span class="detail-value delay">+{{ selectedRoute.delay }} Minuten</span>
            </div>
          </div>
          
          <button 
            class="btn btn-primary buy-ticket-button" 
            @click="buyTicketForRoute"
            v-voix="'buy-ticket-for-route'"
            hint="Ticket für diese Verbindung kaufen">
            Ticket für diese Verbindung kaufen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.route-view {
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
  max-width: 800px;
  margin: 0 auto;
  padding-top: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #007bff;
}

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

.routes-intro {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: #495057;
}

.route-card {
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

.route-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.route-card.with-delay {
  border-left: 4px solid #fd7e14;
}

.route-info {
  flex: 1;
}

.route-cities {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.2rem;
}

.route-arrow {
  margin: 0 1rem;
  color: #6c757d;
}

.transport-info {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.transport-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.transport-type {
  margin-right: 1rem;
  font-weight: 500;
}

.departure-time {
  color: #6c757d;
}

.time-info {
  display: flex;
  align-items: center;
}

.travel-time {
  font-weight: 600;
  margin-right: 1rem;
}

.delay-info {
  color: #fd7e14;
  font-weight: 500;
}

.route-cta {
  color: #007bff;
  font-weight: 500;
}

.route-info-tip {
  text-align: center;
  margin-top: 2rem;
  color: #6c757d;
  font-style: italic;
}

/* Detailed route view */
.route-details {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background-color: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 2rem;
  overflow-y: auto;
  transition: right 0.3s ease;
}

.route-details.show {
  right: 0;
}

.route-details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.close-details {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  margin-bottom: 1rem;
  color: #007bff;
  font-size: 1.2rem;
}

.detail-item {
  display: flex;
  margin-bottom: 0.5rem;
}

.detail-label {
  flex: 0 0 120px;
  color: #6c757d;
}

.detail-value {
  font-weight: 500;
}

.detail-value.delay {
  color: #fd7e14;
}

.buy-ticket-button {
  width: 100%;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .route-details {
    width: 100%;
    right: -100%;
  }
}
</style>