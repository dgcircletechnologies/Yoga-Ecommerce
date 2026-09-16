import type { Category } from "@/types/category";

const categoryNames = ["Yoga Mats", "Yoga Accessories", "Meditation", "Clothing", "Men's Yoga Wear", "Women's Yoga Wear", "Yoga Blocks", "Yoga Straps", "Meditation Cushions", "Wellness", "Fitness Accessories", "Yoga Equipment", "Breathwork", "Aromatherapy", "Home Practice", "Recovery Tools", "Mindful Living", "Travel Essentials", "Eco-Friendly Gear", "Pilates Support", "Balance Training", "Relaxation", "Yoga Towels", "Studio Essentials", "Guided Practice"];

const images = ["/lotuslab/classes-1.png", "/lotuslab/classes-2.png", "/lotuslab/classes-3.png", "/lotuslab/classes-4.png", "/lotuslab/classes-5.png", "/lotuslab/classes-6.png"];

export const categories: Category[] = categoryNames.map((name, index) => ({ id: `cat-${String(index + 1).padStart(3, "0")}`, name, description: `${name} thoughtfully chosen for a steady, supported practice.`, productCount: (index * 3 + 4) % 28 + 2, image: images[index % images.length], createdAt: new Date(Date.UTC(2026, 0, 5 + index * 4)).toISOString().slice(0, 10) }));
