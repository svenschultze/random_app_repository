<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useListingsStore } from '@/stores/listings'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
// Import Leaflet fully first
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
// Use custom toast implementation
// import { useToast } from 'primevue/usetoast'

// Fix icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
})

// Custom toast like in App.vue
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.setAttribute('role', 'alert')
  
  const iconMap = {
    success: 'pi pi-check-circle',
    error: 'pi pi-times-circle',
    warning: 'pi pi-exclamation-triangle',
    info: 'pi pi-info-circle'
  }
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="${iconMap[type] || iconMap.info}"></i>
    </div>
    <div class="toast-content">
      <p>${message}</p>
    </div>
    <button class="toast-close" aria-label="Close notification">
      <i class="pi pi-times"></i>
    </button>
  `
  
  const container = document.getElementById('toast-container')
  if (container) {
    container.appendChild(toast)
    
    // Auto remove after duration
    setTimeout(() => {
      toast.classList.add('toast-hiding')
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast)
        }
      }, 300)
    }, duration)
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.add('toast-hiding')
        setTimeout(() => {
          if (container.contains(toast)) {
            container.removeChild(toast)
          }
        }, 300)
      })
    }
  }
}

const router = useRouter()
const listingsStore = useListingsStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
// Using our custom toast implementation

// View mode (list or map)
const viewMode = ref('list')

// Filters state
const filters = ref({ ...listingsStore.filters })

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

// Bathroom options
const bathroomOptions = [
  { label: 'Any', value: null },
  { label: '1 Bathroom', value: 1 },
  { label: '2 Bathrooms', value: 2 },
  { label: '3+ Bathrooms', value: 3 }
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

// Sort options
const sortOptions = [
  { label: 'Price (Low to High)', value: 'price_asc' },
  { label: 'Price (High to Low)', value: 'price_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc' }
]
const sortBy = ref('date_desc')

// Loading state
const loading = ref(true)

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const sortedListings = computed(() => {
  const listings = [...listingsStore.filteredListings]
  
  switch (sortBy.value) {
    case 'price_asc':
      return listings.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return listings.sort((a, b) => b.price - a.price)
    case 'date_desc':
      return listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'date_asc':
      return listings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    default:
      return listings
  }
})

// Map settings
const center = ref([37.7749, -122.4194]) // Default center (San Francisco)
const zoom = ref(13)
const maxZoom = 18
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const popupListing = ref(null)

// Initialize map with listings
function initializeMap() {
  // Calculate center based on listings if available
  if (sortedListings.value.length > 0) {
    const latitudes = sortedListings.value.map(listing => listing.latitude)
    const longitudes = sortedListings.value.map(listing => listing.longitude)
    
    const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length
    const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length
    
    center.value = [avgLat, avgLng]
  }
}

// Handle map marker click
function showPopup(listing) {
  popupListing.value = listing
}

// Apply filters
function applyFilters() {
  listingsStore.setFilters({ ...filters.value })
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// Reset filters
function resetFilters() {
  listingsStore.resetFilters()
  filters.value = { ...listingsStore.filters }
  applyFilters()
}

// Handle favorite toggle
async function toggleFavorite(listing) {
  if (!isAuthenticated.value) {
    showToast('Please sign in to save favorites', 'info')
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }
  
  try {
    const isFavorite = favoritesStore.isFavorite(listing.id)
    
    if (isFavorite) {
      await favoritesStore.removeFavorite(listing.id)
      showToast('Property has been removed from your favorites', 'success')
    } else {
      await favoritesStore.addFavorite(listing.id)
      showToast('Property has been added to your favorites', 'success')
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    showToast('Failed to update favorites. Please try again.', 'error')
  }
}

// Track if we've already tried to fetch the listings
const hasAttemptedFetch = ref(false)

// Fetch data on component mount
onMounted(async () => {
  if (!hasAttemptedFetch.value) {
    loading.value = true
    await listingsStore.fetchListings()
    
    // Initialize filter values from store
    filters.value = { ...listingsStore.filters }
    
    // Initialize map if in map view
    if (viewMode.value === 'map') {
      initializeMap()
    }
    
    hasAttemptedFetch.value = true
    loading.value = false
  }
})

// Re-initialize map when view mode changes
watch(viewMode, (newValue) => {
  if (newValue === 'map') {
    // Use nextTick to ensure the map container is rendered
    setTimeout(() => {
      initializeMap()
    }, 100)
  }
})

// Watch filter changes to apply them
watch(() => listingsStore.filters, (newValue) => {
  filters.value = { ...newValue }
}, { deep: true })
</script>

<template>
  <div class="listings-view">
    <div class="view-header">
      <h1>Rental Properties</h1>
      
      <!-- View mode toggle -->
      <div class="view-toggle">
        <Button 
          icon="pi pi-list" 
          :class="{ 'p-button-primary': viewMode === 'list', 'p-button-outlined': viewMode !== 'list' }"
          @click="viewMode = 'list'"
          class="toggle-button"
        />
        <Button 
          icon="pi pi-map" 
          :class="{ 'p-button-primary': viewMode === 'map', 'p-button-outlined': viewMode !== 'map' }"
          @click="viewMode = 'map'"
          class="toggle-button"
        />
      </div>
    </div>
    
    <div class="filters-section">
      <div class="filters-container">
        <div class="filter-row">
          <!-- Location filter -->
          <div class="filter-item location-filter">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText 
                v-model="filters.location" 
                placeholder="City, neighborhood, or zip code" 
              />
            </span>
          </div>
          
          <!-- Property type filter -->
          <div class="filter-item">
            <Dropdown 
              v-model="filters.propertyType" 
              :options="propertyTypes" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Property Type" 
            />
          </div>
          
          <!-- Bedrooms filter -->
          <div class="filter-item">
            <Dropdown 
              v-model="filters.bedrooms" 
              :options="bedroomOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Bedrooms" 
            />
          </div>
          
          <!-- Bathrooms filter -->
          <div class="filter-item">
            <Dropdown 
              v-model="filters.bathrooms" 
              :options="bathroomOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Bathrooms" 
            />
          </div>
        </div>
        
        <div class="filter-row">
          <!-- Price range filter -->
          <div class="filter-item price-filter">
            <div class="price-inputs">
              <InputText 
                v-model.number="filters.priceMin" 
                placeholder="Min Price" 
                type="number" 
              />
              <span class="price-separator">-</span>
              <InputText 
                v-model.number="filters.priceMax" 
                placeholder="Max Price" 
                type="number" 
              />
            </div>
          </div>
          
          <!-- Amenities filter -->
          <div class="filter-item amenities-filter">
            <MultiSelect 
              v-model="filters.amenities" 
              :options="amenityOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Amenities" 
              display="chip"
            />
          </div>
          
          <!-- Sort filter -->
          <div class="filter-item">
            <Dropdown 
              v-model="sortBy" 
              :options="sortOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Sort By" 
            />
          </div>
          
          <!-- Filter buttons -->
          <div class="filter-buttons">
            <Button 
              label="Apply" 
              icon="pi pi-filter" 
              @click="applyFilters" 
              class="p-button-primary filter-button"
            />
            <Button 
              label="Reset" 
              icon="pi pi-refresh" 
              @click="resetFilters" 
              class="p-button-outlined filter-button"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Loading properties...</p>
    </div>
    
    <!-- Results count -->
    <div v-else-if="sortedListings.length === 0" class="no-results">
      <i class="pi pi-info-circle"></i>
      <p>No properties found matching your criteria</p>
      <Button 
        label="Reset Filters" 
        icon="pi pi-refresh" 
        @click="resetFilters" 
        class="p-button-outlined"
      />
    </div>
    
    <div v-else class="results-count">
      {{ sortedListings.length }} properties found
    </div>
    
    <!-- List view -->
    <div v-if="viewMode === 'list' && !loading" class="listings-grid">
      <div v-for="listing in sortedListings" :key="listing.id" class="listing-card">
        <Card>
          <template #header>
            <div class="listing-image-container">
              <img :src="`${listing.images[0]}?auto=format&fit=crop&w=600&h=400`" 
                   :alt="listing.title" 
                   class="listing-image" />
              <div class="listing-price">${{ listing.price }}/mo</div>
              
              <!-- Favorite button -->
              <Button 
                :icon="favoritesStore.isFavorite(listing.id) ? 'pi pi-heart-fill' : 'pi pi-heart'" 
                class="p-button-rounded p-button-text favorite-button" 
                @click="toggleFavorite(listing)"
                :class="{'favorited': favoritesStore.isFavorite(listing.id)}"
              />
            </div>
          </template>
          <template #title>
            <div class="listing-title">{{ listing.title }}</div>
          </template>
          <template #subtitle>
            <div class="listing-location">{{ listing.location }}</div>
          </template>
          <template #content>
            <div class="listing-details">
              <span><i class="pi pi-home"></i> {{ listing.propertyType }}</span>
              <span><i class="pi pi-th-large"></i> {{ listing.bedrooms }} bd</span>
              <span><i class="pi pi-wrench"></i> {{ listing.bathrooms }} ba</span>
            </div>
            <div class="listing-amenities" v-if="listing.amenities.length > 0">
              <div v-for="amenity in listing.amenities" :key="amenity" class="amenity-tag">
                {{ amenity.replace('_', ' ') }}
              </div>
            </div>
            <p class="listing-description">{{ listing.description }}</p>
          </template>
          <template #footer>
            <Button 
              label="View Details" 
              icon="pi pi-arrow-right" 
              @click="router.push(`/listings/${listing.id}`)" 
            />
          </template>
        </Card>
      </div>
    </div>
    
    <!-- Map view -->
    <div v-else-if="viewMode === 'map' && !loading" class="map-container">
      <LMap 
        ref="map" 
        v-model:zoom="zoom" 
        :center="center" 
        :max-zoom="maxZoom"
        style="height: 600px; width: 100%;"
      >
        <LTileLayer :url="url" :attribution="attribution" />
        
        <LMarker 
          v-for="listing in sortedListings" 
          :key="listing.id" 
          :lat-lng="[listing.latitude, listing.longitude]"
          @click="showPopup(listing)"
        >
          <LPopup v-if="popupListing && popupListing.id === listing.id">
            <div class="map-popup">
              <img :src="`${listing.images[0]}?auto=format&fit=crop&w=300&h=200`" 
                   :alt="listing.title" 
                   class="popup-image" />
              <div class="popup-content">
                <h3>{{ listing.title }}</h3>
                <p class="popup-price">${{ listing.price }}/mo</p>
                <p class="popup-details">
                  {{ listing.bedrooms }} bd | {{ listing.bathrooms }} ba | {{ listing.propertyType }}
                </p>
                <Button 
                  label="View Details" 
                  size="small" 
                  @click="router.push(`/listings/${listing.id}`)" 
                />
              </div>
            </div>
          </LPopup>
        </LMarker>
      </LMap>
      
      <!-- Map sidebar for property cards -->
      <div class="map-sidebar">
        <div class="sidebar-header">
          <h3>{{ sortedListings.length }} Properties</h3>
        </div>
        <div class="sidebar-listings">
          <div v-for="listing in sortedListings" :key="listing.id" class="sidebar-listing" @click="showPopup(listing)">
            <img :src="`${listing.images[0]}?auto=format&fit=crop&w=100&h=100`" 
                 :alt="listing.title" 
                 class="sidebar-image" />
            <div class="sidebar-content">
              <h4>{{ listing.title }}</h4>
              <p class="sidebar-price">${{ listing.price }}/mo</p>
              <p class="sidebar-details">
                {{ listing.bedrooms }} bd | {{ listing.bathrooms }} ba
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.listings-view {
  margin-bottom: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-button {
  width: 3rem;
}

/* Filters section */
.filters-section {
  background-color: var(--surface-card);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.location-filter {
  flex: 2;
  min-width: 300px;
}

.price-filter {
  min-width: 250px;
}

.price-inputs {
  display: flex;
  align-items: center;
}

.price-separator {
  margin: 0 0.5rem;
}

.amenities-filter {
  flex: 2;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  min-width: 200px;
}

.filter-button {
  min-width: 6rem;
}

/* Loading and results */
.loading-container,
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--text-color-secondary);
}

.loading-container i,
.no-results i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.results-count {
  margin-bottom: 1rem;
  color: var(--text-color-secondary);
}

/* Listings grid */
.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.listing-card {
  height: 100%;
}

.listing-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.listing-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.listing-card:hover .listing-image {
  transform: scale(1.05);
}

.listing-price {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-top-left-radius: 8px;
}

.favorite-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  color: var(--text-color);
  transition: all 0.2s ease;
}

.favorite-button.favorited {
  color: #f44336;
}

.listing-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.listing-location {
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
}

.listing-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.listing-details span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.listing-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.amenity-tag {
  background-color: var(--surface-hover);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  text-transform: capitalize;
}

.listing-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 1rem;
}

/* Map view */
.map-container {
  position: relative;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-sidebar {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: white;
  z-index: 1000;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.sidebar-listings {
  padding: 0.5rem;
}

.sidebar-listing {
  display: flex;
  padding: 0.75rem;
  border-bottom: 1px solid var(--surface-border);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.sidebar-listing:hover {
  background-color: var(--surface-hover);
}

.sidebar-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
}

.sidebar-content {
  flex: 1;
}

.sidebar-content h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.sidebar-price {
  font-weight: bold;
  color: var(--primary-color);
  margin: 0 0 0.25rem;
}

.sidebar-details {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin: 0;
}

/* Map popup */
.map-popup {
  width: 300px;
}

.popup-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}

.popup-content {
  padding: 0.75rem;
}

.popup-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
}

.popup-price {
  font-weight: bold;
  color: var(--primary-color);
  margin: 0 0 0.5rem;
}

.popup-details {
  margin: 0 0 0.75rem;
  color: var(--text-color-secondary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-item {
    min-width: 100%;
  }
  
  .filter-buttons {
    width: 100%;
    justify-content: center;
  }
  
  .listings-grid {
    grid-template-columns: 1fr;
  }
  
  .map-sidebar {
    display: none;
  }
}
</style>