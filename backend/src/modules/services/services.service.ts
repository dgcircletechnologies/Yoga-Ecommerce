import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import type { CreateServiceDto } from './dto/create-service.dto.js';
import type { UpdateServiceAvailabilityDto } from './dto/update-service-availability.dto.js';
import type { UpdateServiceDto } from './dto/update-service.dto.js';
const serviceSelect = { id: true, name: true, slug: true, description: true, price: true, sessions: true, status: true, images: true, createdAt: true, updatedAt: true } as const;
function slugify(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120) || 'service'; }
function code(error: unknown) { return error && typeof error === 'object' && 'code' in error ? error.code : undefined; }
@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: { search?: string; status?: string }) { const search = query.search?.trim(); const services = await this.prisma.service.findMany({ where: { ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] } : {}), ...(query.status === 'all' ? {} : { status: query.status === 'inactive' ? 'INACTIVE' : 'ACTIVE' }) }, orderBy: { createdAt: 'desc' }, select: serviceSelect }); return services.map((service) => this.present(service)); }
  async findOne(id: string) { const service = await this.prisma.service.findUnique({ where: { id }, select: serviceSelect }); if (!service) throw new NotFoundException('Service not found'); return this.present(service); }
  async findBySlug(slug: string) { const service = await this.prisma.service.findUnique({ where: { slug }, select: serviceSelect }); if (!service) throw new NotFoundException('Service not found'); return this.present(service); }
  async create(dto: CreateServiceDto) { try { const service = await this.prisma.service.create({ data: { name: dto.name.trim(), slug: slugify(dto.name), description: dto.description?.trim() || null, price: dto.price, sessions: dto.sessions, status: dto.status === false ? 'INACTIVE' : 'ACTIVE', images: [dto.imageUrl.trim()] }, select: serviceSelect }); return this.present(service); } catch (error: unknown) { this.throwDatabaseError(error); } }
  async update(id: string, dto: UpdateServiceDto) { await this.findOne(id); const data: Record<string, unknown> = {}; if (dto.name !== undefined) { data.name = dto.name.trim(); data.slug = slugify(dto.name); } if (dto.description !== undefined) data.description = dto.description.trim() || null; if (dto.price !== undefined) data.price = dto.price; if (dto.sessions !== undefined) data.sessions = dto.sessions; if (dto.imageUrl !== undefined) data.images = [dto.imageUrl.trim()]; if (dto.status !== undefined) data.status = dto.status ? 'ACTIVE' : 'INACTIVE'; try { return this.present(await this.prisma.service.update({ where: { id }, data, select: serviceSelect })); } catch (error: unknown) { this.throwDatabaseError(error); } }
  updateAvailability(id: string, dto: UpdateServiceAvailabilityDto) { return this.update(id, { status: dto.available }); }
  async remove(id: string) { await this.findOne(id); try { await this.prisma.service.delete({ where: { id } }); return { id }; } catch (error: unknown) { if (code(error) === 'P2003') throw new ConflictException('Service cannot be deleted because it is referenced by an order'); throw error; } }
  private throwDatabaseError(error: unknown): never { if (code(error) === 'P2002') throw new ConflictException('A service with this name already exists'); throw error; }
  private present(service: any) { return { id: service.id, name: service.name, slug: service.slug, description: service.description, price: Number(service.price), sessions: service.sessions, imageUrl: service.images[0] ?? null, available: service.status === 'ACTIVE', status: service.status === 'ACTIVE' ? 'Active' : 'Inactive', createdAt: service.createdAt, updatedAt: service.updatedAt }; }
}
