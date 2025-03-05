<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListingsStore } from '@/stores/listings'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
// Import Leaflet fully first
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LIcon } from '@vue-leaflet/vue-leaflet'

// Fix icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
})

// Custom toast implementation
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

const route = useRoute()
const router = useRouter()
const listingsStore = useListingsStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
// Using custom toast implementation

// Get listing ID from route
const listingId = route.params.id

// States
const loading = ref(true)
const error = ref(null)
const activeImageIndex = ref(0)
const showContactForm = ref(false)
const contactMessage = ref('')
const contactLoading = ref(false)

// Listing data
const listing = computed(() => listingsStore.currentListing)
const isFavorite = computed(() => favoritesStore.isFavorite(listingId))
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Map settings
const zoom = ref(15)
const maxZoom = 18
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

// Related listings (similar properties)
const relatedListings = computed(() => {
  // Get listings with the same property type and similar price range
  return listingsStore.listings
    .filter(item => 
      item.id !== listingId && 
      item.propertyType === listing.value?.propertyType
    )
    .slice(0, 3) // Limit to 3 related listings
})

// Fetch listing data
async function fetchListing() {
  try {
    loading.value = true
    error.value = null
    
    // Make sure all listings are loaded first
    if (listingsStore.listings.length === 0) {
      await listingsStore.fetchListings()
    }
    
    // Fetch the specific listing
    await listingsStore.fetchListingById(listingId)
    
    // If listing not found, show error
    if (!listingsStore.currentListing) {
      error.value = 'Listing not found'
    }
  } catch (err) {
    console.error('Error fetching listing:', err)
    error.value = 'Failed to load property details. Please try again.'
  } finally {
    loading.value = false
  }
}

