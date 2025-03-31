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
  }
};
