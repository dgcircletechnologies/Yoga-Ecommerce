export type Product = {
  id?: string;
  slug?: string;
  name: string;
  category: string;
  description: string;
  details?: string;
  price: string;
  image: string;
  badge?: string;
  stock: string;
};

export type ProductCategory = {
  id?: string;
  name: string;
  detail: string;
  description: string;
  image: string;
};
