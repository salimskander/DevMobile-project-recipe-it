import { useQuery } from '@tanstack/react-query';
import { api } from '~/services/api';
import { Recipe } from '~/types/recipe';

/**
 * Add a fake delay for development to see the skeleton loaders
 */
const addFakeDelay = async <T>(promise: Promise<T>): Promise<T> => {
  // Simulate network delay (1.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));
  return promise;
};

/**
 * Hook to fetch multiple random meals
 * Handles empty responses and retries failed requests
 */
export const useRandomMeals = (count: number) => {
  return useQuery({
    queryKey: ['randomMeals', count],
    queryFn: async () => {
      const mealPromises = Array(count).fill(null).map(() => api.getRandomMeal());
      const meals = await addFakeDelay(Promise.all(mealPromises));
      
      // Filter out any null results
      const validMeals = meals.filter((meal): meal is Recipe => meal !== null);
      
      // If we didn't get enough valid meals, try to get more
      if (validMeals.length < count) {
        console.warn(`Only received ${validMeals.length}/${count} valid meals, filling with placeholders`);
        
        // Create placeholder meals if API returned fewer than requested
        for (let i = validMeals.length; i < count; i++) {
          validMeals.push({
            idMeal: `placeholder-${i}`,
            strMeal: 'Recipe Unavailable',
            strCategory: 'Not Available',
            strArea: 'Unknown',
            strInstructions: 'Recipe information is currently unavailable.',
            strMealThumb: 'https://via.placeholder.com/400x300?text=No+Image',
            strYoutube: '',
            price: '0.00',
            // Add any other required fields
          });
        }
      }
      
      return validMeals;
    },
    // Add error retry and other configurations
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  });
};

/**
 * Hook to fetch a specific meal by ID
 * Handles error states and empty responses
 */
export const useMealById = (id: string) => {
  return useQuery({
    queryKey: ['meal', id],
    queryFn: async () => {
      try {
        const meal = await api.getMealById(id);
        
        // If meal was not found or is invalid
        if (!meal) {
          console.error(`Could not load recipe with ID: ${id}`);
          return null;
        }
        
        // Add additional metadata
        return {
          ...meal,
          price: (Math.random() * (15 - 5) + 5).toFixed(2),
          rating: (Math.random() * (5 - 4) + 4).toFixed(1),
          comments: Math.floor(Math.random() * (999 - 50) + 50),
        };
      } catch (error) {
        console.error(`Error fetching meal ${id}:`, error);
        return null;
      }
    },
    // Add fake delay for development
    select: (data) => addFakeDelay(Promise.resolve(data)),
    // Error retry config
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  });
};
