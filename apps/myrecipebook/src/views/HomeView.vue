<script setup>
import { RouterLink } from 'vue-router';
import RecipeCard from '../components/RecipeCard.vue';
import recipeStore from '../store/recipeStore';
import { computed } from 'vue';

// Featured recipes (top 3 highest rated)
const featuredRecipes = computed(() => {
  return [...recipeStore.recipes]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
});
</script>

<template>
  <div class="home-view" v-voix="'home-view'" hint="Home page with featured recipes and introduction">
    <section class="hero" v-voix="'hero-section'">
      <div class="hero-content">
        <h1 v-voix="'welcome-heading'">Welcome to MyRecipeBook</h1>
        <p v-voix="'welcome-description'">
          Discover, share, and create delicious recipes from around the world.
          Join our community of food lovers and culinary enthusiasts.
        </p>
        <div class="cta-buttons">
          <RouterLink to="/recipes" class="cta-button primary" v-voix="'browse-recipes-button'" hint="Navigate to recipes page">
            Browse Recipes
          </RouterLink>
          <RouterLink to="/add" class="cta-button secondary" v-voix="'add-recipe-button'" hint="Navigate to add recipe page">
            Share Your Recipe
          </RouterLink>
        </div>
      </div>
    </section>
    
    <section class="featured-recipes" v-voix="'featured-recipes-section'">
      <h2 v-voix="'featured-recipes-heading'">Featured Recipes</h2>
      <div class="recipe-grid">
        <RecipeCard v-for="recipe in featuredRecipes" :key="recipe.id" :recipe="recipe" />
      </div>
      <div class="view-all-container">
        <RouterLink to="/recipes" class="view-all-link" v-voix="'view-all-recipes-link'" hint="Navigate to recipes page">
          View All Recipes
        </RouterLink>
      </div>
    </section>
    
    <section class="about-section" v-voix="'about-section'">
      <h2 v-voix="'about-heading'">About MyRecipeBook</h2>
      <div class="about-content">
        <div class="about-text">
          <p v-voix="'about-paragraph-1'">
            MyRecipeBook is a platform designed for food enthusiasts to discover and share their favorite recipes.
            Whether you're a professional chef or a home cook, you'll find inspiration in our diverse collection.
          </p>
          <p v-voix="'about-paragraph-2'">
            Our mission is to bring people together through the joy of cooking and eating. We believe that food
            is not just nourishment but a way to express creativity and share cultural heritage.
          </p>
          <RouterLink to="/about" class="learn-more-link" v-voix="'learn-more-link'" hint="Navigate to about page">
            Learn More About Us
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  padding-bottom: 2rem;
  width: 100%;
  max-width: 100%;
}

/* Hero section */
.hero {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  color: white;
  text-align: center;
  padding: 4rem 2rem;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background-color: #ff6b6b;
  color: white;
  border: none;
}

.cta-button.primary:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
}

.cta-button.secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.cta-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Featured recipes section */
.featured-recipes {
  margin: 3rem 0;
}

.featured-recipes h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
}

.view-all-container {
  text-align: center;
  margin-top: 2rem;
}

.view-all-link {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #f8f9fa;
  color: #ff6b6b;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  background-color: #ff6b6b;
  color: white;
}

/* About section */
.about-section {
  background-color: #f8f9fa;
  padding: 3rem 2rem;
  border-radius: 8px;
  margin: 3rem 0;
}

.about-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
}

.about-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.about-text {
  max-width: 700px;
}

.about-text p {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.learn-more-link {
  display: inline-block;
  color: #ff6b6b;
  text-decoration: none;
  font-weight: bold;
  margin-top: 1rem;
  transition: color 0.3s ease;
}

.learn-more-link:hover {
  color: #ff5252;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero {
    padding: 3rem 1rem;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .about-content {
    flex-direction: column;
  }
}
</style>
