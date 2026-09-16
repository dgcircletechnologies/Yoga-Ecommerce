export type Product = {
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
  name: string;
  detail: string;
  description: string;
  image: string;
};
