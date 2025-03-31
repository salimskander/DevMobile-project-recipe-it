import { MealDBResponse, Recipe } from '~/types/recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Generate a random price for a recipe
 */
const generateRandomPrice = () => {
  return (Math.random() * (25 - 8) + 8).toFixed(2);
};

/**
 * Add a price to a recipe object
 */
const addPriceToRecipe = (recipe: Recipe | null): Recipe | null => {
  if (!recipe) return null;
  return {
    ...recipe,
    price: generateRandomPrice()
  };
};

/**
 * Validates that a recipe object has all required fields
 */
const validateRecipe = (recipe: any): Recipe | null => {
  if (!recipe) return null;
  
  // Check for essential fields
  if (!recipe.idMeal || !recipe.strMeal || !recipe.strMealThumb) {
    console.warn('Invalid recipe data received:', recipe);
    return null;
  }
  
  // Ensure default values for important fields that might be missing
  return {
    ...recipe,
    strCategory: recipe.strCategory || 'Uncategorized',
    strArea: recipe.strArea || 'Unknown',
    strInstructions: recipe.strInstructions || 'No instructions available',
  };
};

export const api = {
  getRandomMeal: async (): Promise<Recipe | null> => {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: MealDBResponse = await response.json();
      
      // Check if we received valid meals data
      if (!data.meals || data.meals.length === 0) {
        console.warn('No meals found in API response');
        return null;
      }
      
      const validatedRecipe = validateRecipe(data.meals[0]);
      return addPriceToRecipe(validatedRecipe);
    } catch (error) {
      console.error('Error fetching random meal:', error);
      return null;
    }
  },

  getMealById: async (id: string): Promise<Recipe | null> => {
    try {
      if (!id) {
        console.warn('Attempted to fetch meal without an ID');
        return null;
      }
      
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: MealDBResponse = await response.json();
      
      // Check if we received valid data
      if (!data.meals || data.meals.length === 0) {
        console.warn(`No meal found with ID: ${id}`);
        return null;
      }
      
      const validatedRecipe = validateRecipe(data.meals[0]);
      return addPriceToRecipe(validatedRecipe);
    } catch (error) {
      console.error(`Error fetching meal with ID ${id}:`, error);
      return null;
    }
  }
};
