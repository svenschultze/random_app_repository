<script setup>
import { ref, computed, watch } from 'vue';
import RecipeCard from '../components/RecipeCard.vue';
import recipeStore from '../store/recipeStore';

// Get store properties with proper reactivity
const searchQuery = ref('');
const selectedCuisine = ref('');
const sortOption = ref('newest');

// Set up filtered recipes
const filteredRecipes = computed(() => {
  let result = [...recipeStore.recipes];
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(recipe => 
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query)) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Filter by cuisine
  if (selectedCuisine.value && selectedCuisine.value !== 'All') {
    result = result.filter(recipe => recipe.cuisine === selectedCuisine.value);
  }
  
  // Sort recipes
  switch (sortOption.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      break;
    case 'highest-rated':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'alphabetical':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  
  return result;
});

// Get all available cuisines from the recipes
const cuisines = computed(() => {
  const cuisineSet = new Set(recipeStore.recipes.map(recipe => recipe.cuisine));
  return ['All', ...Array.from(cuisineSet)];
});

// Debounce for search
const debouncedSearchQuery = ref('');
const debounceTimeout = ref(null);

function handleSearchInput(event) {
  clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    searchQuery.value = event.target.value;
  }, 300); // 300ms debounce
}

// Watch for empty search field to clear results immediately
watch(debouncedSearchQuery, (newValue) => {
  if (newValue === '') {
    clearTimeout(debounceTimeout.value);
    searchQuery.value = '';
  }
});
</script>

<template>
  <div class="recipes-view" v-voix="'recipes-view'" hint="Recipe listing page with search and filter functionality">
    <h1 v-voix="'recipes-heading'">All Recipes</h1>
    
    <div class="search-filter-container" v-voix="'search-filter-section'" hint="Search and filter controls">
      <div class="search-container">
        <input 
          type="text" 
          placeholder="Search recipes..." 
          :value="debouncedSearchQuery"
          @input="(e) => { debouncedSearchQuery = e.target.value; handleSearchInput(e); }"
          class="search-input"
          v-voix="'search-input'"
          hint="Type to search recipes by title, ingredients, or tags"
        />
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <label for="cuisine-filter" v-voix="'cuisine-filter-label'">Cuisine:</label>
          <select 
            id="cuisine-filter" 
            v-model="selectedCuisine"
            class="filter-select"
            v-voix="'cuisine-filter'"
            hint="Select to filter recipes by cuisine type"
          >
            <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">
              {{ cuisine }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="sort-options" v-voix="'sort-options-label'">Sort by:</label>
          <select 
            id="sort-options" 
            v-model="sortOption"
            class="filter-select"
            v-voix="'sort-options'"
            hint="Select to change recipe sorting order"
          >
            <option value="newest">Newest</option>
            <option value="highest-rated">Highest Rated</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>
    </div>
    
    <div v-if="filteredRecipes.length > 0" class="recipe-grid">
      <RecipeCard 
        v-for="recipe in filteredRecipes" 
        :key="recipe.id" 
        :recipe="recipe" 
      />
    </div>
    
    <div v-else class="no-results" v-voix="'no-recipes-found'">
      <p>No recipes found matching your search criteria.</p>
      <button 
        @click="searchQuery = ''; selectedCuisine = ''; debouncedSearchQuery = ''"
        class="clear-filters-button"
        v-voix="'clear-filters-button'"
        hint="Click to reset search and filter options"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<style scoped>
.recipes-view {
  padding-bottom: 2rem;
  width: 100%;
  max-width: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.search-filter-container {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  min-width: 150px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
}

.no-results {
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.no-results p {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: #666;
}

.clear-filters-button {
  padding: 0.8rem 1.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-filters-button:hover {
  background-color: #ff5252;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }
}
</style>