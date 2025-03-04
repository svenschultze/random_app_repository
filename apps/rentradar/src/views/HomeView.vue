<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useListingsStore } from '@/stores/listings'

const router = useRouter()
const listingsStore = useListingsStore()

// Hero section
const heroTitle = "Find Your Perfect Rental Home"
const heroSubtitle = "Search for apartments, houses, and more with real-time alerts for new listings"

// Search form
const searchForm = reactive({
  location: '',
  priceMin: null,
  priceMax: null,
  bedrooms: null,
  propertyType: null
})

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

// Featured listings
const featuredListings = ref([])
const loading = ref(true)

onMounted(async () => {
  // Fetch listings data
  await listingsStore.fetchListings()
  featuredListings.value = listingsStore.listings.slice(0, 3)
  loading.value = false
})

// Search function
function handleSearch() {
  // Set filters in the store
  listingsStore.setFilters({
    location: searchForm.location,
    priceMin: searchForm.priceMin || 0,
    priceMax: searchForm.priceMax || 10000,
    bedrooms: searchForm.bedrooms,
    propertyType: searchForm.propertyType
  })
  
  // Navigate to listings page
  router.push('/listings')
}
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>{{ heroTitle }}</h1>
        <p>{{ heroSubtitle }}</p>
        
        <!-- Search Form -->
        <div class="search-container">
          <div class="search-form">
            <div class="p-fluid p-grid">
              <div class="p-field">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText 
                    v-model="searchForm.location" 
                    placeholder="City, neighborhood, or zip code" 
                    class="location-input" 
                  />
                </span>
              </div>
              
              <div class="search-filters">
                <div class="p-field">
                  <Dropdown 
                    v-model="searchForm.propertyType" 
                    :options="propertyTypes" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="Property Type" 
                  />
                </div>
                
                <div class="p-field">
                  <Dropdown 
                    v-model="searchForm.bedrooms" 
                    :options="bedroomOptions" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="Bedrooms" 
                  />
                </div>
                
                <div class="p-field price-field">
                  <InputText 
                    v-model.number="searchForm.priceMin" 
                    placeholder="Min Price" 
                    type="number"
                    class="price-input" 
                  />
                  <span>-</span>
                  <InputText 
                    v-model.number="searchForm.priceMax" 
                    placeholder="Max Price" 
                    type="number"
                    class="price-input" 
                  />
                </div>
              </div>
              
              <div class="search-button">
                <Button 
                  label="Search" 
                  icon="pi pi-search" 
                  @click="handleSearch" 
                  class="p-button-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Featured Listings Section -->
    <section class="featured-listings">
      <div class="section-header">
        <h2>Featured Rentals</h2>
        <Button 
          label="View All Listings" 
          icon="pi pi-arrow-right" 
          class="p-button-text" 
          @click="router.push('/listings')"
        />
      </div>
      
      <div v-if="loading" class="loading-container">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      </div>
      
      <div v-else class="listings-grid">
        <div v-for="listing in featuredListings" :key="listing.id" class="listing-card">
          <Card>
            <template #header>
              <div class="listing-image-container">
                <img :src="`${listing.images[0]}?auto=format&fit=crop&w=600&h=400`" 
                     :alt="listing.title" 
                     class="listing-image" />
                <div class="listing-price">${{ listing.price }}/mo</div>
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
    </section>
    
    <!-- How It Works Section -->
    <section class="how-it-works">
      <h2>How RentRadar Works</h2>
      
      <div class="steps-container">
        <div class="step">
          <div class="step-icon">
            <i class="pi pi-search"></i>
          </div>
          <h3>Search Properties</h3>
          <p>Browse through thousands of rental listings with detailed filters.</p>
        </div>
        
        <div class="step">
          <div class="step-icon">
            <i class="pi pi-bell"></i>
          </div>
          <h3>Set Alerts</h3>
          <p>Create custom alerts and get notified when new matching properties are listed.</p>
        </div>
        
        <div class="step">
          <div class="step-icon">
            <i class="pi pi-heart"></i>
          </div>
          <h3>Save Favorites</h3>
          <p>Keep track of properties you love and compare them later.</p>
        </div>
        
        <div class="step">
          <div class="step-icon">
            <i class="pi pi-home"></i>
          </div>
          <h3>Find Your Home</h3>
          <p>Contact landlords directly and secure your perfect rental property.</p>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Start Your Rental Search Today</h2>
        <p>Create a free account to save searches, set alerts, and find your perfect home.</p>
        <Button 
          label="Sign Up Now" 
          icon="pi pi-user-plus" 
          class="p-button-lg" 
          @click="router.push('/signup')"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  margin-bottom: 2rem;
}

/* Hero section */
.hero {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-800) 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* Search form */
.search-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.search-filters .p-field {
  flex: 1;
  min-width: 150px;
}

.price-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  max-width: 120px;
}

.location-input {
  width: 100%;
}

.search-button {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

/* Featured listings */
.featured-listings {
  margin: 3rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

.listing-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.listing-location {
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
}

.listing-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.listing-details span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.listing-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* How it works section */
.how-it-works {
  text-align: center;
  margin: 4rem 0;
}

.steps-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.step {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.step-icon {
  background: var(--primary-color);
  color: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.step-icon i {
  font-size: 2rem;
}

/* CTA section */
.cta-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-800) 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 8px;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-section h2 {
  margin-bottom: 1rem;
}

.cta-section p {
  margin-bottom: 2rem;
  opacity: 0.9;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .steps-container {
    flex-direction: column;
    align-items: center;
  }
  
  .step {
    margin-bottom: 2rem;
  }
}
</style>
