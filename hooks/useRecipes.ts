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
    queryFn: () => api.getMealById(id),
  });
};
