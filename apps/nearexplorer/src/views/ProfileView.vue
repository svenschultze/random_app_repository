<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userPreferences = ref(null)
const favoriteLocations = ref([])
const mapContainer = ref(null)
const map = ref(null)
const editMode = ref(false)
const selectedInterests = ref([])
const selectedTransportModes = ref([])

// No Mapbox token needed for our mock implementation

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

// Initialize profile data
function loadProfileData() {
  // Get user preferences from localStorage
  const storedPreferences = localStorage.getItem('nearexplorer-user-preferences')
  if (storedPreferences) {
    userPreferences.value = JSON.parse(storedPreferences)
    selectedInterests.value = [...userPreferences.value.interests]
    selectedTransportModes.value = [...userPreferences.value.transportModes]
  } else {
    // Default preferences
    userPreferences.value = {
      locationPermission: false,
      interests: ['food', 'nature'],
      transportModes: ['walking', 'driving']
    }
    selectedInterests.value = [...userPreferences.value.interests]
    selectedTransportModes.value = [...userPreferences.value.transportModes]
  }
  
  // Get favorite locations from localStorage
  const storedFavorites = localStorage.getItem('nearexplorer-favorites')
  if (storedFavorites) {
    favoriteLocations.value = JSON.parse(storedFavorites)
  }
  
  // Initialize map if we have favorites
  if (favoriteLocations.value.length > 0) {
    initializeMap()
  }
}

// Function to initialize map (mock version)
function initializeMap() {
  if (!mapContainer.value) return
  
  // Create mock map interface
  const mockMap = document.createElement('div')
  mockMap.className = 'mock-map'
  mockMap.innerHTML = `
    <div class="mock-map-overlay">
      <div class="mock-map-label">Favorite Locations Map</div>
      <div class="mock-map-controls">
        <button class="mock-control mock-zoom-in">+</button>
        <button class="mock-control mock-zoom-out">-</button>
      </div>
    </div>
    <div class="mock-map-background"></div>
  `
  
  // Clear and append to container
  if (mapContainer.value.firstChild) {
    mapContainer.value.innerHTML = ''
  }
  mapContainer.value.appendChild(mockMap)
  
  // Add markers for favorite locations
  addFavoriteMarkers()
  
  // Create mock map object
  map.value = {
    loaded: () => true
  }
}

// Function to add favorite location markers to map (mock version)
function addFavoriteMarkers() {
  if (!favoriteLocations.value.length) return
  
  // Get the mock map background
  const mockMapBg = document.querySelector('.mock-map-background')
  if (!mockMapBg) return
  
  // Clear existing markers
  mockMapBg.innerHTML = ''
  
  // Create a mock markers container
  const markersContainer = document.createElement('div')
  markersContainer.className = 'mock-markers-container'
  
  // Add markers for each favorite location
  favoriteLocations.value.forEach((location, index) => {
    // Create custom marker element with evenly distributed positions
    const el = document.createElement('div')
    el.className = 'favorite-marker'
    
    // Distribute markers in a circle pattern
    const angle = (index / favoriteLocations.value.length) * 2 * Math.PI
    const radius = 35 // % from center
    const centerX = 50
    const centerY = 50
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    
    el.style.left = `${x}%`
    el.style.top = `${y}%`
    
    el.innerHTML = `
      <div class="marker-content">
        <div class="marker-icon">${getCategoryIcon(location.category)}</div>
      </div>
    `
    
    // Add click event
    el.addEventListener('click', () => {
      viewPOIDetails(location.id)
    })
    
    markersContainer.appendChild(el)
  })
  
  // Add markers to map
  mockMapBg.appendChild(markersContainer)
}

// Helper to get icon based on category
function getCategoryIcon(category) {
  const icons = {
    'food': '🍽️',
    'culture': '🏛️',
    'nature': '🌳',
    'shopping': '🛍️',
    'entertainment': '🎭',
    'sports': '⚽',
    'nightlife': '🍸',
    'historic': '🏰'
  }
  return icons[category] || '📍'
}

// Function to toggle edit mode
function toggleEditMode() {
  editMode.value = !editMode.value
  
  if (!editMode.value && hasPreferencesChanged.value) {
    saveUserPreferences()
  }
}

