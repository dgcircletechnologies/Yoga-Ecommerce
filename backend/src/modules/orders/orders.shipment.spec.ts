import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { OrdersService } from './orders.service.js';

describe('OrdersService - Shipment Management', () => {
  const prisma = {
    order: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
    shipment: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    orderStatusHistory: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  };

  const config = {
    get: vi.fn(),
  };

  const coupons = {
    finalizeUsage: vi.fn(),
  };

  const orderEmails = {
    sendOrderConfirmation: vi.fn(),
    sendOrderStatusUpdate: vi.fn(),
  };

  const service = new OrdersService(prisma as any, config as any, coupons as any, orderEmails as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleOrder = {
    id: 'order-123',
    userId: 'user-1',
    status: 'new',
    subtotal: 100,
    discount: 0,
    shippingCharge: 10,
    total: 110,
    items: [],
    payment: null,
    shipment: null,
    createdAt: new Date('2026-10-10T00:00:00Z'),
    updatedAt: new Date('2026-10-10T00:00:00Z'),
  };

  const sampleShipment = {
    id: 'ship-1',
    orderId: 'order-123',
    courierName: 'DHL Express',
    trackingNumber: 'DHL987654321',
    courierServiceType: 'Express Worldwide',
    packageType: 'Box',
    weight: 2.5,
    weightUnit: 'kg',
    length: 30,
    width: 20,
    height: 15,
    dimensionUnit: 'cm',
    shippingCost: 25.5,
    shippedAt: new Date('2026-10-10T10:00:00Z'),
    expectedDeliveryAt: new Date('2026-10-12T10:00:00Z'),
    deliveredAt: null,
    packageDescription: 'Yoga gear parcel',
    notes: 'Fragile equipment inside',
    createdAt: new Date('2026-10-10T10:00:00Z'),
    updatedAt: new Date('2026-10-10T10:00:00Z'),
  };

  describe('createShipment', () => {
    it('creates a shipment for a valid order without existing shipment', async () => {
      prisma.order.findUnique.mockResolvedValueOnce({ id: 'order-123', shipment: null });
      prisma.shipment.create.mockResolvedValueOnce(sampleShipment);

      const result = await service.createShipment('order-123', {
        courierName: 'DHL Express',
        trackingNumber: 'DHL987654321',
        courierServiceType: 'Express Worldwide',
        packageType: 'Box',
        weight: 2.5,
        weightUnit: 'kg',
        length: 30,
        width: 20,
        height: 15,
        dimensionUnit: 'cm',
        shippingCost: 25.5,
        shippedAt: new Date('2026-10-10T10:00:00Z'),
        expectedDeliveryAt: new Date('2026-10-12T10:00:00Z'),
        notes: 'Fragile equipment inside',
      });

      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        select: { id: true, shipment: { select: { id: true } } },
      });
      expect(prisma.shipment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            orderId: 'order-123',
            courierName: 'DHL Express',
            trackingNumber: 'DHL987654321',
            shippingCost: 25.5,
            notes: 'Fragile equipment inside',
          }),
        }),
      );
      expect(result).toMatchObject({
        id: 'ship-1',
        orderId: 'order-123',
        courierName: 'DHL Express',
        trackingNumber: 'DHL987654321',
        shippingCost: 25.5,
        notes: 'Fragile equipment inside',
      });
    });

    it('rejects creation when the order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.createShipment('non-existent', { courierName: 'FedEx' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects creation when the order already has a shipment', async () => {
      prisma.order.findUnique.mockResolvedValueOnce({
        id: 'order-123',
        shipment: { id: 'existing-shipment' },
      });

      await expect(
        service.createShipment('order-123', { courierName: 'FedEx' }),
      ).rejects.toThrow(ConflictException);
    });

    it('rejects expectedDeliveryAt preceding shippedAt', async () => {
      prisma.order.findUnique.mockResolvedValueOnce({ id: 'order-123', shipment: null });

      await expect(
        service.createShipment('order-123', {
          courierName: 'FedEx',
          shippedAt: new Date('2026-10-15T00:00:00Z'),
          expectedDeliveryAt: new Date('2026-10-10T00:00:00Z'),
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getShipment and privacy / serialization', () => {
    it('returns full shipment info including notes and shippingCost for admin', async () => {
      prisma.shipment.findUnique.mockResolvedValueOnce(sampleShipment);

      const result = await service.getShipment('order-123', true);
      expect(result).toMatchObject({
        courierName: 'DHL Express',
        trackingNumber: 'DHL987654321',
        shippingCost: 25.5,
        notes: 'Fragile equipment inside',
      });
    });

    it('omits notes and shippingCost for customer views', async () => {
      prisma.shipment.findUnique.mockResolvedValueOnce(sampleShipment);

      const result = await service.getShipment('order-123', false);
      expect(result).toMatchObject({
        courierName: 'DHL Express',
        trackingNumber: 'DHL987654321',
      });
      expect(result).not.toHaveProperty('notes');
      expect(result).not.toHaveProperty('shippingCost');
    });

    it('throws NotFoundException if shipment does not exist', async () => {
      prisma.shipment.findUnique.mockResolvedValueOnce(null);

      await expect(service.getShipment('order-123', true)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateShipment', () => {
    it('updates shipment fields and clears nullable values when specified', async () => {
      prisma.shipment.findUnique.mockResolvedValueOnce(sampleShipment);
      prisma.shipment.update.mockResolvedValueOnce({
        ...sampleShipment,
        trackingNumber: 'NEW-TRACKING-123',
        notes: null,
      });

      const result = await service.updateShipment('order-123', {
        trackingNumber: 'NEW-TRACKING-123',
        notes: null,
      });

      expect(prisma.shipment.update).toHaveBeenCalledWith({
        where: { orderId: 'order-123' },
        data: {
          trackingNumber: 'NEW-TRACKING-123',
          notes: null,
        },
      });
      expect(result.trackingNumber).toBe('NEW-TRACKING-123');
      expect(result.notes).toBeNull();
    });

    it('rejects invalid updated delivery date combinations', async () => {
      prisma.shipment.findUnique.mockResolvedValueOnce(sampleShipment);

      await expect(
        service.updateShipment('order-123', {
          expectedDeliveryAt: new Date('2026-10-01T00:00:00Z'), // Before existing shippedAt (2026-10-10)
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteShipment safe policy', () => {
    it('allows deleting a shipment when order is not dispatched and shippedAt is null', async () => {
      const pendingShipment = {
        ...sampleShipment,
        shippedAt: null,
        deliveredAt: null,
        order: { status: 'new' },
      };
      prisma.shipment.findUnique.mockResolvedValueOnce(pendingShipment);
      prisma.shipment.delete.mockResolvedValueOnce(pendingShipment);

      const result = await service.deleteShipment('order-123');
      expect(prisma.shipment.delete).toHaveBeenCalledWith({ where: { orderId: 'order-123' } });
      expect(result.success).toBe(true);
    });

    it('rejects deleting a shipment if it has already been dispatched', async () => {
      const dispatchedShipment = {
        ...sampleShipment,
        shippedAt: new Date('2026-10-10T10:00:00Z'),
        order: { status: 'shipped' },
      };
      prisma.shipment.findUnique.mockResolvedValueOnce(dispatchedShipment);

      await expect(service.deleteShipment('order-123')).rejects.toThrow(ConflictException);
      expect(prisma.shipment.delete).not.toHaveBeenCalled();
    });

    it('rejects deleting a shipment if order status is delivered', async () => {
      const deliveredShipment = {
        ...sampleShipment,
        shippedAt: null,
        order: { status: 'delivered' },
      };
      prisma.shipment.findUnique.mockResolvedValueOnce(deliveredShipment);

      await expect(service.deleteShipment('order-123')).rejects.toThrow(ConflictException);
      expect(prisma.shipment.delete).not.toHaveBeenCalled();
    });
  });

  describe('order detail and search integration', () => {
    it('findOne for admin includes shipment with notes and shippingCost', async () => {
      prisma.order.findUnique.mockResolvedValueOnce({
        ...sampleOrder,
        shipment: sampleShipment,
      });

      const result = await service.findOne('order-123', undefined, true);
      expect(result.shipment).toBeDefined();
      expect(result.shipment?.notes).toBe('Fragile equipment inside');
      expect(result.shipment?.shippingCost).toBe(25.5);
    });

    it('findOne for customer includes shipment but strips notes and shippingCost', async () => {
      prisma.order.findUnique.mockResolvedValueOnce({
        ...sampleOrder,
        shipment: sampleShipment,
      });

      const result = await service.findOne('order-123', 'user-1', false);
      expect(result.shipment).toBeDefined();
      expect(result.shipment?.courierName).toBe('DHL Express');
      expect(result.shipment?.trackingNumber).toBe('DHL987654321');
      expect(result.shipment).not.toHaveProperty('notes');
      expect(result.shipment).not.toHaveProperty('shippingCost');
    });

    it('handles orders without a shipment gracefully (returns null)', async () => {
      prisma.order.findUnique.mockResolvedValueOnce({
        ...sampleOrder,
        shipment: null,
      });

      const result = await service.findOne('order-123', 'user-1', false);
      expect(result.shipment).toBeNull();
    });
  });
});
