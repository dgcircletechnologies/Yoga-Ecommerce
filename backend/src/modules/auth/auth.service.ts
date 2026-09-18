import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service.js';
import { Role } from '../../common/enums/role.enum.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtPayload } from './strategies/jwt.strategy.js';
import { PasswordService } from './password.service.js';

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly passwords: PasswordService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    const validPassword = user?.password
      ? await this.passwords.verify(user.password, password)
      : false;

    if (!user || !validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const safeUser = this.toSafeUser(user);
    const payload: JwtPayload = {
      sub: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
    };
    const accessToken = await this.jwt.signAsync(payload);

    return {
      success: true,
      message: 'Login successful',
      data: { accessToken, user: safeUser },
    };
  }

  async register({ name, email, password, phone }: RegisterDto) {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await this.passwords.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: passwordHash,
          phone: phone?.trim(),
        },
      });

      return {
        success: true,
        message: 'Registration successful',
        data: { user: this.toSafeUser(user) },
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An account with this email already exists',
        );
      }
      throw error;
    }
  }

  async getCurrentUser(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user)
      throw new UnauthorizedException('Invalid authentication credentials');
    return this.toSafeUser(user);
  }

  private toSafeUser(user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    phone?: string | null;
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postalCode?: string | null;
  }): SafeUser {
    return { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address1: user.address1, address2: user.address2, city: user.city, state: user.state, country: user.country, postalCode: user.postalCode };
  }
}
