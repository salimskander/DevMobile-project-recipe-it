import { MealDBResponse, Recipe } from '~/types/recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const generateRandomPrice = () => {
  return (Math.random() * (25 - 8) + 8).toFixed(2);
};

const addPriceToRecipe = (recipe: Recipe): Recipe => {
  return {
    ...recipe,
    price: generateRandomPrice()
  };
};

export const api = {
  getRandomMeal: async (): Promise<Recipe> => {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data: MealDBResponse = await response.json();
    return addPriceToRecipe(data.meals[0]);
  },

  getMealById: async (id: string): Promise<Recipe | null> => {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data: MealDBResponse = await response.json();
    return data.meals?.[0] ? addPriceToRecipe(data.meals[0]) : null;
  },

  searchMeals: async (query: string): Promise<Recipe[]> => {
    try {
      const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
      const data: MealDBResponse = await response.json();

      if (!data.meals) {
        return [];
      }

      return data.meals.map(meal => addPriceToRecipe(meal));
    } catch (error) {
      console.error('Error searching meals:', error);
      return [];
    }
  },
  
  // Get meal suggestions based on a partial search query
  getMealSuggestions: async (query: string): Promise<Recipe[]> => {
    try {
      // Return empty array for empty queries
      if (!query.trim()) {
        return [];
      }
      
      const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
      const data: MealDBResponse = await response.json();

      if (!data.meals) {
        return [];
      }

      // Return only the first 5 suggestions to avoid cluttering the UI
      return data.meals.slice(0, 5).map(meal => addPriceToRecipe(meal));
    } catch (error) {
      console.error('Error getting meal suggestions:', error);
      return [];
    }
  }
};