// Function to toggle interest selection
function toggleInterest(interestId) {
  if (!editMode.value) return
  
  const index = selectedInterests.value.indexOf(interestId)
  if (index === -1) {
    selectedInterests.value.push(interestId)
  } else {
    selectedInterests.value.splice(index, 1)
  }
}

// Function to toggle transport mode
function toggleTransportMode(modeId) {
  if (!editMode.value) return
  
  const index = selectedTransportModes.value.indexOf(modeId)
  if (index === -1) {
    selectedTransportModes.value.push(modeId)
  } else {
    selectedTransportModes.value.splice(index, 1)
  }
}

// Function to save user preferences
function saveUserPreferences() {
  userPreferences.value.interests = [...selectedInterests.value]
  userPreferences.value.transportModes = [...selectedTransportModes.value]
  
  localStorage.setItem('nearexplorer-user-preferences', JSON.stringify(userPreferences.value))
  alert('Your preferences have been updated!')
}

// Function to view POI details
function viewPOIDetails(poiId) {
  router.push(`/poi/${poiId}`)
}

// Function to remove a favorite location
function removeFavorite(locationId) {
  favoriteLocations.value = favoriteLocations.value.filter(location => location.id !== locationId)
  localStorage.setItem('nearexplorer-favorites', JSON.stringify(favoriteLocations.value))
  
  // Reinitialize map if there are still favorites
  if (favoriteLocations.value.length > 0 && map.value) {
    map.value.remove()
    initializeMap()
  }
}

// Function to start a new exploration
function startNewExploration() {
  router.push('/explore')
}

// Function to reset onboarding
function resetOnboarding() {
  if (confirm('This will reset your onboarding preferences. Continue?')) {
    localStorage.removeItem('nearexplorer-onboarding-completed')
    localStorage.removeItem('nearexplorer-user-preferences')
    router.push('/')
  }
}

// Check if preferences have changed
const hasPreferencesChanged = computed(() => {
  if (!userPreferences.value) return false
  
  const interestsDiff = selectedInterests.value.some(i => !userPreferences.value.interests.includes(i)) ||
                       userPreferences.value.interests.some(i => !selectedInterests.value.includes(i))
  
  const transportDiff = selectedTransportModes.value.some(t => !userPreferences.value.transportModes.includes(t)) ||
                       userPreferences.value.transportModes.some(t => !selectedTransportModes.value.includes(t))
  
  return interestsDiff || transportDiff
})

// Initialize on component mount
onMounted(() => {
  loadProfileData()
})
</script>

