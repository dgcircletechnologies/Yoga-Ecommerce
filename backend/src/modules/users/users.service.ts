import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { PasswordService } from '../auth/password.service.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { ChangePasswordDto } from './dto/change-password.dto.js';

const customerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
  ) {}

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
}
