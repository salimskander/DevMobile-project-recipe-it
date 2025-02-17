export type Recipe = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
};

export type Section = {
  id: string;
  title: string;
  subtitle: string;
  data: Recipe[];
};
