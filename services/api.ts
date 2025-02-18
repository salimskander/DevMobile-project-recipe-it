import { MealDBResponse, Recipe } from '~/types/recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const api = {
  getRandomMeal: async (): Promise<Recipe> => {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data: MealDBResponse = await response.json();
    return data.meals[0];
  },

  getMealById: async (id: string): Promise<Recipe | null> => {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data: MealDBResponse = await response.json();
    return data.meals?.[0] || null;
  }
};
