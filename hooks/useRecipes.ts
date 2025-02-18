import { useQuery } from '@tanstack/react-query';
import { api } from '~/services/api';

export const useRandomMeals = (count: number) => {
  return useQuery({
    queryKey: ['randomMeals', count],
    queryFn: async () => {
      const meals = await Promise.all(
        Array(count).fill(null).map(() => api.getRandomMeal())
      );
      return meals;
    }
  });
};

export const useMealById = (id: string) => {
  return useQuery({
    queryKey: ['meal', id],
    queryFn: async () => {
      const meal = await api.getMealById(id);
      return {
        ...meal,
        price: (Math.random() * (15 - 5) + 5).toFixed(2),
        rating: (Math.random() * (5 - 4) + 4).toFixed(1),
        comments: Math.floor(Math.random() * (999 - 50) + 50),
      };
    },
  });
};
