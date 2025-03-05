<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import recipeStore from '../store/recipeStore';
import { renderMarkdown } from '../utils/markdown';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const recipe = ref(null);
const isFavorite = ref(false);

const instructionsHtml = computed(() => {
  if (!recipe.value) return '';
  return renderMarkdown(recipe.value.instructions);
});

// Format ingredients list
const formattedIngredients = computed(() => {
  if (!recipe.value) return [];
  return recipe.value.ingredients;
});

// Rating stars display
const ratingStars = computed(() => {
  if (!recipe.value) return '';
  return '★'.repeat(Math.floor(recipe.value.rating)) + '☆'.repeat(5 - Math.floor(recipe.value.rating));
});

// Toggle favorite status
function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
}

// Function to get a recipe by id
function getRecipeById(id) {
  const numId = parseInt(id, 10);
  return recipeStore.recipes.find(recipe => recipe.id === numId);
}

// Load recipe data
onMounted(() => {
  const recipeData = getRecipeById(props.id);
  if (recipeData) {
    recipe.value = recipeData;
  } else {
    // Redirect to recipes list if recipe not found
    router.push({ name: 'recipes' });
  }
});
</script>

<template>
  <div v-if="recipe" class="recipe-detail" v-voix="'recipe-detail-view'" hint="Detailed view of a specific recipe">
    <div class="recipe-header">
      <h1 v-voix="'recipe-title'">{{ recipe.title }}</h1>
      <div class="recipe-meta">
        <span class="recipe-cuisine" v-voix="'recipe-cuisine'">{{ recipe.cuisine }}</span>
        <span class="recipe-rating" v-voix="'recipe-rating'" hint="Recipe rating out of 5 stars">
          {{ ratingStars }} ({{ recipe.rating }})
        </span>
      </div>
    </div>
    
    <div class="recipe-image-container">
      <img :src="recipe.imageURL" :alt="recipe.title" class="recipe-image" v-voix="'recipe-image'" />
    </div>
    
    <div class="recipe-actions">
      <button 
        @click="toggleFavorite" 
        class="action-button" 
        :class="{ favorite: isFavorite }"
        v-voix="'favorite-button'" 
        hint="Click to save this recipe to favorites"
      >
        {{ isFavorite ? 'Saved to Favorites' : 'Add to Favorites' }}
      </button>
    </div>
    
    <div class="recipe-info-container">
      <div class="recipe-details">
        <div class="detail-item" v-voix="'prep-time'">
          <span class="detail-label">Prep Time:</span>
          <span class="detail-value">{{ recipe.prepTime }}</span>
        </div>
        <div class="detail-item" v-voix="'cook-time'">
          <span class="detail-label">Cook Time:</span>
          <span class="detail-value">{{ recipe.cookTime }}</span>
        </div>
        <div class="detail-item" v-voix="'servings'">
          <span class="detail-label">Servings:</span>
          <span class="detail-value">{{ recipe.servings }}</span>
        </div>
        <div class="detail-item" v-voix="'difficulty'">
          <span class="detail-label">Difficulty:</span>
          <span class="detail-value">{{ recipe.difficulty }}</span>
        </div>
      </div>
      
      <div class="recipe-description" v-voix="'recipe-description'">
        <p>{{ recipe.description }}</p>
      </div>
    </div>
    
    <div class="recipe-content">
      <div class="ingredients-section">
        <h2 v-voix="'ingredients-heading'">Ingredients</h2>
        <ul class="ingredients-list">
          <li v-for="(ingredient, index) in formattedIngredients" :key="index" 
              v-voix="'ingredient-' + index" hint="Required ingredient">
            {{ ingredient }}
          </li>
        </ul>
      </div>
      
      <div class="instructions-section">
        <h2 v-voix="'instructions-heading'">Instructions</h2>
        <div class="markdown-content" v-html="instructionsHtml" v-voix="'instructions-content'" 
             hint="Step by step recipe instructions"></div>
      </div>
    </div>
    
    <div class="comments-section" v-voix="'comments-section'">
      <h2 v-voix="'comments-heading'">Comments</h2>
      <div class="comments-list">
        <div v-if="recipe.comments.length > 0">
          <div v-for="comment in recipe.comments" :key="comment.id" class="comment"
               v-voix="'comment-' + comment.id">
            <div class="comment-header">
              <span class="comment-user">{{ comment.user }}</span>
              <span class="comment-date">{{ comment.date }}</span>
              <span class="comment-rating">{{ '★'.repeat(comment.rating) }}</span>
            </div>
            <p class="comment-text">{{ comment.text }}</p>
          </div>
        </div>
        <div v-else class="no-comments" v-voix="'no-comments'">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="loading" v-voix="'loading-recipe'">
    <p>Loading recipe...</p>
  </div>
</template>

<style scoped>
.recipe-detail {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.recipe-header {
  text-align: center;
  margin-bottom: 2rem;
}

.recipe-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.recipe-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #666;
}

.recipe-rating {
  color: #f8b400;
}

.recipe-image-container {
  margin-bottom: 2rem;
  text-align: center;
}

.recipe-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: block;
  object-fit: contain;
}

.recipe-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.action-button {
  padding: 0.8rem 1.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
}

.action-button.favorite {
  background-color: #4caf50;
}

.recipe-info-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.recipe-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.detail-item {
  flex: 1;
  min-width: 150px;
}

.detail-label {
  font-weight: bold;
  color: #666;
}

.recipe-description {
  font-size: 1.1rem;
  line-height: 1.6;
}

.recipe-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 3rem;
  width: 100%;
}

.ingredients-section, .instructions-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.ingredients-section h2, .instructions-section h2, .comments-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.ingredients-list {
  padding-left: 1.5rem;
  margin: 0;
}

.ingredients-list li {
  margin-bottom: 0.8rem;
  list-style-type: circle;
}

.markdown-content {
  line-height: 1.8;
}

.markdown-content h1, .markdown-content h2, .markdown-content h3 {
  color: #333;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-content p {
  margin-bottom: 1rem;
}

.markdown-content ul, .markdown-content ol {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.markdown-content li {
  margin-bottom: 0.5rem;
}

.comments-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comment {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.comment:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  color: #666;
}

.comment-user {
  font-weight: bold;
}

.comment-rating {
  color: #f8b400;
}

.comment-text {
  margin: 0;
  line-height: 1.6;
}

.no-comments {
  color: #666;
  font-style: italic;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .recipe-content {
    grid-template-columns: 1fr;
  }
  
  .recipe-details {
    flex-direction: column;
    gap: 1rem;
  }
  
  .comment-header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>