<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
});

const ratingStars = computed(() => {
  return '★'.repeat(Math.floor(props.recipe.rating)) + '☆'.repeat(5 - Math.floor(props.recipe.rating));
});

const tagsList = computed(() => {
  return props.recipe.tags.join(', ');
});
</script>

<template>
  <div class="recipe-card" v-voix="'recipe-' + recipe.id">
    <RouterLink :to="{ name: 'recipe-detail', params: { id: recipe.id } }">
      <img :src="recipe.imageURL" :alt="recipe.title" class="recipe-image" 
          v-voix="'recipe-image-' + recipe.id" hint="Recipe thumbnail image"> 
      <div class="recipe-content">
        <h3 class="recipe-title" v-voix="'recipe-title-' + recipe.id">{{ recipe.title }}</h3>
        <p class="recipe-description" v-voix="'recipe-description-' + recipe.id">{{ recipe.description }}</p>
        <div class="recipe-meta">
          <span class="recipe-rating" v-voix="'recipe-rating-' + recipe.id" 
                hint="Rating out of 5 stars">{{ ratingStars }} ({{ recipe.rating }})</span>
          <span class="recipe-prep-time" v-voix="'recipe-time-' + recipe.id">
            {{ recipe.prepTime }} prep | {{ recipe.cookTime }} cook
          </span>
        </div>
        <div class="recipe-tags" v-voix="'recipe-tags-' + recipe.id" hint="Recipe categories">
          {{ tagsList }}
        </div>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.recipe-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  height: 100%;
  max-width: 100%;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.recipe-card a {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  max-width: 100%;
  display: block;
}

.recipe-content {
  padding: 16px;
}

.recipe-title {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 1.2rem;
  color: #333;
}

.recipe-description {
  color: #666;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.recipe-rating {
  color: #f8b400;
}

.recipe-tags {
  font-size: 0.8rem;
  color: #888;
}
</style>