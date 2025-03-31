import { useQuery } from '@tanstack/react-query';
import { api } from '~/services/api';

// Add a fake delay for development to see the skeleton loaders
const addFakeDelay = async <T>(promise: Promise<T>): Promise<T> => {
  // Simulate network delay (1.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));
  return promise;
};

export const useRandomMeals = (count: number) => {
  return useQuery({
    queryKey: ['randomMeals', count],
    queryFn: async () => {
      const mealsPromise = Promise.all(
        Array(count).fill(null).map(() => api.getRandomMeal())
      );
      // Add fake delay for better skeleton visibility
      return addFakeDelay(mealsPromise);
    }
  });
};

export const useMealById = (id: string) => {
  return useQuery({
    queryKey: ['meal', id],
    queryFn: async () => {
      const mealPromise = api.getMealById(id).then(meal => ({
        ...meal,
        price: (Math.random() * (15 - 5) + 5).toFixed(2),
        rating: (Math.random() * (5 - 4) + 4).toFixed(1),
        comments: Math.floor(Math.random() * (999 - 50) + 50),
      }));
      
      // Add fake delay for better skeleton visibility
      return addFakeDelay(mealPromise);
    },
  });
};
