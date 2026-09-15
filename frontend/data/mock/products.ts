import type { Product, ProductCategory } from "@/types/product";

export const productCategories: ProductCategory[] = [
  { name: "Yoga mats", detail: "Ground your practice", description: "Cushioned, considered mats to support every kind of movement.", image: "/lotuslab/classes-1.png" },
  { name: "Meditation", detail: "Make space to breathe", description: "Quiet tools for slowing down, settling in, and finding stillness.", image: "/lotuslab/classes-5.png" },
  { name: "Props & support", detail: "Move with intention", description: "Thoughtful supports that help you explore your practice with ease.", image: "/lotuslab/classes-3.png" },
];

export const products: Product[] = [
  {
    name: "Sage Align Yoga Mat",
    category: "Yoga mats",
    description: "A softly cushioned, non-slip mat for everyday practice.",
    price: "$68.00",
    image: "/lotuslab/classes-1.png",
    badge: "Bestseller",
    stock: "In stock",
  },
  {
    name: "Stillness Meditation Cushion",
    category: "Meditation",
    description: "Comfortable support for longer, quieter sits.",
    price: "$42.00",
    image: "/lotuslab/classes-5.png",
    stock: "In stock",
  },
  {
    name: "Cork Balance Blocks",
    category: "Props & support",
    description: "Two sturdy cork blocks to deepen and steady your practice.",
    price: "$32.00",
    image: "/lotuslab/classes-3.png",
    badge: "New",
    stock: "Only 8 left",
  },
  {
    name: "Everyday Flow Strap",
    category: "Props & support",
    description: "A durable cotton strap for a little more reach and ease.",
    price: "$18.00",
    image: "/lotuslab/classes-4.png",
    stock: "In stock",
  },
  {
    name: "Lavender Restore Mat",
    category: "Yoga mats",
    description: "A lightweight mat with a calm, soft-touch finish for restorative flow.",
    price: "$58.00",
    image: "/lotuslab/classes-2.png",
    stock: "In stock",
  },
  {
    name: "Quiet Mind Eye Pillow",
    category: "Meditation",
    description: "A softly weighted eye pillow for final rest and stillness.",
    price: "$24.00",
    image: "/lotuslab/classes-6.png",
    badge: "New",
    stock: "In stock",
  },
  {
    name: "Grounded Kneeling Bench",
    category: "Props & support",
    description: "Natural wood support for a more comfortable meditation seat.",
    price: "$74.00",
    image: "/lotuslab/classes-2.png",
    stock: "Only 5 left",
  },
  {
    name: "Practice Day Tote",
    category: "Props & support",
    description: "A roomy everyday carryall for your mat, props, and layers.",
    price: "$46.00",
    image: "/lotuslab/classes-6.png",
    stock: "In stock",
  },
];
