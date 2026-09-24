import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CloudinaryService } from '../../cloudinary/cloudinary.service.js';
import { PasswordService } from '../auth/password.service.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { ChangePasswordDto } from './dto/change-password.dto.js';
import type { CreateTrainerDto } from './dto/create-trainer.dto.js';
import type { UpdateTrainerDto } from './dto/update-trainer.dto.js';

const customerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

const trainerSelect = {
  id: true, name: true, email: true, phone: true, address1: true,
  profileUrl: true, aboutMe: true, experience: true, specialty: true, profileImageUrl: true, profileImagePublicId: true,
  role: true, createdAt: true, updatedAt: true,
} as const;

const trainerDetailSelect = {
  ...trainerSelect,
  trainerServices: {
    where: { status: 'ACTIVE' },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, description: true, price: true, sessions: true, imageUrl: true },
  },
} as const;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findTrainers(search?: string) {
    const normalizedSearch = search?.trim();
    const trainers = await this.prisma.user.findMany({
      where: { role: 'TRAINER', ...(normalizedSearch ? { OR: [{ name: { contains: normalizedSearch, mode: 'insensitive' } }, { email: { contains: normalizedSearch, mode: 'insensitive' } }] } : {}) },
      orderBy: { createdAt: 'desc' }, select: trainerSelect,
    });
    return trainers.map((trainer) => this.publicTrainer(trainer));
  }

  async findTrainer(id: string) {
    const trainer = await this.prisma.user.findFirst({ where: { id, role: 'TRAINER' }, select: trainerDetailSelect });
    if (!trainer) throw new NotFoundException('Trainer not found');
    const { trainerServices, ...trainerProfile } = trainer as any;
    const services = trainerServices as Array<{ id: string; name: string; description: string | null; price: unknown; sessions: number; imageUrl: string | null }>;
    return { ...this.publicTrainer(trainerProfile), services: services.map((service) => ({ ...service, price: Number(service.price) })) };
  }

  async createTrainer(dto: CreateTrainerDto, file?: Express.Multer.File) {
    const uploaded = file ? await this.cloudinary.uploadImage(file, 'profile') : undefined;
    try {
      const trainer = await this.prisma.user.create({ data: {
        name: dto.name.trim(), email: dto.email.trim().toLowerCase(), phone: dto.phone?.trim(), address1: dto.address?.trim(),
        profileUrl: dto.profileUrl?.trim(), aboutMe: dto.aboutMe?.trim(), experience: dto.experience?.trim(), specialty: dto.specialty?.trim(), role: 'TRAINER',
        password: await this.passwords.hash(dto.password),
        profileImageUrl: uploaded?.secure_url, profileImagePublicId: uploaded?.public_id,
      }, select: trainerSelect });
      return trainer;
    } catch (error: unknown) { if (uploaded) await this.cleanup(uploaded.public_id); this.throwTrainerConflict(error); }
  }

  async updateTrainer(id: string, dto: UpdateTrainerDto, file?: Express.Multer.File) {
    const current = await this.findTrainerRecord(id);
    const uploaded = file ? await this.cloudinary.uploadImage(file, 'profile') : undefined;
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.email !== undefined) data.email = dto.email.trim().toLowerCase();
    if (dto.phone !== undefined) data.phone = dto.phone.trim() || null;
    if (dto.address !== undefined) data.address1 = dto.address.trim() || null;
    if (dto.profileUrl !== undefined) data.profileUrl = dto.profileUrl.trim() || null;
    if (dto.aboutMe !== undefined) data.aboutMe = dto.aboutMe.trim() || null;
    if (dto.experience !== undefined) data.experience = dto.experience.trim() || null;
    if (dto.specialty !== undefined) data.specialty = dto.specialty.trim() || null;
    if (dto.password !== undefined) data.password = await this.passwords.hash(dto.password);
    if (uploaded) { data.profileImageUrl = uploaded.secure_url; data.profileImagePublicId = uploaded.public_id; }
    else if (dto.removeImage) { data.profileImageUrl = null; data.profileImagePublicId = null; }
    try {
      const trainer = await this.prisma.user.update({ where: { id }, data, select: trainerSelect });
      if ((uploaded || dto.removeImage) && current.profileImagePublicId) await this.cleanup(current.profileImagePublicId);
      return trainer;
    } catch (error: unknown) { if (uploaded) await this.cleanup(uploaded.public_id); this.throwTrainerConflict(error); }
  }

  async deleteTrainer(id: string) {
    const trainer = await this.findTrainerRecord(id);
    try { await this.prisma.user.delete({ where: { id } }); } catch (error: unknown) {
      if (this.errorCode(error) === 'P2003') throw new ConflictException('Trainer cannot be deleted because they are referenced by an order');
      throw error;
    }
    if (trainer.profileImagePublicId) await this.cleanup(trainer.profileImagePublicId);
    return { id };
  }

  async findCustomers(search?: string) {
    const normalizedSearch = search?.trim();
    const users = await this.prisma.user.findMany({
      where: {
        role: 'USER',
        ...(normalizedSearch
          ? { OR: [{ name: { contains: normalizedSearch, mode: 'insensitive' } }, { email: { contains: normalizedSearch, mode: 'insensitive' } }] }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: customerSelect,
    });
    return users;
  }

  async createCustomer(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          name: dto.name.trim(),
          email: dto.email.trim().toLowerCase(),
          password: await this.passwords.hash(dto.password),
          phone: dto.phone?.trim(),
          role: 'USER',
        },
        select: customerSelect,
      });
    } catch (error: unknown) {
      this.throwConflict(error);
    }
  }

  async updateCustomer(id: string, dto: UpdateUserDto) {
    await this.ensureCustomer(id);
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.email !== undefined) data.email = dto.email.trim().toLowerCase();
    if (dto.phone !== undefined) data.phone = dto.phone.trim();
    if (dto.password !== undefined) data.password = await this.passwords.hash(dto.password);

    try {
      return await this.prisma.user.update({ where: { id }, data, select: customerSelect });
    } catch (error: unknown) {
      this.throwConflict(error);
    }
  }

  async deleteCustomer(id: string) {
    await this.ensureCustomer(id);
    await this.prisma.user.delete({ where: { id } });
    return { id };
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { password: true } });
    if (!user?.password || !(await this.passwords.verify(user.password, dto.currentPassword))) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.prisma.user.update({
      where: { id },
      data: { password: await this.passwords.hash(dto.newPassword) },
    });
    return { success: true };
  }

  private async ensureCustomer(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id, role: 'USER' }, select: { id: true } });
    if (!user) throw new NotFoundException('Customer not found');
  }

  private throwConflict(error: unknown): never {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      throw new ConflictException('A customer with this email already exists');
    }
    throw error;
  }

  private throwTrainerConflict(error: unknown): never {
    if (this.errorCode(error) === 'P2002') throw new ConflictException('A trainer with this email already exists');
    throw error;
  }

  private errorCode(error: unknown) { return error && typeof error === 'object' && 'code' in error ? error.code : undefined; }

  private async cleanup(publicId: string) {
    try { await this.cloudinary.deleteImage(publicId); }
    catch (error) { this.logger.error(`Cloudinary cleanup failed for ${publicId}`, error); }
  }

  private async findTrainerRecord(id: string) {
    const trainer = await this.prisma.user.findFirst({ where: { id, role: 'TRAINER' }, select: trainerSelect });
    if (!trainer) throw new NotFoundException('Trainer not found');
    return trainer;
  }

  private publicTrainer<T extends { profileImagePublicId?: string | null }>(trainer: T): Omit<T, 'profileImagePublicId'> {
    const { profileImagePublicId: _privateId, ...publicProfile } = trainer;
    return publicProfile;
  }
}
