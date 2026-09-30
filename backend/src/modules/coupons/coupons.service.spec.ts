import { describe, expect, it, vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { CouponsService } from './coupons.service.js';

function service(coupon: any) {
  return new CouponsService({
    product: { findUnique: vi.fn().mockResolvedValue({ id: 'p1', name: 'Mat', price: 500, isActive: true }) },
    service: { findUnique: vi.fn().mockResolvedValue({ id: 's1', name: 'Class', price: 400, status: 'ACTIVE' }) },
    coupon: { findFirst: vi.fn().mockResolvedValue(coupon) },
  } as any);
}

const product = { type: 'PRODUCT', productId: 'p1', quantity: 2 };
const serviceItem = { type: 'SERVICE', serviceId: 's1', quantity: 1 };
const dates = { startDate: new Date(Date.now() - 60_000), expiryDate: new Date(Date.now() + 60_000) };

describe('CouponsService pricing', () => {
  it('calculates a percentage discount against eligible products only', async () => {
    const result = await service({ id: 'c1', code: 'SAVE20', discountType: 'PERCENTAGE', discountValue: 20, minimumAmount: null, applicableTo: 'PRODUCT', status: 'ACTIVE', usageLimit: null, usageCount: 0, ...dates }).calculate([product, serviceItem], 'save20');
    expect(result.subtotal).toBe(1400);
    expect(result.eligibleSubtotal).toBe(1000);
    expect(result.discountAmount).toBe(200);
    expect(result.total).toBe(1200);
  });

  it('checks minimum amount against eligible subtotal', async () => {
    const coupons = service({ id: 'c1', code: 'SAVE20', discountType: 'PERCENTAGE', discountValue: 20, minimumAmount: 1200, applicableTo: 'PRODUCT', status: 'ACTIVE', usageLimit: null, usageCount: 0, ...dates });
    await expect(coupons.calculate([product], 'SAVE20')).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects inactive coupons', async () => {
    const coupons = service({ id: 'c1', code: 'SAVE20', discountType: 'PERCENTAGE', discountValue: 20, minimumAmount: null, applicableTo: 'BOTH', status: 'INACTIVE', usageLimit: null, usageCount: 0, ...dates });
    await expect(coupons.calculate([product], 'SAVE20')).rejects.toThrow('Coupon is inactive');
  });
});
