import { ref } from 'vue';
import { recipes as initialRecipes } from '../data/recipes';

// Use recipes directly without reactive wrapper since components
// will handle their own reactivity
const recipes = [...initialRecipes];

// Function to add a new recipe
function addRecipe(recipe) {
  const newId = Math.max(...recipes.map(r => r.id)) + 1;
  
  const newRecipe = {
    ...recipe,
    id: newId,
    dateAdded: new Date().toISOString().split('T')[0],
    rating: 0,
    comments: []
  };
  
  recipes.push(newRecipe);
  return newRecipe;
}

// Simple store that just exports recipes and addRecipe function
export default {
  recipes,
  addRecipe
};