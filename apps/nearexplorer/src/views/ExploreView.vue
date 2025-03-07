<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const map = ref(null)
const mapContainer = ref(null)
const userCoordinates = ref(null)
const bottomSheetVisible = ref(false)
const selectedPOI = ref(null)
const nearbyPOIs = ref([])
const activeTransportMode = ref('walking')
const loadingPOIs = ref(false)

// No Mapbox token needed for our mock implementation

// User preferences from localStorage
const userPreferences = computed(() => {
  const stored = localStorage.getItem('nearexplorer-user-preferences')
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    interests: ['food', 'nature'],
    transportModes: ['walking', 'driving']
  }
})

// Contextual factors - in real app this would be more sophisticated
const contextualFactors = computed(() => {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay() // 0 = Sunday, 6 = Saturday
  
  let timeOfDay = 'morning'
  if (hour >= 12 && hour < 17) timeOfDay = 'afternoon'
  if (hour >= 17 && hour < 21) timeOfDay = 'evening'
  if (hour >= 21 || hour < 5) timeOfDay = 'night'
  
  const isWeekend = day === 0 || day === 6
  
  return { timeOfDay, isWeekend }
})

// Mock data for POIs - in a real app, this would come from an API
// This simulates different recommendation results based on time and interests
const mockPOIData = [
  {
    id: 'p1',
    name: 'Central Park',
    category: 'nature',
    distance: 0.8,
    rating: 4.8,
    coordinates: [-73.965355, 40.782865],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%232ecc71"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🌳</text></svg>',
    bestFor: ['morning', 'afternoon'],
    description: 'A beautiful urban park with walking trails and scenic views.'
  },
  {
    id: 'p2',
    name: 'Joe\'s Coffee',
    category: 'food',
    distance: 0.3,
    rating: 4.6,
    coordinates: [-73.989308, 40.741895],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23e67e22"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">☕</text></svg>',
    bestFor: ['morning', 'afternoon'],
    description: 'Cozy café with great espresso and freshly baked pastries.'
  },
  {
    id: 'p3',
    name: 'Metropolitan Museum',
    category: 'culture',
    distance: 1.2,
    rating: 4.9,
    coordinates: [-73.963244, 40.779434],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%239b59b6"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🏛️</text></svg>',
    bestFor: ['afternoon', 'weekend'],
    description: 'World-class art museum with vast collections spanning 5,000 years.'
  },
  {
    id: 'p4',
    name: 'Night Owl Bar',
    category: 'nightlife',
    distance: 0.5,
    rating: 4.3,
    coordinates: [-74.003736, 40.743272],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%233498db"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🍸</text></svg>',
    bestFor: ['evening', 'night'],
    description: 'Hip cocktail bar with live jazz music and a relaxed atmosphere.'
  },
  {
    id: 'p5',
    name: 'Vintage Boutique',
    category: 'shopping',
    distance: 0.7,
    rating: 4.2,
    coordinates: [-73.999619, 40.722353],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f1c40f"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">👗</text></svg>',
    bestFor: ['afternoon', 'weekend'],
    description: 'Curated collection of vintage clothing and accessories from the 60s-90s.'
  },
  {
    id: 'p6',
    name: 'Riverside Park',
    category: 'nature',
    distance: 1.4,
    rating: 4.5,
    coordinates: [-73.973220, 40.803927],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%232ecc71"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🌊</text></svg>',
    bestFor: ['morning', 'afternoon', 'weekend'],
    description: 'Waterfront park with walking and biking paths along the Hudson River.'
  },
  {
    id: 'p7',
    name: 'Brooklyn Brewery',
    category: 'nightlife',
    distance: 1.8,
    rating: 4.7,
    coordinates: [-73.957560, 40.721490],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23d35400"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🍺</text></svg>',
    bestFor: ['afternoon', 'evening', 'weekend'],
    description: 'Local craft brewery offering tours, tastings, and a lively taproom environment.'
  },
  {
    id: 'p8',
    name: 'Highline Park',
    category: 'nature',
    distance: 0.9,
    rating: 4.6,
    coordinates: [-74.004889, 40.747952],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327ae60"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🌿</text></svg>',
    bestFor: ['morning', 'afternoon', 'evening'],
    description: 'Elevated linear park built on a historic freight rail line, offering unique urban views.'
  },
  {
    id: 'p9',
    name: 'Jazz Club',
    category: 'entertainment',
    distance: 0.4,
    rating: 4.4,
    coordinates: [-73.991245, 40.731256],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%238e44ad"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🎷</text></svg>',
    bestFor: ['evening', 'night'],
    description: 'Intimate jazz venue featuring nightly live performances from renowned musicians.'
  },
  {
    id: 'p10',
    name: 'Artisan Bakery',
    category: 'food',
    distance: 0.2,
    rating: 4.8,
    coordinates: [-73.984712, 40.743891],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23e67e22"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🥐</text></svg>',
    bestFor: ['morning', 'afternoon'],
    description: 'Fresh, handcrafted pastries and bread made daily using traditional techniques.'
  },
  {
    id: 'p11',
    name: 'Modern Art Gallery',
    category: 'culture',
    distance: 0.6,
    rating: 4.5,
    coordinates: [-73.977489, 40.758236],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23c0392b"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🎨</text></svg>',
    bestFor: ['afternoon', 'weekend'],
    description: 'Contemporary art museum featuring rotating exhibitions from cutting-edge artists.'
  },
  {
    id: 'p12',
    name: 'Rooftop Bar',
    category: 'nightlife',
    distance: 0.8,
    rating: 4.3,
    coordinates: [-73.968214, 40.761920],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%233498db"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🍹</text></svg>',
    bestFor: ['evening', 'night'],
    description: 'Stylish open-air lounge with craft cocktails and panoramic city views.'
  },
  {
    id: 'p13',
    name: 'Farmers Market',
    category: 'shopping',
    distance: 1.1,
    rating: 4.7,
    coordinates: [-73.990689, 40.732562],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f39c12"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🥕</text></svg>',
    bestFor: ['morning', 'weekend'],
    description: 'Local market featuring fresh produce, artisanal foods, and handcrafted goods.'
  },
  {
    id: 'p14',
    name: 'Historic Theater',
    category: 'entertainment',
    distance: 1.3,
    rating: 4.6,
    coordinates: [-73.983641, 40.759012],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23c0392b"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🎭</text></svg>',
    bestFor: ['evening', 'weekend'],
    description: 'Beautifully restored theater showcasing Broadway productions and musical performances.'
  },
  {
    id: 'p15',
    name: 'Fitness Studio',
    category: 'sports',
    distance: 0.5,
    rating: 4.4,
    coordinates: [-73.992450, 40.745123],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2316a085"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">💪</text></svg>',
    bestFor: ['morning', 'evening'],
    description: 'Boutique fitness center offering a variety of classes from yoga to high-intensity training.'
  },
  {
    id: 'p16',
    name: 'City Observatory',
    category: 'historic',
    distance: 1.7,
    rating: 4.8,
    coordinates: [-73.969891, 40.769438],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%232c3e50"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🔭</text></svg>',
    bestFor: ['night', 'weekend'],
    description: 'Historic astronomical observatory offering guided tours and stargazing events.'
  },
  {
    id: 'p17',
    name: 'Gourmet Food Hall',
    category: 'food',
    distance: 0.6,
    rating: 4.5,
    coordinates: [-73.986512, 40.742345],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23e74c3c"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🍲</text></svg>',
    bestFor: ['afternoon', 'evening'],
    description: 'Upscale food market featuring diverse culinary options from local and international vendors.'
  },
  {
    id: 'p18',
    name: 'Botanical Garden',
    category: 'nature',
    distance: 2.1,
    rating: 4.9,
    coordinates: [-73.882420, 40.865840],
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%232ecc71"/><text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" fill="white">🌸</text></svg>',
    bestFor: ['morning', 'afternoon', 'weekend'],
    description: 'Expansive gardens featuring diverse plant collections, seasonal exhibits, and educational programs.'
  }
]

