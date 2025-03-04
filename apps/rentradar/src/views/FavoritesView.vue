<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { useListingsStore } from '@/stores/listings'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const listingsStore = useListingsStore()
const toast = useToast()

// States
const loading = ref(true)

// Get favorite listings
const favoriteListings = computed(() => {
  const favorites = favoritesStore.favorites.map(fav => fav.listingId)
  return listingsStore.listings.filter(listing => favorites.includes(listing.id))
})

// Handle remove favorite
async function removeFavorite(listingId) {
  try {
    await favoritesStore.removeFavorite(listingId)
    toast.add({
      severity: 'success',
      summary: 'Removed from Favorites',
      detail: 'Property has been removed from your favorites',
      life: 3000
    })
  } catch (error) {
    console.error('Error removing favorite:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to remove favorite. Please try again.',
      life: 3000
    })
  }
}

// Initialize component
onMounted(async () => {
  loading.value = true
  
  // Load all listings if not loaded yet
  if (listingsStore.listings.length === 0) {
    await listingsStore.fetchListings()
  }
  
  // Load favorites
  await favoritesStore.fetchFavorites()
  
  loading.value = false
})
</script>

<template>
  <div class="favorites-view">
    <div class="favorites-header">
      <h1>My Favorites</h1>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Loading your favorites...</p>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="favoriteListings.length === 0" class="empty-state">
      <i class="pi pi-heart"></i>
      <h2>No favorites yet</h2>
      <p>Start adding properties to your favorites</p>
      <Button 
        label="Browse Listings" 
        icon="pi pi-search" 
        @click="router.push('/listings')" 
        class="p-button-primary"
      />
    </div>
    
    <!-- Favorites list -->
    <div v-else class="favorites-grid">
      <div v-for="listing in favoriteListings" :key="listing.id" class="favorite-card">
        <Card>
          <template #header>
            <div class="favorite-image-container">
              <img :src="`${listing.images[0]}?auto=format&fit=crop&w=600&h=400`" 
                   :alt="listing.title" 
                   class="favorite-image" />
              <div class="favorite-price">${{ listing.price }}/mo</div>
              
              <!-- Remove button -->
              <Button 
                icon="pi pi-trash" 
                class="p-button-rounded p-button-danger remove-button" 
                @click="removeFavorite(listing.id)"
              />
            </div>
          </template>
          <template #title>
            <div class="favorite-title">{{ listing.title }}</div>
          </template>
          <template #subtitle>
            <div class="favorite-location">{{ listing.location }}</div>
          </template>
          <template #content>
            <div class="favorite-details">
              <span><i class="pi pi-home"></i> {{ listing.propertyType }}</span>
              <span><i class="pi pi-th-large"></i> {{ listing.bedrooms }} bd</span>
              <span><i class="pi pi-wrench"></i> {{ listing.bathrooms }} ba</span>
            </div>
            <div class="favorite-amenities" v-if="listing.amenities.length > 0">
              <div v-for="amenity in listing.amenities.slice(0, 3)" :key="amenity" class="amenity-tag">
                {{ amenity.replace('_', ' ') }}
              </div>
              <div v-if="listing.amenities.length > 3" class="amenity-tag more-tag">
                +{{ listing.amenities.length - 3 }} more
              </div>
            </div>
          </template>
          <template #footer>
            <div class="favorite-actions">
              <Button 
                label="View Details" 
                icon="pi pi-arrow-right" 
                @click="router.push(`/listings/${listing.id}`)" 
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-view {
  margin-bottom: 2rem;
}

.favorites-header {
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

/* Favorites grid */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.favorite-card {
  height: 100%;
}

.favorite-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.favorite-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.favorite-card:hover .favorite-image {
  transform: scale(1.05);
}

.favorite-price {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-top-left-radius: 8px;
}

.remove-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
}

.favorite-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.favorite-location {
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
}

.favorite-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.favorite-details span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.favorite-amenities {
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

.more-tag {
  background-color: var(--surface-200);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>