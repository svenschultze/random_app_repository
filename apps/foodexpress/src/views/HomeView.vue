<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRestaurantStore } from '@/stores/foodStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const { restaurants, generateRestaurants } = useRestaurantStore()
const searchQuery = ref('')
const selectedCuisine = ref('All')

// Generate restaurants on component mount if none exist
onMounted(() => {
  if (restaurants.value.length === 0) {
    generateRestaurants()
  }
})

const cuisines = computed(() => {
  const uniqueCuisines = new Set()
  uniqueCuisines.add('All')
  
  restaurants.value.forEach(restaurant => {
    uniqueCuisines.add(restaurant.cuisine)
  })
  
  return Array.from(uniqueCuisines)
})

const filteredRestaurants = computed(() => {
  return restaurants.value.filter(restaurant => {
    // Filter by cuisine
    const matchesCuisine = selectedCuisine.value === 'All' || restaurant.cuisine === selectedCuisine.value
    
    // Filter by search query
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          restaurant.cuisine.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          restaurant.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    return matchesCuisine && matchesSearch
  })
})

function goToRestaurant(restaurantId) {
  console.log('Navigating to restaurant:', restaurantId)
  router.push({ 
    name: 'restaurant', 
    params: { id: restaurantId.toString() } 
  })
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>Food Delivery Made Simple</h1>
      <p>Browse our selection of restaurants and order your favorite meals</p>
    </section>
    
    <section class="filters">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search restaurants..." 
          v-voix="'SearchInput'"
          hint="Type to search for restaurants by name or cuisine"
        />
      </div>
      
      <div class="cuisine-filter">
        <label for="cuisine-select" v-voix="'CuisineFilterLabel'">Filter by cuisine:</label>
        <select 
          id="cuisine-select" 
          v-model="selectedCuisine"
          v-voix="'CuisineSelect'"
          hint="Select a cuisine type to filter restaurants"
        >
          <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">
            {{ cuisine }}
          </option>
        </select>
      </div>
    </section>
    
    <section class="restaurant-list">
      <div v-if="filteredRestaurants.length === 0" class="no-results">
        <p>No restaurants found. Try adjusting your search filters.</p>
      </div>
      
      <div 
        v-else 
        v-for="restaurant in filteredRestaurants" 
        :key="restaurant.id"
        class="restaurant-card"
        v-voix="`Restaurant_${restaurant.id}`"
        :hint="`${restaurant.name}, ${restaurant.cuisine} restaurant. Click to view menu`"
      >
        <img :src="restaurant.image" :alt="restaurant.name" class="restaurant-image" @click.stop="goToRestaurant(restaurant.id)" />
        <div class="restaurant-info">
          <h2 @click.stop="goToRestaurant(restaurant.id)">{{ restaurant.name }}</h2>
          <div class="restaurant-meta">
            <span class="cuisine-tag">{{ restaurant.cuisine }}</span>
            <span class="rating">⭐ {{ restaurant.rating.toFixed(1) }}</span>
          </div>
          <p class="description">{{ restaurant.description }}</p>
          <button 
            class="view-menu-btn"
            @click.stop="goToRestaurant(restaurant.id)"
            v-voix="`ViewMenu_${restaurant.id}`" 
            hint="Click to view restaurant menu"
          >
            View Menu
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  text-align: center;
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.hero p {
  font-size: 1.2rem;
  color: #666;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 200px;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.cuisine-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cuisine-filter select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}


.restaurant-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.restaurant-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.restaurant-image, .restaurant-info h2, .view-menu-btn {
  cursor: pointer;
}

.restaurant-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.restaurant-info {
  padding: 1.5rem;
}

.restaurant-info h2 {
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
  color: var(--text-color);
}

.restaurant-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.cuisine-tag {
  background-color: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.rating {
  font-weight: bold;
}

.description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.view-menu-btn {
  display: block;
  width: 100%;
  padding: 0.75rem;
  text-align: center;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.view-menu-btn:hover {
  background-color: #ff5252;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  background-color: var(--card-bg);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar, .cuisine-filter {
    width: 100%;
  }
}
</style>