// Toggle favorite
async function toggleFavorite() {
  if (!isAuthenticated.value) {
    showToast('Please sign in to save favorites', 'info')
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  
  try {
    if (isFavorite.value) {
      await favoritesStore.removeFavorite(listingId)
      showToast('Property has been removed from your favorites', 'success')
    } else {
      await favoritesStore.addFavorite(listingId)
      showToast('Property has been added to your favorites', 'success')
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    showToast('Failed to update favorites. Please try again.', 'error')
  }
}

// Change active image
function changeImage(index) {
  activeImageIndex.value = index
}

// Toggle contact form
function toggleContactForm() {
  if (!isAuthenticated.value) {
    showToast('Please sign in to contact the landlord', 'info')
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  
  showContactForm.value = !showContactForm.value
}

// Send contact message
async function sendMessage() {
  if (!contactMessage.value.trim()) {
    showToast('Please enter a message to send', 'warning')
    return
  }
  
  contactLoading.value = true
  
  // Simulate API call
  setTimeout(() => {
    showToast('Your message has been sent to the landlord', 'success')
    
    contactMessage.value = ''
    showContactForm.value = false
    contactLoading.value = false
  }, 1000)
}

// Schedule a viewing
function scheduleViewing() {
  if (!isAuthenticated.value) {
    showToast('Please sign in to schedule a viewing', 'info')
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  
  showToast('Your viewing request has been sent to the landlord', 'success')
}

// Initialize component
onMounted(async () => {
  await fetchListing()
  
  // Initialize favorites data if authenticated
  if (isAuthenticated.value) {
    await favoritesStore.fetchFavorites()
  }
})
</script>

<template>
  <div class="listing-detail-view">
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Loading property details...</p>
    </div>
    
    <!-- Error message -->
    <div v-else-if="error" class="error-container">
      <i class="pi pi-exclamation-triangle"></i>
      <h2>{{ error }}</h2>
      <Button 
        label="Back to Listings" 
        icon="pi pi-arrow-left" 
        @click="router.push('/listings')" 
        class="p-button-outlined"
      />
    </div>
    
    <!-- Listing details -->
    <div v-else-if="listing" class="listing-content">
      <!-- Back button -->
      <div class="back-link">
        <Button 
          icon="pi pi-arrow-left" 
          label="Back to Listings" 
          class="p-button-text" 
          @click="router.push('/listings')"
        />
      </div>
      
      <!-- Listing header -->
      <div class="listing-header">
        <div class="header-content">
          <h1>{{ listing.title }}</h1>
          <p class="listing-location">{{ listing.location }}</p>
          
          <div class="listing-meta">
            <div class="listing-price">${{ listing.price }}/month</div>
            
            <div class="listing-actions">
              <Button 
                :icon="isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'" 
                :class="{'favorited': isFavorite}"
                class="p-button-rounded favorite-button" 
                @click="toggleFavorite"
              />
              
              <Button 
                icon="pi pi-share-alt" 
                class="p-button-rounded p-button-outlined share-button"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Property images -->
      <div class="images-section">
        <div class="main-image-container">
          <img 
            :src="`${listing.images[activeImageIndex]}?auto=format&w=1000&h=600`" 
            :alt="`${listing.title} - image ${activeImageIndex + 1}`" 
            class="main-image"
          />
        </div>
        
        <div class="thumbnail-images">
          <div 
            v-for="(image, index) in listing.images" 
            :key="index" 
            class="thumbnail-container"
            :class="{ 'active': index === activeImageIndex }"
            @click="changeImage(index)"
          >
            <img 
              :src="`${image}?auto=format&w=200&h=150`" 
              :alt="`${listing.title} - thumbnail ${index + 1}`" 
              class="thumbnail-image"
            />
          </div>
        </div>
      </div>
      
      <!-- Property details -->
      <div class="details-section">
        <div class="property-details">
          <h2>Property Details</h2>
          
          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Type</div>
              <div class="detail-value">{{ listing.propertyType }}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">Bedrooms</div>
              <div class="detail-value">{{ listing.bedrooms }}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">Bathrooms</div>
              <div class="detail-value">{{ listing.bathrooms }}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">Availability</div>
              <div class="detail-value">{{ listing.available ? 'Available Now' : 'Not Available' }}</div>
            </div>
          </div>
          
          <div class="description-container">
            <h3>Description</h3>
            <p class="listing-description">{{ listing.description }}</p>
          </div>
          
          <div class="amenities-container">
            <h3>Amenities</h3>
            <div class="amenities-list">
              <div v-for="amenity in listing.amenities" :key="amenity" class="amenity-item">
                <i class="pi pi-check"></i>
                <span>{{ amenity.replace('_', ' ') }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Landlord and contact section -->
        <div class="contact-section">
          <Card class="contact-card">
            <template #title>
              <div class="landlord-title">Contact Landlord</div>
            </template>
            
            <template #content>
              <div v-if="!showContactForm" class="contact-options">
                <Button 
                  label="Send Message" 
                  icon="pi pi-envelope" 
                  class="p-button-primary contact-button"
                  @click="toggleContactForm"
                />
                
                <Button 
                  label="Schedule Viewing" 
                  icon="pi pi-calendar" 
                  class="p-button-outlined contact-button"
                  @click="scheduleViewing"
                />
                
                <Button 
                  label="Call Landlord" 
                  icon="pi pi-phone" 
                  class="p-button-outlined contact-button"
                />
              </div>
              
              <div v-else class="message-form">
                <h3>Send a Message</h3>
                <div class="p-field">
                  <label for="message">Your message</label>
                  <textarea 
                    id="message" 
                    v-model="contactMessage" 
                    rows="5" 
                    placeholder="I'm interested in this property and would like to schedule a viewing..."
                    class="message-textarea"
                  ></textarea>
                </div>
                
                <div class="form-actions">
                  <Button 
                    label="Cancel" 
                    icon="pi pi-times" 
                    class="p-button-outlined" 
                    @click="toggleContactForm"
                  />
                  
                  <Button 
                    label="Send Message" 
                    icon="pi pi-send" 
                    :loading="contactLoading"
                    @click="sendMessage"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      
      <!-- Location map -->
      <div class="map-section">
        <h2>Location</h2>
        
        <div class="map-container">
          <LMap 
            v-if="listing.latitude && listing.longitude"
            ref="map" 
            :zoom="zoom" 
            :center="[listing.latitude, listing.longitude]" 
            :max-zoom="maxZoom"
            style="height: 400px; width: 100%;"
          >
            <LTileLayer :url="url" :attribution="attribution" />
            <LMarker :lat-lng="[listing.latitude, listing.longitude]" />
          </LMap>
        </div>
      </div>
      
      <!-- Similar properties -->
      <div v-if="relatedListings.length > 0" class="similar-properties">
        <h2>Similar Properties</h2>
        
        <div class="similar-grid">
          <div v-for="item in relatedListings" :key="item.id" class="similar-card">
            <Card>
              <template #header>
                <div class="similar-image-container">
                  <img :src="`${item.images[0]}?auto=format&fit=crop&w=400&h=250`" 
                       :alt="item.title" 
                       class="similar-image" />
                  <div class="similar-price">${{ item.price }}/mo</div>
                </div>
              </template>
              
              <template #title>
                <div class="similar-title">{{ item.title }}</div>
              </template>
              
              <template #content>
                <div class="similar-details">
                  <span><i class="pi pi-home"></i> {{ item.propertyType }}</span>
                  <span><i class="pi pi-th-large"></i> {{ item.bedrooms }} bd</span>
                  <span><i class="pi pi-wrench"></i> {{ item.bathrooms }} ba</span>
                </div>
                
                <Button 
                  label="View Details" 
                  icon="pi pi-arrow-right" 
                  class="p-button-text" 
                  @click="router.push(`/listings/${item.id}`)" 
                />
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.listing-detail-view {
  margin-bottom: 2rem;
}

/* Loading and error states */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-container i,
.error-container i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.error-container h2 {
  margin-bottom: 1.5rem;
  color: var(--text-color-secondary);
}

/* Back link */
.back-link {
  margin-bottom: 1rem;
}

/* Listing header */
.listing-header {
  margin-bottom: 2rem;
}

.header-content h1 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.listing-location {
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.listing-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.listing-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.listing-actions {
  display: flex;
  gap: 0.5rem;
}

.favorite-button.favorited {
  background-color: #f44336;
  color: white;
}

/* Images section */
.images-section {
  margin-bottom: 2rem;
}

.main-image-container {
  height: 500px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-images {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.thumbnail-container {
  width: 120px;
  height: 90px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.thumbnail-container:hover,
.thumbnail-container.active {
  opacity: 1;
}

.thumbnail-container.active {
  border: 2px solid var(--primary-color);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Details section */
.details-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.property-details h2,
.map-section h2,
.similar-properties h2 {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 0.75rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-item {
  background-color: var(--surface-card);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-label {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.detail-value {
  font-weight: bold;
  font-size: 1.125rem;
  text-transform: capitalize;
}

.description-container,
.amenities-container {
  margin-bottom: 2rem;
}

.description-container h3,
.amenities-container h3 {
  margin-bottom: 1rem;
}

.listing-description {
  line-height: 1.6;
  color: var(--text-color-secondary);
}

.amenities-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: capitalize;
}

.amenity-item i {
  color: var(--primary-color);
}

/* Contact section */
.contact-card {
  position: sticky;
  top: 2rem;
}

.landlord-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.contact-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-button {
  width: 100%;
}

.message-form {
  margin-top: 1rem;
}

.message-form h3 {
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.message-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  resize: vertical;
}

.message-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
}

/* Map section */
.map-section {
  margin-bottom: 2rem;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Toast styles - Same as in App.vue */
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: toastIn 0.3s ease forwards;
  max-width: 100%;
}

.toast-hiding {
  animation: toastOut 0.3s ease forwards;
}

.toast-icon {
  flex-shrink: 0;
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.toast-content {
  flex-grow: 1;
  padding-right: 1.5rem;
}

.toast-content p {
  margin: 0;
  font-size: 0.9rem;
}

.toast-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 0.25rem;
  font-size: 0.875rem;
}

.toast-success .toast-icon {
  color: #28a745;
}

.toast-error .toast-icon {
  color: #dc3545;
}

.toast-warning .toast-icon {
  color: #ffc107;
}

.toast-info .toast-icon {
  color: #17a2b8;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes toastOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}

/* Similar properties */
.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.similar-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.similar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.similar-price {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 0.75rem;
  font-weight: bold;
  border-top-left-radius: 8px;
}

.similar-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.similar-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.similar-details span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .details-section {
    grid-template-columns: 1fr;
  }
  
  .main-image-container {
    height: 300px;
  }
  
  .similar-grid {
    grid-template-columns: 1fr;
  }
}
</style>