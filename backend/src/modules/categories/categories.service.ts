import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import type { CreateCategoryDto } from './dto/create-category.dto.js';
import type { UpdateCategoryDto } from './dto/update-category.dto.js';

const categorySelect = {
  id: true, name: true, slug: true, description: true, images: true,
  createdAt: true, updatedAt: true, _count: { select: { products: true } },
} as const;

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120) || 'category';
}

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() { return this.prisma.category.findMany({ orderBy: { createdAt: 'desc' }, select: categorySelect }); }
  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id }, select: categorySelect });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
  async create(dto: CreateCategoryDto) {
    try {
      const imageUrl = dto.imageUrl.trim();
      return await this.prisma.category.create({ data: { name: dto.name.trim(), slug: slugify(dto.name), description: dto.description?.trim() || null, images: [imageUrl] }, select: categorySelect });
    } catch (error: unknown) { this.throwConflict(error); }
  }
  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) { data.name = dto.name.trim(); data.slug = slugify(dto.name); }
    if (dto.description !== undefined) data.description = dto.description.trim() || null;
    if (dto.imageUrl !== undefined) { const imageUrl = dto.imageUrl.trim(); data.images = [imageUrl]; }
    try { return await this.prisma.category.update({ where: { id }, data, select: categorySelect }); }
    catch (error: unknown) { this.throwConflict(error); }
  }
  async remove(id: string) {
    await this.findOne(id);
    try { await this.prisma.category.delete({ where: { id } }); return { id }; }
    catch (error: unknown) { if (this.code(error) === 'P2003') throw new ConflictException('Category cannot be deleted while it is assigned to products'); throw error; }
  }
  private throwConflict(error: unknown): never { if (this.code(error) === 'P2002') throw new ConflictException('A category with this name already exists'); throw error; }
  private code(error: unknown) { return error && typeof error === 'object' && 'code' in error ? error.code : undefined; }
}
