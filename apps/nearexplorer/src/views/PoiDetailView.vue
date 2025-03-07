<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const poiId = computed(() => route.params.id)
const poi = ref(null)
const map = ref(null)
const mapContainer = ref(null)
const activeTransportMode = ref('walking')
const userLocation = ref(null)
const routeDistanceTime = ref({ distance: null, duration: null })

// No Mapbox token needed for our mock implementation

// Mock data for POIs - in a real app, this would come from an API
const mockPOIData = [
  {
    id: 'p1',
    name: 'Central Park',
    category: 'nature',
    address: 'Central Park, New York, NY',
    distance: 0.8,
    rating: 4.8,
    coordinates: [-73.965355, 40.782865],
    photos: [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%232ecc71"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">🌳 Park Photo</text></svg>',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%233498db"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">🏞️ Lake View</text></svg>'
    ],
    description: 'A beautiful urban park with walking trails and scenic views. Spanning 843 acres in the heart of Manhattan, Central Park offers a respite from the hustle and bustle of the city.',
    openHours: '6:00 AM - 1:00 AM, Daily',
    amenities: ['Walking Trails', 'Bike Rentals', 'Restrooms', 'Food Vendors', 'Boat Rentals'],
    reviews: [
      { user: 'Sarah L.', rating: 5, text: 'A must-visit when in NYC. So many activities and beautiful spots to explore!' },
      { user: 'Michael T.', rating: 4, text: 'Great place to relax. Can get crowded on weekends though.' }
    ]
  },
  {
    id: 'p2',
    name: 'Joe\'s Coffee',
    category: 'food',
    address: '187 Columbus Ave, New York, NY',
    distance: 0.3,
    rating: 4.6,
    coordinates: [-73.989308, 40.741895],
    photos: [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23e67e22"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">☕ Coffee Shop</text></svg>',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f39c12"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">🍰 Pastries</text></svg>'
    ],
    description: 'Cozy café with great espresso and freshly baked pastries. Joe\'s sources ethically traded beans and roasts them locally for the freshest flavor.',
    openHours: '7:00 AM - 8:00 PM, Mon-Fri; 8:00 AM - 7:00 PM, Sat-Sun',
    amenities: ['Free WiFi', 'Outdoor Seating', 'Power Outlets', 'Pastries', 'Cold Brew'],
    reviews: [
      { user: 'Emma W.', rating: 5, text: 'Best latte in the neighborhood. The pastries are amazing too!' },
      { user: 'David K.', rating: 4, text: 'Great coffee but can be hard to find seating during peak hours.' }
    ]
  },
  {
    id: 'p3',
    name: 'Metropolitan Museum',
    category: 'culture',
    address: '1000 5th Ave, New York, NY',
    distance: 1.2,
    rating: 4.9,
    coordinates: [-73.963244, 40.779434],
    photos: [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%239b59b6"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">🏛️ Museum</text></svg>',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%238e44ad"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">🖼️ Artwork</text></svg>'
    ],
    description: 'World-class art museum with vast collections spanning 5,000 years. The Met presents over 5,000 years of art from around the world in its permanent collection.',
    openHours: '10:00 AM - 5:30 PM, Sun-Thu; 10:00 AM - 9:00 PM, Fri-Sat',
    amenities: ['Guided Tours', 'Gift Shop', 'Cafes', 'Coat Check', 'Accessible Facilities'],
    reviews: [
      { user: 'James R.', rating: 5, text: 'Could spend days here and not see everything. The Egyptian collection is outstanding.' },
      { user: 'Olivia P.', rating: 5, text: 'One of the greatest museums in the world. Don\'t miss the rooftop in summer!' }
    ]
  },
  {
    id: 'p4',
    name: 'Night Owl Bar',
    category: 'nightlife',
    address: '215 W 28th St, New York, NY',
    distance: 0.5,
    rating: 4.3,
    coordinates: [-74.003736, 40.743272],
    photos: [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%233498db"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">🍸 Cocktails</text></svg>',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23000000"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">🎷 Jazz</text></svg>'
    ],
    description: 'Hip cocktail bar with live jazz music and a relaxed atmosphere. The Night Owl features craft cocktails and a rotating lineup of local jazz musicians in an intimate setting.',
    openHours: '5:00 PM - 2:00 AM, Tue-Sat; 5:00 PM - 12:00 AM, Sun; Closed on Monday',
    amenities: ['Live Music', 'Craft Cocktails', 'Small Plates', 'Happy Hour', 'Intimate Setting'],
    reviews: [
      { user: 'Roberto M.', rating: 5, text: 'Amazing jazz and even better cocktails. The Old Fashioned is perfect.' },
      { user: 'Natalie S.', rating: 3, text: 'Great atmosphere but drinks are on the pricey side.' }
    ]
  },
  {
    id: 'p5',
    name: 'Vintage Boutique',
    category: 'shopping',
    address: '123 Bedford Ave, Brooklyn, NY',
    distance: 0.7,
    rating: 4.2,
    coordinates: [-73.999619, 40.722353],
    photos: [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f1c40f"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">👗 Clothing</text></svg>',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23e74c3c"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">👜 Accessories</text></svg>'
    ],
    description: 'Curated collection of vintage clothing and accessories from the 60s-90s. Each piece is hand-selected for quality and uniqueness, with a focus on sustainable fashion.',
    openHours: '11:00 AM - 7:00 PM, Mon-Sat; 12:00 PM - 6:00 PM, Sun',
    amenities: ['Personal Styling', 'Custom Alterations', 'Local Designer Items', 'Sustainable Focus'],
    reviews: [
      { user: 'Lily T.', rating: 5, text: 'Found the most amazing 70s leather jacket here! Staff is super helpful.' },
      { user: 'Ethan B.', rating: 3, text: 'Interesting selection but on the expensive side for vintage.' }
    ]
  },
  {
    id: 'p6',
    name: 'Riverside Park',
    category: 'nature',
    address: 'Riverside Drive, New York, NY',
    distance: 1.4,
    rating: 4.5,
    coordinates: [-73.973220, 40.803927],
    photos: [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%232ecc71"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">🌊 Riverside</text></svg>',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%2327ae60"/><text x="150" y="100" font-family="Arial" font-size="40" text-anchor="middle" fill="white">🚴 Bike Path</text></svg>'
    ],
    description: 'Waterfront park with walking and biking paths along the Hudson River. Riverside Park stretches four miles from 72nd to 158th streets along the Hudson River in Manhattan.',
    openHours: '6:00 AM - 1:00 AM, Daily',
    amenities: ['Bike Path', 'Running Trail', 'Dog Park', 'Playgrounds', 'Sports Fields'],
    reviews: [
      { user: 'Mark J.', rating: 5, text: 'Great for running or biking with beautiful river views.' },
      { user: 'Sophie L.', rating: 4, text: 'Lovely waterfront park, though some areas could use better maintenance.' }
    ]
  }
]

