<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import recipeStore from '../store/recipeStore';
import { renderMarkdown } from '../utils/markdown';

const router = useRouter();

// Form data
const recipeForm = ref({
  title: '',
  description: '',
  cuisine: '',
  prepTime: '',
  cookTime: '',
  servings: '',
  difficulty: 'Easy',
  ingredients: '',
  instructions: '',
  imageURL: 'https://source.unsplash.com/random/300x200/?food',
  tags: ''
});

// Available cuisines from existing recipes
const cuisines = computed(() => {
  const cuisineSet = new Set(recipeStore.recipes.map(recipe => recipe.cuisine));
  return Array.from(cuisineSet);
});

// Form validation
const errors = ref({});
const isSubmitting = ref(false);
const showPreview = ref(false);

// Computed properties for form processing
const formattedIngredients = computed(() => {
  if (!recipeForm.value.ingredients) return [];
  return recipeForm.value.ingredients.split('\n').filter(line => line.trim() !== '');
});

const formattedTags = computed(() => {
  if (!recipeForm.value.tags) return [];
  return recipeForm.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
});

// Preview computed property
const markdownPreview = computed(() => {
  return renderMarkdown(recipeForm.value.instructions);
});

// Validate form
function validateForm() {
  const newErrors = {};
  
  if (!recipeForm.value.title) {
    newErrors.title = 'Title is required';
  }
  
  if (!recipeForm.value.description) {
    newErrors.description = 'Description is required';
  }
  
  if (!recipeForm.value.cuisine) {
    newErrors.cuisine = 'Cuisine is required';
  }
  
  if (!recipeForm.value.ingredients) {
    newErrors.ingredients = 'At least one ingredient is required';
  }
  
  if (!recipeForm.value.instructions) {
    newErrors.instructions = 'Instructions are required';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

// Toggle preview
function togglePreview() {
  showPreview.value = !showPreview.value;
}

// Submit form
function submitRecipe() {
  if (!validateForm()) {
    // Scroll to first error
    const firstErrorField = Object.keys(errors.value)[0];
    document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  
  isSubmitting.value = true;
  
  // Create recipe object
  const newRecipe = {
    title: recipeForm.value.title,
    description: recipeForm.value.description,
    cuisine: recipeForm.value.cuisine,
    prepTime: recipeForm.value.prepTime,
    cookTime: recipeForm.value.cookTime,
    servings: parseInt(recipeForm.value.servings, 10) || 1,
    difficulty: recipeForm.value.difficulty,
    ingredients: formattedIngredients.value,
    instructions: recipeForm.value.instructions,
    imageURL: recipeForm.value.imageURL,
    tags: formattedTags.value
  };
  
  // Add recipe to store
  const addedRecipe = recipeStore.addRecipe(newRecipe);
  
  // Simulate delay for feedback
  setTimeout(() => {
    isSubmitting.value = false;
    // Navigate to the recipe detail page
    router.push({ name: 'recipe-detail', params: { id: addedRecipe.id } });
  }, 1000);
}

// Markdown tips
const markdownTips = `
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point
- Another bullet point

1. Numbered item
2. Another numbered item

`;
</script>

<template>
  <div class="add-recipe-view" v-voix="'add-recipe-view'" hint="Form to create a new recipe">
    <h1 v-voix="'add-recipe-heading'">Add a New Recipe</h1>
    
    <form @submit.prevent="submitRecipe" class="recipe-form">
      <div class="form-section">
        <h2 v-voix="'basic-info-heading'">Basic Information</h2>
        
        <div class="form-group">
          <label for="title" v-voix="'title-label'">Recipe Title *</label>
          <input 
            type="text" 
            id="title" 
            v-model="recipeForm.title" 
            class="form-control"
            :class="{ 'is-invalid': errors.title }"
            v-voix="'title-input'"
            hint="Enter the name of your recipe"
          />
          <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
        </div>
        
        <div class="form-group">
          <label for="description" v-voix="'description-label'">Description *</label>
          <textarea 
            id="description" 
            v-model="recipeForm.description" 
            class="form-control"
            :class="{ 'is-invalid': errors.description }"
            rows="3"
            v-voix="'description-input'"
            hint="Write a short description of your recipe"
          ></textarea>
          <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="cuisine" v-voix="'cuisine-label'">Cuisine *</label>
            <select 
              id="cuisine" 
              v-model="recipeForm.cuisine" 
              class="form-control"
              :class="{ 'is-invalid': errors.cuisine }"
              v-voix="'cuisine-input'"
              hint="Select or enter the cuisine type"
            >
              <option value="" disabled>Select cuisine</option>
              <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">{{ cuisine }}</option>
              <option value="Other">Other</option>
            </select>
            <div v-if="errors.cuisine" class="error-message">{{ errors.cuisine }}</div>
          </div>
          
          <div class="form-group">
            <label for="difficulty" v-voix="'difficulty-label'">Difficulty</label>
            <select 
              id="difficulty" 
              v-model="recipeForm.difficulty" 
              class="form-control"
              v-voix="'difficulty-input'"
              hint="Select the recipe difficulty level"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="prep-time" v-voix="'prep-time-label'">Preparation Time</label>
            <input 
              type="text" 
              id="prep-time" 
              v-model="recipeForm.prepTime" 
              placeholder="e.g. 15 minutes"
              class="form-control"
              v-voix="'prep-time-input'"
              hint="Enter the preparation time for the recipe"
            />
          </div>
          
          <div class="form-group">
            <label for="cook-time" v-voix="'cook-time-label'">Cooking Time</label>
            <input 
              type="text" 
              id="cook-time" 
              v-model="recipeForm.cookTime" 
              placeholder="e.g. 30 minutes"
              class="form-control"
              v-voix="'cook-time-input'"
              hint="Enter the cooking time for the recipe"
            />
          </div>
          
          <div class="form-group">
            <label for="servings" v-voix="'servings-label'">Servings</label>
            <input 
              type="number" 
              id="servings" 
              v-model="recipeForm.servings" 
              class="form-control"
              v-voix="'servings-input'"
              hint="Enter the number of servings"
              min="1"
            />
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <h2 v-voix="'ingredients-heading'">Ingredients *</h2>
        <div class="form-group">
          <label for="ingredients" v-voix="'ingredients-label'">
            List each ingredient on a new line
          </label>
          <textarea 
            id="ingredients" 
            v-model="recipeForm.ingredients" 
            rows="8"
            class="form-control"
            :class="{ 'is-invalid': errors.ingredients }"
            placeholder="e.g.&#10;2 cups flour&#10;1 tsp salt&#10;1/2 cup sugar"
            v-voix="'ingredients-input'"
            hint="Enter each ingredient on a new line"
          ></textarea>
          <div v-if="errors.ingredients" class="error-message">{{ errors.ingredients }}</div>
        </div>
      </div>
      
      <div class="form-section">
        <h2 v-voix="'instructions-heading'">Instructions *</h2>
        <div class="form-group">
          <div class="instructions-header">
            <label for="instructions" v-voix="'instructions-label'">
              Enter recipe instructions using markdown
            </label>
            <button 
              type="button" 
              @click="togglePreview" 
              class="preview-button"
              v-voix="'preview-button'"
              hint="Toggle between edit and preview mode"
            >
              {{ showPreview ? 'Edit' : 'Preview' }}
            </button>
          </div>
          
          <div v-if="!showPreview">
            <textarea 
              id="instructions" 
              v-model="recipeForm.instructions" 
              rows="12"
              class="form-control"
              :class="{ 'is-invalid': errors.instructions }"
              placeholder="# Recipe Title&#10;&#10;## Step 1&#10;Mix ingredients...&#10;&#10;## Step 2&#10;Bake at 350°F..."
              v-voix="'instructions-input'"
              hint="Enter the step-by-step instructions using markdown formatting"
            ></textarea>
            <div class="markdown-tips" v-voix="'markdown-tips'">
              <p>Markdown formatting tips:</p>
              <pre>{{ markdownTips }}</pre>
            </div>
          </div>
          
          <div v-else class="markdown-preview" v-voix="'markdown-preview'" hint="Preview of formatted instructions">
            <div v-html="markdownPreview"></div>
          </div>
          
          <div v-if="errors.instructions" class="error-message">{{ errors.instructions }}</div>
        </div>
      </div>
      
      <div class="form-section">
        <h2 v-voix="'additional-info-heading'">Additional Information</h2>
        
        <div class="form-group">
          <label for="tags" v-voix="'tags-label'">Tags (comma-separated)</label>
          <input 
            type="text" 
            id="tags" 
            v-model="recipeForm.tags" 
            placeholder="e.g. Vegetarian, Breakfast, Quick"
            class="form-control"
            v-voix="'tags-input'"
            hint="Enter tags separated by commas"
          />
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          type="submit" 
          class="submit-button" 
          :disabled="isSubmitting"
          v-voix="'submit-button'"
          hint="Click to submit your recipe"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Recipe' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-recipe-view {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.form-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.instructions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.preview-button {
  padding: 0.4rem 0.8rem;
  background-color: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-button:hover {
  background-color: #e9ecef;
}

.markdown-preview {
  min-height: 200px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.markdown-tips {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.markdown-tips pre {
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
}

.form-actions {
  text-align: center;
  margin-top: 2rem;
}

.submit-button {
  padding: 0.8rem 1.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #ff5252;
  transform: translateY(-2px);
}

.submit-button:disabled {
  background-color: #ffa5a5;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-row .form-group {
    margin-bottom: 0;
  }
}
</style>