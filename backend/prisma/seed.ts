import 'dotenv/config';
import * as argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required to seed the database');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const name = process.env.SEED_ADMIN_NAME?.trim();
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      'SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD are required to seed the admin user',
    );
  }

  if (password.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 8 characters long');
  }

  const passwordHash = await argon2.hash(password);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, password: passwordHash, role: 'ADMIN' },
    create: { name, email, password: passwordHash, role: 'ADMIN' },
    select: { id: true, email: true, role: true },
  });

  console.log(`Admin user seeded: ${admin.email} (${admin.id})`);

  const categories = [
    {
      name: 'Yoga Essentials',
      slug: 'yoga-essentials',
      description: 'Everyday equipment and accessories for a comfortable yoga practice.',
      imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Wellness & Recovery',
      slug: 'wellness-recovery',
      description: 'Thoughtfully selected products to support rest, recovery, and mindfulness.',
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Apparel',
      slug: 'apparel',
      description: 'Lightweight, flexible clothing made for movement and calm.',
      imageUrl: 'https://images.unsplash.com/photo-1506629905607-d9a4a7d8a8e4?auto=format&fit=crop&w=900&q=80',
    },
  ];

  const categoryBySlug = new Map<string, { id: string }>();
  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        images: [category.imageUrl],
      },
      create: {
        ...category,
        images: [category.imageUrl],
      },
      select: { id: true },
    });
    categoryBySlug.set(category.slug, saved);
  }

  const products = [
    {
      name: 'Cork Alignment Yoga Mat',
      slug: 'cork-alignment-yoga-mat',
      categorySlug: 'yoga-essentials',
      description: 'A supportive, non-slip cork mat with alignment guides for home or studio practice.',
      price: '68.00',
      stock: 24,
      tags: ['BEST_SELLER', 'ECO_FRIENDLY'],
      imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Organic Cotton Yoga Strap',
      slug: 'organic-cotton-yoga-strap',
      categorySlug: 'yoga-essentials',
      description: 'A soft, durable strap for stretching, balance, and deeper poses.',
      price: '18.00',
      stock: 60,
      tags: ['ECO_FRIENDLY'],
      imageUrl: 'https://images.unsplash.com/photo-1599447421409-7c9a2b6d3a2a?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Lavender Eye Pillow',
      slug: 'lavender-eye-pillow',
      categorySlug: 'wellness-recovery',
      description: 'A calming weighted eye pillow filled with lavender for savasana and meditation.',
      price: '22.00',
      stock: 35,
      tags: ['RELAXATION'],
      imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Bamboo Lounge Set',
      slug: 'bamboo-lounge-set',
      categorySlug: 'apparel',
      description: 'A breathable bamboo-fabric set for warmups, cooldowns, and slow weekends.',
      price: '74.00',
      stock: 18,
      tags: ['NEW', 'ECO_FRIENDLY'],
      imageUrl: 'https://images.unsplash.com/photo-1506629905607-d9a4a7d8a8e4?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Mindful Morning Starter Combo',
      slug: 'mindful-morning-starter-combo',
      categorySlug: 'yoga-essentials',
      description: 'A simple daily-practice bundle with a cork mat, cotton strap, and eye pillow.',
      price: '96.00',
      stock: 12,
      tags: ['COMBO', 'BEST_SELLER'],
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Restorative Practice Combo',
      slug: 'restorative-practice-combo',
      categorySlug: 'wellness-recovery',
      description: 'A restorative set for gentle practice, breathwork, and post-session recovery.',
      price: '118.00',
      stock: 10,
      tags: ['COMBO', 'RELAXATION'],
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Studio-to-Street Combo',
      slug: 'studio-to-street-combo',
      categorySlug: 'apparel',
      description: 'A flexible apparel bundle designed to move from the studio into the rest of your day.',
      price: '132.00',
      stock: 8,
      tags: ['COMBO', 'NEW'],
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    },
  ];

  for (const product of products) {
    const category = categoryBySlug.get(product.categorySlug);
    if (!category) throw new Error(`Missing category for product ${product.slug}`);

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: category.id,
        tags: product.tags,
        images: [product.imageUrl],
        isActive: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: category.id,
        tags: product.tags,
        images: [product.imageUrl],
      },
    });
  }

  const services = [
    {
      name: 'Beginner Yoga Foundations',
      slug: 'beginner-yoga-foundations',
      description: 'Build confidence with alignment, breathing, and foundational yoga postures.',
      price: '120.00',
      sessions: 4,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Private Mindfulness Coaching',
      slug: 'private-mindfulness-coaching',
      description: 'Personalized one-to-one guidance for building a sustainable mindfulness routine.',
      price: '85.00',
      sessions: 1,
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Restorative Yoga Series',
      slug: 'restorative-yoga-series',
      description: 'A gentle multi-session series focused on relaxation, mobility, and recovery.',
      price: '180.00',
      sessions: 6,
      imageUrl: 'https://images.unsplash.com/photo-1510894347719-fc735f0c65b7?auto=format&fit=crop&w=900&q=80',
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        description: service.description,
        price: service.price,
        sessions: service.sessions,
        status: 'ACTIVE',
        images: [service.imageUrl],
      },
      create: {
        name: service.name,
        slug: service.slug,
        description: service.description,
        price: service.price,
        sessions: service.sessions,
        images: [service.imageUrl],
        status: 'ACTIVE',
      },
    });
  }

  console.log(`Catalog seeded: ${categories.length} categories, ${products.length} products, ${services.length} services`);
}

main()
  .catch((error: unknown) => {
    console.error('Admin seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