// Find the selected POI
function loadPOIData() {
  poi.value = mockPOIData.find(p => p.id === poiId.value) || null
  
  // If POI not found, redirect to explore page
  if (!poi.value) {
    router.push('/explore')
    return
  }
  
  // Initialize map once we have the POI data
  initializeMap()
}

// Function to initialize map (mock version)
function initializeMap() {
  if (!mapContainer.value || !poi.value) return
  
  // Create mock map interface
  const mockMap = document.createElement('div')
  mockMap.className = 'mock-map'
  mockMap.innerHTML = `
    <div class="mock-map-overlay">
      <div class="mock-map-label">Mock Map Interface - ${poi.value.name}</div>
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
  
  // Set mock user location
  userLocation.value = [poi.value.coordinates[0] - 0.01, poi.value.coordinates[1] - 0.01]
  
  // Add POI marker and route
  const mockMapBg = mockMap.querySelector('.mock-map-background')
  
  // Create POI marker
  const poiMarker = document.createElement('div')
  poiMarker.className = 'poi-marker active'
  poiMarker.style.left = '60%'
  poiMarker.style.top = '40%'
  poiMarker.innerHTML = `
    <div class="marker-content">
      <div class="marker-icon">${getCategoryIcon(poi.value.category)}</div>
    </div>
  `
  
  // Create user marker
  const userMarker = document.createElement('div')
  userMarker.className = 'user-location-marker'
  userMarker.innerHTML = '📍'
  userMarker.style.left = '40%'
  userMarker.style.top = '60%'
  
  // Add markers to map
  mockMapBg.appendChild(poiMarker)
  mockMapBg.appendChild(userMarker)
  
  // Display route
  displayRoute()
  
  // Create mock map object
  map.value = {
    loaded: () => true,
    getLayer: () => false,
    getSource: () => ({
      setData: (data) => console.log('Mock update route data', data)
    }),
    fitBounds: (bounds, options) => console.log('Mock fit bounds', bounds, options)
  }
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

// Function to change transport mode
function setTransportMode(mode) {
  activeTransportMode.value = mode
  // Update route if we have user location
  if (userLocation.value) {
    displayRoute()
  }
}

// Function to display route between user location and POI (mock version)
function displayRoute() {
  if (!userLocation.value || !poi.value) return
  
  // Default to walking profile
  let profile = 'walking'
  if (activeTransportMode.value === 'driving') profile = 'driving'
  if (activeTransportMode.value === 'biking') profile = 'cycling'
  
  // Calculate simulated distance and duration
  const distance = calculateDistance(userLocation.value, poi.value.coordinates)
  let duration = distance / 5 * 60 // 5 km/h walking speed
  
  if (profile === 'cycling') duration = distance / 15 * 60 // 15 km/h biking speed
  if (profile === 'driving') duration = distance / 30 * 60 // 30 km/h driving speed (city traffic)
  
  routeDistanceTime.value = {
    distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
    duration: Math.round(duration)
  }
  
  // Get mock map background
  const mockMapBg = document.querySelector('.mock-map-background')
  if (!mockMapBg) return
  
  // Remove existing route line
  const existingRoute = mockMapBg.querySelector('.mock-route-line')
  if (existingRoute) {
    existingRoute.remove()
  }
  
  // Create a mock route line
  const routeLine = document.createElement('div')
  routeLine.className = 'mock-route-line'
  
  // Different styles for different transport modes
  if (profile === 'walking') {
    routeLine.classList.add('route-walking')
  } else if (profile === 'cycling') {
    routeLine.classList.add('route-cycling')
  } else if (profile === 'driving') {
    routeLine.classList.add('route-driving')
  }
  
  mockMapBg.appendChild(routeLine)
}

// Helper to create a simulated route between two points
function createSimulatedRoute(start, end) {
  // Create a curved route with random waypoints
  const points = 8
  const coordinates = [start]
  
  // Calculate the midpoint
  const midX = (start[0] + end[0]) / 2
  const midY = (start[1] + end[1]) / 2
  
  // Add some randomness to the route
  for (let i = 1; i < points - 1; i++) {
    const ratio = i / (points - 1)
    const offsetX = (Math.random() - 0.5) * 0.005
    const offsetY = (Math.random() - 0.5) * 0.005
    
    coordinates.push([
      start[0] + (end[0] - start[0]) * ratio + offsetX,
      start[1] + (end[1] - start[1]) * ratio + offsetY
    ])
  }
  
  coordinates.push(end)
  return coordinates
}

// Helper to calculate distance between two points in km
function calculateDistance(coord1, coord2) {
  // Simple Haversine formula for demo purposes
  const toRad = value => value * Math.PI / 180
  const R = 6371 // Earth's radius in km
  
  const dLat = toRad(coord2[1] - coord1[1])
  const dLon = toRad(coord2[0] - coord1[0])
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(coord1[1])) * Math.cos(toRad(coord2[1])) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Function to format duration in minutes/hours
function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`
  } else {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`
  }
}

// Function to start navigation
function startNavigation() {
  // In a real app, this would initialize turn-by-turn navigation
  alert(`Starting navigation to ${poi.value.name} via ${activeTransportMode.value} mode`)
}

// Function to add to favorites
function addToFavorites() {
  if (!poi.value) return
  
  // Get existing favorites from localStorage
  const storedFavorites = localStorage.getItem('nearexplorer-favorites')
  let favorites = storedFavorites ? JSON.parse(storedFavorites) : []
  
  // Check if already in favorites
  const exists = favorites.some(fav => fav.id === poi.value.id)
  
  if (!exists) {
    // Add to favorites
    favorites.push({
      id: poi.value.id,
      name: poi.value.name,
      category: poi.value.category,
      coordinates: poi.value.coordinates
    })
    
    // Save to localStorage
    localStorage.setItem('nearexplorer-favorites', JSON.stringify(favorites))
    alert(`${poi.value.name} added to favorites!`)
  } else {
    alert(`${poi.value.name} is already in your favorites!`)
  }
}

// Initialize on component mount
onMounted(() => {
  loadPOIData()
})
</script>

<template>
  <div class="poi-detail-view">
    <!-- Top Map Section -->
    <div class="map-section">
      <div ref="mapContainer" class="map-container"></div>
      
      <!-- Back button -->
      <button 
        class="btn btn-secondary back-btn"
        @click="router.go(-1)"
        v-voix="'back-button'"
        hint="Return to previous screen">
        ← Back
      </button>
      
      <!-- Transport Mode Selector -->
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
      </div>
      
      <!-- Route Info Card -->
      <div v-if="routeDistanceTime.distance" class="route-info-card">
        <div class="route-stats">
          <div class="stat">
            <div class="stat-value">{{ routeDistanceTime.distance }} km</div>
            <div class="stat-label">Distance</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ formatDuration(routeDistanceTime.duration) }}</div>
            <div class="stat-label">Duration</div>
          </div>
        </div>
        <button 
          class="btn btn-primary start-navigation-btn"
          @click="startNavigation"
          v-voix="'start-navigation-button'"
          hint="Begin navigation to this location">
          Start Navigation
        </button>
      </div>
    </div>
    
    <!-- POI Details Section -->
    <div v-if="poi" class="poi-details-section">
      <div class="poi-header">
        <h1>{{ poi.name }}</h1>
        <div class="poi-meta">
          <span class="category">{{ getCategoryIcon(poi.category) }} {{ poi.category }}</span>
          <span class="rating">⭐ {{ poi.rating }}</span>
        </div>
      </div>
      
      <!-- Photo Gallery -->
      <div class="photo-gallery">
        <img 
          v-for="(photo, index) in poi.photos" 
          :key="index" 
          :src="photo" 
          alt="" 
          class="gallery-photo" 
        />
      </div>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button 
          class="btn btn-secondary action-btn"
          @click="addToFavorites"
          v-voix="'add-favorite-button'"
          hint="Save this place to your favorites list">
          ⭐ Save
        </button>
        <button 
          class="btn btn-primary action-btn"
          @click="startNavigation"
          v-voix="'navigate-button'"
          hint="Begin navigation to this location">
          🧭 Navigate
        </button>
      </div>
      
      <!-- Address and Hours -->
      <div class="info-section">
        <div class="info-row">
          <div class="info-icon">📍</div>
          <div class="info-content">{{ poi.address }}</div>
        </div>
        <div class="info-row">
          <div class="info-icon">🕒</div>
          <div class="info-content">{{ poi.openHours }}</div>
        </div>
      </div>
      
      <!-- Description -->
      <div class="description-section">
        <h2>About</h2>
        <p>{{ poi.description }}</p>
      </div>
      
      <!-- Amenities -->
      <div class="amenities-section">
        <h2>Amenities</h2>
        <div class="amenities-list">
          <div v-for="(amenity, index) in poi.amenities" :key="index" class="amenity-item">
            <div class="amenity-icon">✓</div>
            <div class="amenity-name">{{ amenity }}</div>
          </div>
        </div>
      </div>
      
      <!-- Reviews -->
      <div class="reviews-section">
        <h2>Reviews</h2>
        <div class="review-item" v-for="(review, index) in poi.reviews" :key="index">
          <div class="review-header">
            <div class="review-user">{{ review.user }}</div>
            <div class="review-rating">
              <span v-for="star in 5" :key="star" class="star">
                {{ star <= review.rating ? '★' : '☆' }}
              </span>
            </div>
          </div>
          <p class="review-text">{{ review.text }}</p>
        </div>
      </div>
      
      <!-- Nearby Suggestions -->
      <div class="nearby-section">
        <h2>Nearby Places</h2>
        <div class="nearby-places-grid">
          <div class="nearby-place-card" @click="viewPOIDetails('p8')" v-voix="'nearby-highline'" hint="View Highline Park details">
            <div class="nearby-place-icon" style="background-color: #27ae60;">🌿</div>
            <div class="nearby-place-info">
              <h4>Highline Park</h4>
              <div class="nearby-place-meta">
                <span>0.7 mi</span>
                <span>⭐ 4.6</span>
              </div>
            </div>
          </div>
          
          <div class="nearby-place-card" @click="viewPOIDetails('p10')" v-voix="'nearby-bakery'" hint="View Artisan Bakery details">
            <div class="nearby-place-icon" style="background-color: #e67e22;">🥐</div>
            <div class="nearby-place-info">
              <h4>Artisan Bakery</h4>
              <div class="nearby-place-meta">
                <span>0.4 mi</span>
                <span>⭐ 4.8</span>
              </div>
            </div>
          </div>
          
          <div class="nearby-place-card" @click="viewPOIDetails('p15')" v-voix="'nearby-fitness'" hint="View Fitness Studio details">
            <div class="nearby-place-icon" style="background-color: #16a085;">💪</div>
            <div class="nearby-place-info">
              <h4>Fitness Studio</h4>
              <div class="nearby-place-meta">
                <span>0.5 mi</span>
                <span>⭐ 4.4</span>
              </div>
            </div>
          </div>
          
          <div class="nearby-place-card" @click="viewPOIDetails('p17')" v-voix="'nearby-foodhall'" hint="View Gourmet Food Hall details">
            <div class="nearby-place-icon" style="background-color: #e74c3c;">🍲</div>
            <div class="nearby-place-info">
              <h4>Gourmet Food Hall</h4>
              <div class="nearby-place-meta">
                <span>0.6 mi</span>
                <span>⭐ 4.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p>Loading place details...</p>
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

.user-location-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 30px;
  z-index: 3;
}

/* Mock route line */
.mock-route-line {
  position: absolute;
  left: 40%;
  top: 60%;
  width: 20%;
  height: 20%;
  border-top: 3px dashed #3498db;
  transform: rotate(-45deg);
  transform-origin: 0 0;
  z-index: 1;
}

.mock-route-line.route-walking {
  border-top: 3px dashed #3498db;
}

.mock-route-line.route-cycling {
  border-top: 3px dashed #27ae60;
}

.mock-route-line.route-driving {
  border-top: 3px solid #e74c3c;
}
</style>

<style scoped>
.poi-detail-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Map Section */
.map-section {
  position: relative;
  height: 40vh;
}

.map-container {
  width: 100%;
  height: 100%;
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
  padding: 8px 16px;
  font-size: 14px;
}

.transport-selector {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
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

.route-info-card {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.route-stats {
  display: flex;
  gap: 24px;
}

.stat {
  text-align: center;
}

.stat-value {
  font-weight: bold;
  font-size: 16px;
  color: #2c3e50;
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
}

.start-navigation-btn {
  padding: 8px 16px;
  font-size: 14px;
}

/* POI Details Section */
.poi-details-section {
  flex: 1;
  padding: 24px 16px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.poi-header {
  margin-bottom: 24px;
}

.poi-header h1 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #2c3e50;
}

.poi-meta {
  display: flex;
  gap: 16px;
  color: #7f8c8d;
}

/* Photo Gallery */
.photo-gallery {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  margin-bottom: 24px;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
}

.gallery-photo {
  width: 280px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.action-btn {
  flex: 1;
  justify-content: center;
}

/* Info Section */
.info-section {
  margin-bottom: 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-icon {
  margin-right: 12px;
  font-size: 20px;
}

.info-content {
  flex: 1;
  color: #2c3e50;
}

/* Description Section */
.description-section {
  margin-bottom: 24px;
}

.description-section h2 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #2c3e50;
}

.description-section p {
  color: #34495e;
  line-height: 1.6;
}

/* Amenities Section */
.amenities-section {
  margin-bottom: 24px;
}

.amenities-section h2 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #2c3e50;
}

.amenities-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.amenity-item {
  display: flex;
  align-items: center;
}

.amenity-icon {
  color: #2ecc71;
  margin-right: 8px;
}

/* Reviews Section */
.reviews-section {
  margin-bottom: 24px;
}

.reviews-section h2 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #2c3e50;
}

.review-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f1f1;
}

.review-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.review-user {
  font-weight: bold;
  color: #2c3e50;
}

.review-rating {
  color: #f1c40f;
}

.review-text {
  margin: 0;
  color: #34495e;
  line-height: 1.6;
}

/* Nearby Section */
.nearby-section {
  margin-bottom: 24px;
}

.nearby-section h2 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #2c3e50;
}

.nearby-places-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.nearby-place-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.nearby-place-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nearby-place-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  font-size: 20px;
}

.nearby-place-info {
  flex: 1;
}

.nearby-place-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
  color: #2c3e50;
}

.nearby-place-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #7f8c8d;
}

/* Loading State */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .amenities-list {
    grid-template-columns: 1fr 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .route-info-card {
    flex-direction: column;
    gap: 12px;
  }
}
</style>