// Function to initialize map (mock version)
function initializeMap() {
  if (!mapContainer.value) return
  
  // Create mock map interface
  const mockMap = document.createElement('div')
  mockMap.className = 'mock-map'
  mockMap.innerHTML = `
    <div class="mock-map-overlay">
      <div class="mock-map-label">Mock Map Interface</div>
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
  
  // Set mock location (NYC coordinates)
  userCoordinates.value = [-73.9856, 40.7484]
  
  // Simulate map load event
  setTimeout(() => {
    fetchNearbyPOIs()
  }, 1000)
  
  // Mock map object with minimal required methods
  map.value = {
    loaded: () => true,
    flyTo: (opts) => {
      console.log('Mock map flyTo:', opts)
      // Highlight the selected POI in our mock implementation
      if (selectedPOI.value) {
        const markers = document.querySelectorAll('.poi-marker')
        markers.forEach(marker => {
          marker.classList.remove('active')
        })
        const activeMarker = document.querySelector(`.poi-marker[data-id="${selectedPOI.value.id}"]`)
        if (activeMarker) {
          activeMarker.classList.add('active')
        }
      }
    }
  }
}

// Function to fetch nearby POIs
function fetchNearbyPOIs() {
  if (!userCoordinates.value) return
  
  loadingPOIs.value = true
  
  // Simulate API call delay
  setTimeout(() => {
    // Filter POIs based on user preferences and context
    const filtered = mockPOIData.filter(poi => {
      // Filter by user interests
      const matchesInterests = userPreferences.value.interests.includes(poi.category)
      
      // Filter by time context
      const matchesTimeContext = poi.bestFor.includes(contextualFactors.value.timeOfDay) || 
                                 (contextualFactors.value.isWeekend && poi.bestFor.includes('weekend'))
      
      return matchesInterests || matchesTimeContext
    })
    
    // Sort by relevance (combination of distance and contextual match)
    const sorted = filtered.sort((a, b) => {
      const aScore = a.rating / a.distance * 
                    (a.bestFor.includes(contextualFactors.value.timeOfDay) ? 2 : 1)
      const bScore = b.rating / b.distance * 
                    (b.bestFor.includes(contextualFactors.value.timeOfDay) ? 2 : 1)
      return bScore - aScore
    })
    
    nearbyPOIs.value = sorted
    
    // Add markers to map
    addPOIMarkers()
    
    loadingPOIs.value = false
  }, 1000)
}

// Function to add POI markers to map (mock version)
function addPOIMarkers() {
  if (!map.value || !nearbyPOIs.value.length) return
  
  // Get the mock map background
  const mockMapBg = document.querySelector('.mock-map-background')
  if (!mockMapBg) return
  
  // Clear existing markers
  mockMapBg.innerHTML = ''
  
  // Create a mock markers container
  const markersContainer = document.createElement('div')
  markersContainer.className = 'mock-markers-container'
  
  // Add markers for each POI with better distribution
  const numPOIs = nearbyPOIs.value.length
  
  // Create clusters of POIs based on category to simulate real-world grouping
  const clusters = {
    'food': { x: 30, y: 40, radius: 20 },
    'culture': { x: 70, y: 30, radius: 15 },
    'nature': { x: 50, y: 70, radius: 25 },
    'nightlife': { x: 80, y: 60, radius: 15 },
    'shopping': { x: 40, y: 20, radius: 10 },
    'entertainment': { x: 60, y: 50, radius: 12 },
    'sports': { x: 25, y: 60, radius: 8 },
    'historic': { x: 75, y: 75, radius: 10 }
  }
  
  // Create a map label to show the area
  const areaLabel = document.createElement('div')
  areaLabel.className = 'area-label'
  areaLabel.textContent = 'New York City'
  areaLabel.style.left = '50%'
  areaLabel.style.top = '50%'
  markersContainer.appendChild(areaLabel)
  
  // Place markers by category with some randomization within clusters
  nearbyPOIs.value.forEach((poi, index) => {
    // Create custom marker element
    const el = document.createElement('div')
    el.className = 'poi-marker'
    el.setAttribute('data-id', poi.id)
    
    // Position based on category cluster or random if no cluster
    const cluster = clusters[poi.category] || { x: 50, y: 50, radius: 30 }
    
    // Add some randomness within the cluster
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * cluster.radius
    const x = cluster.x + Math.cos(angle) * distance
    const y = cluster.y + Math.sin(angle) * distance
    
    el.style.left = `${x}%`
    el.style.top = `${y}%`
    
    // Smaller markers for more POIs to prevent overcrowding
    const scale = numPOIs > 10 ? 0.8 : 1
    el.style.transform = `translate(-50%, -50%) scale(${scale})`
    
    el.innerHTML = `
      <div class="marker-content">
        <div class="marker-icon">${getCategoryIcon(poi.category)}</div>
      </div>
    `
    
    // Add click event
    el.addEventListener('click', () => {
      selectPOI(poi)
    })
    
    markersContainer.appendChild(el)
  })
  
  // Add user location marker
  const userMarker = document.createElement('div')
  userMarker.className = 'user-location-marker'
  userMarker.innerHTML = '📍'
  userMarker.style.left = '50%'
  userMarker.style.top = '50%'
  markersContainer.appendChild(userMarker)
  
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

// Function to select a POI
function selectPOI(poi) {
  selectedPOI.value = poi
  bottomSheetVisible.value = true
  
  // Center map on selected POI with animation
  map.value.flyTo({
    center: poi.coordinates,
    zoom: 15,
    duration: 1000
  })
}

// Function to change transport mode
function setTransportMode(mode) {
  activeTransportMode.value = mode
  // In a real app, this would update the route calculation
}

// Function to view POI details
function viewPOIDetails() {
  if (selectedPOI.value) {
    router.push(`/poi/${selectedPOI.value.id}`)
  }
}

// Function to start navigation
function startNavigation() {
  // In a real app, this would initialize turn-by-turn navigation
  alert(`Starting navigation to ${selectedPOI.value.name} via ${activeTransportMode.value} mode`)
}

// Initialize on component mount
onMounted(() => {
  // In our mock version, we'll just initialize with a default location
  initializeMap()
})

// Watch for changes in transport mode to update UI
watch(activeTransportMode, () => {
  // This would update route calculation in a real app
})
</script>

<template>
  <div class="explore-view">
    <!-- Map Container -->
    <div ref="mapContainer" class="map-full-container"></div>
    
    <!-- Top Controls -->
    <div class="controls-overlay top-left">
      <button 
        class="btn btn-secondary control-btn"
        @click="router.go(-1)"
        v-voix="'back-button'"
        hint="Return to previous screen">
        ← Back
      </button>
    </div>
    
    <!-- Transport Mode Selector -->
    <div class="controls-overlay top-right">
      <div class="transport-selector">
        <button 
          class="transport-btn" 
          :class="{ active: activeTransportMode === 'walking' }"
          @click="setTransportMode('walking')"
          v-voix="'walking-mode'"
          hint="Select walking as transport mode">
          🚶
        </button>
        <button 
          class="transport-btn" 
          :class="{ active: activeTransportMode === 'biking' }"
          @click="setTransportMode('biking')"
          v-voix="'biking-mode'"
          hint="Select biking as transport mode">
          🚲
        </button>
        <button 
          class="transport-btn" 
          :class="{ active: activeTransportMode === 'driving' }"
          @click="setTransportMode('driving')"
          v-voix="'driving-mode'"
          hint="Select driving as transport mode">
          🚗
        </button>
        <button 
          class="transport-btn" 
          :class="{ active: activeTransportMode === 'transit' }"
          @click="setTransportMode('transit')"
          v-voix="'transit-mode'"
          hint="Select public transit as transport mode">
          🚌
        </button>
      </div>
    </div>
    
    <!-- POI List Panel (can be toggled) -->
    <div class="poi-list-panel">
      <div class="panel-header" v-voix="'poi-list-header'" hint="List of nearby places">
        <h3>Nearby Places</h3>
        <div v-if="contextualFactors.timeOfDay" class="context-pill">{{ contextualFactors.timeOfDay }}</div>
      </div>
      
      <div v-if="loadingPOIs" class="loading-indicator">
        <div class="spinner"></div>
        <p>Finding interesting places...</p>
      </div>
      
      <div v-else-if="nearbyPOIs.length === 0" class="empty-state">
        <p>No places found nearby. Try changing your preferences or exploring a different area.</p>
      </div>
      
      <div v-else class="poi-list">
        <div 
          v-for="poi in nearbyPOIs" 
          :key="poi.id"
          class="poi-list-item"
          :class="{ active: selectedPOI && selectedPOI.id === poi.id }"
          @click="selectPOI(poi)"
          v-voix="'poi-' + poi.id"
          :hint="`${poi.name}, ${poi.category}, ${poi.distance} miles away`"
        >
          <img :src="poi.thumbnail" alt="" class="poi-thumbnail" />
          <div class="poi-info">
            <h4>{{ poi.name }}</h4>
            <div class="poi-meta">
              <span class="category">{{ getCategoryIcon(poi.category) }} {{ poi.category }}</span>
              <span class="distance">{{ poi.distance }} mi</span>
              <span class="rating">⭐ {{ poi.rating }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bottom Sheet for Selected POI -->
    <div class="bottom-sheet" v-if="bottomSheetVisible && selectedPOI" v-voix="'poi-detail-sheet'">
      <div class="bottom-sheet-header">
        <button 
          class="close-btn" 
          @click="bottomSheetVisible = false"
          v-voix="'close-poi-sheet'"
          hint="Close this information panel">
          ×
        </button>
        <h3>{{ selectedPOI.name }}</h3>
        <div class="poi-tags">
          <span class="poi-tag">{{ getCategoryIcon(selectedPOI.category) }} {{ selectedPOI.category }}</span>
          <span class="poi-tag">⭐ {{ selectedPOI.rating }}</span>
          <span class="poi-tag">📍 {{ selectedPOI.distance }} mi</span>
        </div>
      </div>
      
      <div class="bottom-sheet-content">
        <p class="poi-description">{{ selectedPOI.description }}</p>
        
        <div class="action-buttons">
          <button 
            class="btn btn-secondary"
            @click="viewPOIDetails"
            v-voix="'view-details-button'"
            hint="View more detailed information about this place">
            More Details
          </button>
          <button 
            class="btn btn-primary"
            @click="startNavigation"
            v-voix="'start-navigation-button'"
            hint="Begin navigation to this location">
            Navigate
          </button>
        </div>
      </div>
    </div>
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
.poi-marker {
  position: absolute;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 2;
  transform: translate(-50%, -50%);
}

.poi-marker.active .marker-content {
  background-color: #e74c3c;
  transform: scale(1.2);
}

.marker-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3498db;
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

.user-location-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 30px;
  z-index: 3;
}

.area-label {
  position: absolute;
  transform: translate(-50%, -50%);
  color: rgba(52, 73, 94, 0.5);
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3px;
  pointer-events: none;
  z-index: 1;
}
</style>

<style scoped>
.explore-view {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Control overlays */
.controls-overlay {
  position: absolute;
  z-index: 1;
  margin: 10px;
}

.top-left {
  top: 10px;
  left: 10px;
}

.top-right {
  top: 10px;
  right: 10px;
}

.control-btn {
  padding: 8px 12px;
  font-size: 14px;
}

/* Transport mode selector */
.transport-selector {
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.transport-btn {
  width: 40px;
  height: 40px;
  border: none;
  background-color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.transport-btn:hover {
  background-color: #f5f5f5;
}

.transport-btn.active {
  background-color: #e0f2fe;
  color: #3498db;
}

/* POI List Panel */
.poi-list-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 300px;
  max-height: 60vh;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.panel-header {
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
}

.context-pill {
  padding: 4px 8px;
  background-color: #e0f2fe;
  color: #3498db;
  border-radius: 12px;
  font-size: 12px;
  text-transform: capitalize;
}

.poi-list {
  overflow-y: auto;
  max-height: calc(60vh - 50px);
}

.poi-list-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f1f1;
  cursor: pointer;
  transition: background-color 0.2s;
}

.poi-list-item:hover {
  background-color: #f9f9f9;
}

.poi-list-item.active {
  background-color: #e0f2fe;
}

.poi-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 12px;
  object-fit: cover;
}

.poi-info {
  flex: 1;
}

.poi-info h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: #2c3e50;
}

.poi-meta {
  display: flex;
  font-size: 12px;
  color: #7f8c8d;
}

.poi-meta span {
  margin-right: 8px;
}

.loading-indicator {
  padding: 20px;
  text-align: center;
  color: #7f8c8d;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 10px;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #7f8c8d;
}

/* Bottom Sheet */
.bottom-sheet {
  height: auto;
  max-height: 50vh;
  overflow-y: auto;
}

.bottom-sheet-header {
  position: relative;
  padding: 16px;
  border-bottom: 1px solid #f1f1f1;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: none;
  background-color: #f1f1f1;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
}

.bottom-sheet-header h3 {
  margin: 0 0 10px;
  padding-right: 30px;
  font-size: 18px;
  color: #2c3e50;
}

.poi-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.poi-tag {
  padding: 4px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
  color: #7f8c8d;
}

.bottom-sheet-content {
  padding: 16px;
}

.poi-description {
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .poi-list-panel {
    width: calc(100% - 40px);
    max-height: 40vh;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>