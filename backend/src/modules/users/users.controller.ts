import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ForbiddenException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { Role } from '../../common/enums/role.enum.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { CreateTrainerDto } from './dto/create-trainer.dto.js';
import { UpdateTrainerDto } from './dto/update-trainer.dto.js';
import { imageUploadOptions } from '../../common/image-upload.js';
import { Public } from '../../common/decorators/public.decorator.js';

interface AuthenticatedUser { id: string; role: Role }

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public() @Get('trainers')
  @ApiOperation({ summary: 'List public trainer profiles' })
  async findTrainers(@Query('search') search?: string) { return { success: true, data: await this.usersService.findTrainers(search) }; }

  @Public() @Get('trainers/:id')
  @ApiOperation({ summary: 'Get a public trainer profile' })
  async findTrainer(@Param('id') id: string) { return { success: true, data: await this.usersService.findTrainer(id) }; }

  @Post('trainers') @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async createTrainer(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTrainerDto, @UploadedFile() file?: Express.Multer.File) {
    this.requireAdmin(user); return { success: true, data: await this.usersService.createTrainer(dto, file) };
  }

  @Patch('trainers/:id') @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async updateTrainer(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateTrainerDto, @UploadedFile() file?: Express.Multer.File) {
    this.requireAdmin(user); return { success: true, data: await this.usersService.updateTrainer(id, dto, file) };
  }

  @Delete('trainers/:id')
  async deleteTrainer(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    this.requireAdmin(user); return { success: true, data: await this.usersService.deleteTrainer(id) };
  }

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
