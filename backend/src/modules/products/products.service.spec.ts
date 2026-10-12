import { describe, expect, it, vi } from 'vitest';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  const prisma = {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    category: {
      findUnique: vi.fn(),
    },
  };

  const cloudinary = {
    uploadImage: vi.fn(),
    deleteImage: vi.fn(),
  };

  const service = new ProductsService(prisma as any, cloudinary as any);

  it('creates a product with all optional physical and additional specifications', async () => {
    prisma.category.findUnique.mockResolvedValue({ id: 'cat-1', name: 'Yoga Mats', slug: 'yoga-mats' });
    prisma.product.create.mockImplementation(async ({ data }: any) => ({
      id: 'prod-1',
      ...data,
      category: { id: 'cat-1', name: 'Yoga Mats', slug: 'yoga-mats' },
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.create({
      name: 'Organic Cotton Yoga Mat',
      price: 85,
      categoryId: 'cat-1',
      weight: 1.5,
      weightUnit: 'kg',
      length: 180,
      width: 60,
      height: 0.5,
      dimensionUnit: 'cm',
      material: 'Organic Cotton',
      color: 'Sage Green',
      manufacturer: 'Lotus Lab',
      modelNumber: 'LL-MAT-01',
      countryOfOrigin: 'India',
      careInstructions: 'Spot clean with damp cloth',
    });

    expect(prisma.product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          weight: 1.5,
          weightUnit: 'kg',
          length: 180,
          width: 60,
          height: 0.5,
          dimensionUnit: 'cm',
          material: 'Organic Cotton',
          color: 'Sage Green',
          manufacturer: 'Lotus Lab',
          modelNumber: 'LL-MAT-01',
          countryOfOrigin: 'India',
          careInstructions: 'Spot clean with damp cloth',
        }),
      }),
    );

    expect(result.weight).toBe(1.5);
    expect(result.weightUnit).toBe('kg');
    expect(result.length).toBe(180);
    expect(result.width).toBe(60);
    expect(result.height).toBe(0.5);
    expect(result.dimensionUnit).toBe('cm');
    expect(result.material).toBe('Organic Cotton');
  });

  it('creates a product without specifications with null fields', async () => {
    prisma.category.findUnique.mockResolvedValue({ id: 'cat-1' });
    prisma.product.create.mockImplementation(async ({ data }: any) => ({
      id: 'prod-2',
      ...data,
      category: { id: 'cat-1', name: 'Accessories', slug: 'accessories' },
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.create({
      name: 'Meditation Cushion',
      price: 45,
      categoryId: 'cat-1',
    });

    expect(prisma.product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          weight: null,
          weightUnit: null,
          length: null,
          width: null,
          height: null,
          dimensionUnit: null,
          material: null,
          color: null,
        }),
      }),
    );

    expect(result.weight).toBeNull();
    expect(result.dimensionUnit).toBeNull();
  });

  it('updates specifications and supports explicitly clearing them to null', async () => {
    prisma.product.findUnique.mockResolvedValue({
      id: 'prod-1',
      name: 'Mat',
      slug: 'mat',
      price: '50.00',
      weight: '2.000',
      weightUnit: 'kg',
      length: '180.00',
      width: '60.00',
      height: '1.00',
      dimensionUnit: 'cm',
      category: { id: 'cat-1', name: 'Mats', slug: 'mats' },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    prisma.product.update.mockImplementation(async ({ data }: any) => ({
      id: 'prod-1',
      name: 'Mat',
      slug: 'mat',
      price: '50.00',
      weight: data.weight ?? '2.000',
      weightUnit: data.weightUnit ?? 'kg',
      length: data.length ?? null,
      width: data.width ?? null,
      height: data.height ?? null,
      dimensionUnit: data.dimensionUnit ?? null,
      category: { id: 'cat-1', name: 'Mats', slug: 'mats' },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.update('prod-1', {
      length: null,
      width: null,
      height: null,
      dimensionUnit: null,
    });

    expect(prisma.product.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'prod-1' },
        data: expect.objectContaining({
          length: null,
          width: null,
          height: null,
          dimensionUnit: null,
        }),
      }),
    );

    expect(result.length).toBeNull();
    expect(result.weight).toBe(2);
  });
});

