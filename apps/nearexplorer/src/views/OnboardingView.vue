<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const step = ref(1)
const totalSteps = 3

// User preference data
const userData = ref({
  locationPermission: false,
  interests: [],
  transportModes: []
})

// Available interest categories
const availableInterests = [
  { id: 'food', name: 'Restaurants & Cafés', icon: '🍽️' },
  { id: 'culture', name: 'Museums & Culture', icon: '🏛️' },
  { id: 'nature', name: 'Parks & Nature', icon: '🌳' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
  { id: 'sports', name: 'Sports & Recreation', icon: '⚽' },
  { id: 'nightlife', name: 'Nightlife', icon: '🍸' },
  { id: 'historic', name: 'Historic Sites', icon: '🏰' }
]

// Available transport modes
const availableTransportModes = [
  { id: 'walking', name: 'Walking', icon: '🚶' },
  { id: 'biking', name: 'Biking', icon: '🚲' },
  { id: 'driving', name: 'Driving', icon: '🚗' },
  { id: 'transit', name: 'Public Transit', icon: '🚌' }
]

function requestLocationPermission() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => {
        userData.value.locationPermission = true
        nextStep()
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Location access is required for this app to function properly.')
      }
    )
  } else {
    alert('Geolocation is not supported by your browser.')
  }
}

function toggleInterest(interestId) {
  const index = userData.value.interests.indexOf(interestId)
  if (index === -1) {
    userData.value.interests.push(interestId)
  } else {
    userData.value.interests.splice(index, 1)
  }
}

function toggleTransportMode(modeId) {
  const index = userData.value.transportModes.indexOf(modeId)
  if (index === -1) {
    userData.value.transportModes.push(modeId)
  } else {
    userData.value.transportModes.splice(index, 1)
  }
}

function nextStep() {
  if (step.value < totalSteps) {
    step.value++
  } else {
    completeOnboarding()
  }
}

function prevStep() {
  if (step.value > 1) {
    step.value--
  }
}

function completeOnboarding() {
  // Save user preferences to localStorage
  localStorage.setItem('nearexplorer-user-preferences', JSON.stringify(userData.value))
  localStorage.setItem('nearexplorer-onboarding-completed', 'true')
  
  // Navigate to explore page
  router.push('/explore')
}
</script>

<template>
  <div class="onboarding-container">
    <div class="progress-bar">
      <div 
        class="progress-indicator" 
        :style="{ width: `${(step / totalSteps) * 100}%` }"
      ></div>
    </div>
    
    <!-- Step 1: Location Permission -->
    <div v-if="step === 1" class="onboarding-step">
      <h2>Enable Location</h2>
      <p>NearExplorer needs access to your location to show you interesting places nearby.</p>
      
      <div class="location-illustration">
        <div class="map-placeholder"></div>
        <div class="location-pin"></div>
      </div>
      
      <button 
        class="btn btn-primary" 
        @click="requestLocationPermission"
        v-voix="'allow-location'"
        hint="Button to grant location access">
        Allow Location Access
      </button>
    </div>
    
    <!-- Step 2: Interests Selection -->
    <div v-if="step === 2" class="onboarding-step">
      <h2>What are you interested in?</h2>
      <p>Select categories you enjoy to get personalized recommendations.</p>
      
      <div class="interests-grid">
        <div 
          v-for="interest in availableInterests" 
          :key="interest.id"
          class="interest-item"
          :class="{ 'selected': userData.interests.includes(interest.id) }"
          @click="toggleInterest(interest.id)"
          v-voix="'interest-' + interest.id"
          :hint="`Select interest: ${interest.name}`"
        >
          <div class="interest-icon">{{ interest.icon }}</div>
          <div class="interest-name">{{ interest.name }}</div>
        </div>
      </div>
      
      <div class="step-buttons">
        <button 
          class="btn btn-secondary" 
          @click="prevStep"
          v-voix="'back-button'"
          hint="Go back to previous step">
          Back
        </button>
        <button 
          class="btn btn-primary" 
          @click="nextStep"
          v-voix="'next-button'"
          hint="Continue to next step">
          Next
        </button>
      </div>
    </div>
    
    <!-- Step 3: Transport Modes -->
    <div v-if="step === 3" class="onboarding-step">
      <h2>How do you get around?</h2>
      <p>Select your preferred modes of transportation.</p>
      
      <div class="transport-grid">
        <div 
          v-for="mode in availableTransportModes" 
          :key="mode.id"
          class="transport-item"
          :class="{ 'selected': userData.transportModes.includes(mode.id) }"
          @click="toggleTransportMode(mode.id)"
          v-voix="'transport-' + mode.id"
          :hint="`Select transport mode: ${mode.name}`"
        >
          <div class="transport-icon">{{ mode.icon }}</div>
          <div class="transport-name">{{ mode.name }}</div>
        </div>
      </div>
      
      <div class="step-buttons">
        <button 
          class="btn btn-secondary" 
          @click="prevStep"
          v-voix="'back-button'"
          hint="Go back to previous step">
          Back
        </button>
        <button 
          class="btn btn-success" 
          @click="completeOnboarding"
          v-voix="'finish-button'"
          hint="Complete onboarding and start exploring">
          Start Exploring
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.progress-bar {
  height: 6px;
  background-color: #ecf0f1;
  border-radius: 3px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress-indicator {
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease;
}

.onboarding-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.onboarding-step h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.onboarding-step p {
  color: #7f8c8d;
  margin-bottom: 2rem;
  max-width: 500px;
}

/* Location step */
.location-illustration {
  position: relative;
  width: 250px;
  height: 250px;
  margin-bottom: 2rem;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background-color: #ecf0f1;
  border-radius: 50%;
  background-image: radial-gradient(circle, #dfe6e9 0%, #b2bec3 100%);
}

.location-pin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background-color: #e74c3c;
  border-radius: 50% 50% 50% 0;
  transform: translate(-50%, -50%) rotate(-45deg);
  animation: pulse 1.5s infinite;
}

.location-pin:after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  background-color: white;
  border-radius: 50%;
  top: 8px;
  left: 8px;
}

/* Interests grid */
.interests-grid, .transport-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-bottom: 2rem;
}

.interest-item, .transport-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.interest-item:hover, .transport-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.interest-item.selected, .transport-item.selected {
  background-color: #e0f2fe;
  border: 2px solid #3498db;
}

.interest-icon, .transport-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.step-buttons {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) rotate(-45deg) scale(1); }
  50% { transform: translate(-50%, -50%) rotate(-45deg) scale(1.2); }
  100% { transform: translate(-50%, -50%) rotate(-45deg) scale(1); }
}

@media (max-width: 600px) {
  .interests-grid, .transport-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .onboarding-step h2 {
    font-size: 1.5rem;
  }
}
</style>