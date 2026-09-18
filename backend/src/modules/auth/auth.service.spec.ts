import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service.js';
import { AuthService } from './auth.service.js';
import { PasswordService } from './password.service.js';

describe('AuthService', () => {
  const findUnique = vi.fn();
  const create = vi.fn();
  const prisma = { user: { findUnique, create } } as unknown as PrismaService;
  const jwt = {
    signAsync: vi.fn().mockResolvedValue('access-token'),
  } as unknown as JwtService;
  let service: AuthService;

  beforeEach(() => {
    findUnique.mockReset();
    create.mockReset();
    service = new AuthService(prisma, jwt, new PasswordService());
  });

  it('hashes and verifies passwords without exposing the hash', async () => {
    const passwords = new PasswordService();
    const hash = await passwords.hash('correct-password');

    expect(hash).not.toBe('correct-password');
    expect(await passwords.verify(hash, 'correct-password')).toBe(true);
    expect(await passwords.verify(hash, 'wrong-password')).toBe(false);
  });

  it('returns a token and safe user data for valid credentials', async () => {
    const password = await new PasswordService().hash('correct-password');
    findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Yoga User',
      email: 'user@example.com',
      password,
      role: 'USER',
    });

    const result = await service.login({
      email: ' USER@example.com ',
      password: 'correct-password',
    });

    expect(result.data.user).toEqual({
      id: 'user-1',
      name: 'Yoga User',
      email: 'user@example.com',
      role: 'USER',
    });
    expect(result.data.accessToken).toBe('access-token');
    expect(JSON.stringify(result)).not.toContain(password);
  });

  it('uses a generic error for unknown users or incorrect passwords', async () => {
    findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'unknown@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('hashes a new password and returns only safe registration data', async () => {
    create.mockImplementation(async ({ data }) => ({
      id: 'user-2',
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: 'USER',
    }));

    const result = await service.register({
      name: ' New User ',
      email: ' NEW@example.com ',
      password: 'correct-password',
      phone: '+14155552671',
    });

    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'New User',
        email: 'new@example.com',
        phone: '+14155552671',
      }),
    });
    expect(result.data.user).toEqual({
      id: 'user-2',
      name: 'New User',
      email: 'new@example.com',
      role: 'USER',
    });
    expect(JSON.stringify(result)).not.toContain('password');
  });
});
