import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { Role } from '../../common/enums/role.enum.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

interface AuthenticatedUser { id: string; role: Role }

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('customers')
  @ApiOperation({ summary: 'List customers' })
  async findCustomers(@CurrentUser() user: AuthenticatedUser, @Query('search') search?: string) {
    this.requireAdmin(user);
    return { success: true, data: await this.usersService.findCustomers(search) };
  }

  @Post('customers')
  @ApiOperation({ summary: 'Create a customer' })
  async createCustomer(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateUserDto) {
    this.requireAdmin(user);
    return { success: true, data: await this.usersService.createCustomer(dto) };
  }

  @Patch('customers/:id')
  @ApiOperation({ summary: 'Update a customer' })
  async updateCustomer(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    this.requireAdmin(user);
    return { success: true, data: await this.usersService.updateCustomer(id, dto) };
  }

  @Delete('customers/:id')
  @ApiOperation({ summary: 'Delete a customer' })
  async deleteCustomer(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    this.requireAdmin(user);
    return { success: true, data: await this.usersService.deleteCustomer(id) };
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Change the current user password' })
  async changePassword(@CurrentUser() user: AuthenticatedUser, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, dto);
  }

  private requireAdmin(user: AuthenticatedUser) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required');
  }
}
