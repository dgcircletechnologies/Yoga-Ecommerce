export type Product = {
  id?: string;
  slug?: string;
  name: string;
  category: string;
  description: string;
  details?: string;
  price: string;
  shippingIncluded: boolean;
  taxIncluded: boolean;
  image: string;
  badge?: string;
  stock: string;
  tags?: string[];
  weight?: number | null;
  weightUnit?: string | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  dimensionUnit?: string | null;
  material?: string | null;
  color?: string | null;
  manufacturer?: string | null;
  modelNumber?: string | null;
  countryOfOrigin?: string | null;
  careInstructions?: string | null;
};

export type ProductCategory = {
  id?: string;
  name: string;
  detail: string;
  description: string;
  image: string;
};
