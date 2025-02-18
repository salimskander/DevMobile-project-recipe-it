export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  price?: string;
  [key: string]: string | null; // Pour les ingrédients dynamiques (strIngredient1, strMeasure1, etc.)
}

export interface MealDBResponse {
  meals: Recipe[];
}

export type Section = {
  id: string;
  title: string;
  subtitle: string;
  data: Recipe[];
};