<template>
  <div class="profile-container">
    <h1 class="profile-title">Your Profile</h1>
    
    <!-- User Preferences Section -->
    <section class="profile-section">
      <div class="section-header">
        <h2 v-voix="'preferences-section'">Your Preferences</h2>
        <button 
          class="btn btn-secondary" 
          @click="toggleEditMode"
          v-voix="'edit-preferences'"
          hint="Toggle preference editing mode">
          {{ editMode ? 'Save Changes' : 'Edit Preferences' }}
        </button>
      </div>
      
      <!-- Interests -->
      <div class="preferences-group">
        <h3>Interests</h3>
        <div class="interests-grid">
          <div 
            v-for="interest in availableInterests" 
            :key="interest.id"
            class="interest-item"
            :class="{ 
              'selected': selectedInterests.includes(interest.id),
              'editable': editMode
            }"
            @click="toggleInterest(interest.id)"
            v-voix="'interest-' + interest.id"
            :hint="`${editMode ? 'Select or deselect' : 'View'} interest: ${interest.name}`"
          >
            <div class="interest-icon">{{ interest.icon }}</div>
            <div class="interest-name">{{ interest.name }}</div>
          </div>
        </div>
      </div>
      
      <!-- Transport Modes -->
      <div class="preferences-group">
        <h3>Transport Modes</h3>
        <div class="transport-grid">
          <div 
            v-for="mode in availableTransportModes" 
            :key="mode.id"
            class="transport-item"
            :class="{ 
              'selected': selectedTransportModes.includes(mode.id),
              'editable': editMode
            }"
            @click="toggleTransportMode(mode.id)"
            v-voix="'transport-' + mode.id"
            :hint="`${editMode ? 'Select or deselect' : 'View'} transport mode: ${mode.name}`"
          >
            <div class="transport-icon">{{ mode.icon }}</div>
            <div class="transport-name">{{ mode.name }}</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Favorite Locations Section -->
    <section class="profile-section">
      <h2 v-voix="'favorites-section'">Favorite Places</h2>
      
      <div v-if="favoriteLocations.length > 0">
        <!-- Map of favorites -->
        <div ref="mapContainer" class="favorites-map"></div>
        
        <!-- List of favorites -->
        <div class="favorites-list">
          <div 
            v-for="location in favoriteLocations" 
            :key="location.id"
            class="favorite-item"
          >
            <div class="favorite-info" @click="viewPOIDetails(location.id)">
              <div class="favorite-icon">{{ getCategoryIcon(location.category) }}</div>
              <div class="favorite-name">{{ location.name }}</div>
              <div class="favorite-category">{{ location.category }}</div>
            </div>
            <button 
              class="remove-favorite-btn"
              @click="removeFavorite(location.id)"
              v-voix="'remove-favorite-' + location.id"
              hint="Remove this location from favorites">
              ×
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-favorites">
        <p>You haven't saved any favorite places yet.</p>
        <button 
          class="btn btn-primary" 
          @click="startNewExploration"
          v-voix="'start-exploring'"
          hint="Begin exploring nearby places">
          Start Exploring
        </button>
      </div>
    </section>
    
    <!-- Account Actions -->
    <section class="profile-section">
      <h2 v-voix="'account-section'">Account</h2>
      
      <div class="account-actions">
        <button 
          class="btn btn-secondary" 
          @click="resetOnboarding"
          v-voix="'reset-onboarding'"
          hint="Reset your onboarding process and preferences">
          Reset Onboarding
        </button>
      </div>
      
      <p class="note">
        NearExplorer uses local storage to save your preferences and favorite locations.
        No data is sent to external servers.
      </p>
    </section>
  </div>
</template>

<style>
/* Mock map styles */
.mock-map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.mock-map-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  background-image: linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%),
                    linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
}

.mock-map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mock-map-label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.mock-map-controls {
  display: flex;
  gap: 5px;
}

.mock-control {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Mock markers container */
.mock-markers-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Map markers */
.favorite-marker {
  position: absolute;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 2;
  transform: translate(-50%, -50%);
}

.marker-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e74c3c;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 20px;
  transition: transform 0.2s;
}

.marker-content:hover {
  transform: scale(1.1);
}
</style>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.profile-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.profile-section {
  margin-bottom: 3rem;
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

/* Preferences */
.preferences-group {
  margin-bottom: 2rem;
}

.preferences-group h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.interests-grid, .transport-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.interest-item, .transport-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.interest-item.editable, .transport-item.editable {
  cursor: pointer;
}

.interest-item.editable:hover, .transport-item.editable:hover {
  background-color: #ecf0f1;
}

.interest-item.selected, .transport-item.selected {
  background-color: #e0f2fe;
  border: 2px solid #3498db;
}

.interest-icon, .transport-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

/* Favorites Map */
.favorites-map {
  height: 300px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.favorite-item:hover {
  background-color: #ecf0f1;
}

.favorite-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.favorite-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.favorite-name {
  font-weight: bold;
  color: #2c3e50;
  margin-right: 0.5rem;
}

.favorite-category {
  font-size: 0.875rem;
  color: #7f8c8d;
  background-color: #ecf0f1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: capitalize;
}

.remove-favorite-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background-color: #f1f1f1;
  color: #7f8c8d;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-favorite-btn:hover {
  background-color: #e74c3c;
  color: white;
}

.empty-favorites {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.empty-favorites p {
  margin-bottom: 1rem;
}

/* Account section */
.account-actions {
  margin-bottom: 1.5rem;
}

.note {
  font-size: 0.875rem;
  color: #7f8c8d;
  font-style: italic;
}

@media (max-width: 600px) {
  .interests-grid, .transport-grid {
    grid-template-columns: 1fr;
  }
  
  .favorite-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .remove-favorite-btn {
    align-self: flex-end;
    margin-top: 0.5rem;
  }
}
</style>