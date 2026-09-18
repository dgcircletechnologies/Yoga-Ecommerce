import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import type { CreateProductDto } from './dto/create-product.dto.js';
import type { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto.js';
import type { UpdateProductDto } from './dto/update-product.dto.js';
const productSelect = { id: true, name: true, slug: true, description: true, price: true, stock: true, categoryId: true, tags: true, images: true, isActive: true, createdAt: true, updatedAt: true, category: { select: { id: true, name: true, slug: true } } } as const;
function slugify(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120) || 'product'; }
function code(error: unknown) { return error && typeof error === 'object' && 'code' in error ? error.code : undefined; }
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: { search?: string; categoryId?: string; available?: string; tag?: string }) {
    const search = query.search?.trim(); const products = await this.prisma.product.findMany({ where: { ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] } : {}), ...(query.categoryId ? { categoryId: query.categoryId } : {}), ...(query.available === 'all' ? {} : { isActive: query.available !== 'false' }), ...(query.tag ? { tags: { has: query.tag } } : {}) }, orderBy: { createdAt: 'desc' }, select: productSelect });
    return products.map((product) => this.present(product));
  }
  async findOne(id: string) { const product = await this.prisma.product.findUnique({ where: { id }, select: productSelect }); if (!product) throw new NotFoundException('Product not found'); return this.present(product); }
  async findBySlug(slug: string) { const product = await this.prisma.product.findUnique({ where: { slug }, select: productSelect }); if (!product) throw new NotFoundException('Product not found'); return this.present(product); }
  async create(dto: CreateProductDto) { await this.ensureCategory(dto.categoryId); try { const product = await this.prisma.product.create({ data: { name: dto.name.trim(), slug: slugify(dto.name), description: dto.description?.trim() || null, price: dto.price, stock: dto.stock ?? 0, categoryId: dto.categoryId, tags: this.cleanTags(dto.tags), images: [dto.imageUrl.trim()], isActive: dto.available ?? true }, select: productSelect }); return this.present(product); } catch (error: unknown) { this.throwDatabaseError(error); } }
  async update(id: string, dto: UpdateProductDto) { await this.findOne(id); if (dto.categoryId !== undefined) await this.ensureCategory(dto.categoryId); const data: Record<string, unknown> = {}; if (dto.name !== undefined) { data.name = dto.name.trim(); data.slug = slugify(dto.name); } if (dto.description !== undefined) data.description = dto.description.trim() || null; if (dto.price !== undefined) data.price = dto.price; if (dto.categoryId !== undefined) data.categoryId = dto.categoryId; if (dto.tags !== undefined) data.tags = this.cleanTags(dto.tags); if (dto.imageUrl !== undefined) data.images = [dto.imageUrl.trim()]; if (dto.stock !== undefined) data.stock = dto.stock; if (dto.available !== undefined) data.isActive = dto.available; try { return this.present(await this.prisma.product.update({ where: { id }, data, select: productSelect })); } catch (error: unknown) { this.throwDatabaseError(error); } }
  updateAvailability(id: string, dto: UpdateProductAvailabilityDto) { return this.update(id, { available: dto.available }); }
  async remove(id: string) { await this.findOne(id); try { await this.prisma.product.delete({ where: { id } }); return { id }; } catch (error: unknown) { if (code(error) === 'P2003') throw new ConflictException('Product cannot be deleted because it is referenced by an order'); throw error; } }
  private async ensureCategory(id: string) { const category = await this.prisma.category.findUnique({ where: { id }, select: { id: true } }); if (!category) throw new NotFoundException('Category not found'); }
  private cleanTags(tags?: string[]) { return [...new Set((tags ?? []).map((tag) => tag.trim()).filter(Boolean))]; }
  private throwDatabaseError(error: unknown): never { if (code(error) === 'P2002') throw new ConflictException('A product with this name already exists'); if (code(error) === 'P2003') throw new NotFoundException('Category not found'); throw error; }
  private present(product: any) { return { id: product.id, name: product.name, slug: product.slug, description: product.description, price: Number(product.price), stock: product.stock, categoryId: product.categoryId, category: product.category, tags: product.tags, imageUrl: product.images[0] ?? null, available: product.isActive, createdAt: product.createdAt, updatedAt: product.updatedAt }; }
}
