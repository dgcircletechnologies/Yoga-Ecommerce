export type ProductAvailability = "Available" | "Unavailable";
export type Product = { id: string; name: string; description: string; categoryId: string; categoryName: string; price: number; stock: number; image: string; tags: string[]; availability: ProductAvailability; createdAt: string; updatedAt: string };
