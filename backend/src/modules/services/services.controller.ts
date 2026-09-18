import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import type { Role } from '../../common/enums/role.enum.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceAvailabilityDto } from './dto/update-service-availability.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { ServicesService } from './services.service.js';
interface AuthenticatedUser { role: Role }
@Controller('services') @ApiTags('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Public() @Get() @ApiOperation({ summary: 'List services' }) async findAll(@Query('search') search?: string, @Query('status') status?: string) { return { success: true, data: await this.servicesService.findAll({ search, status }) }; }
  @Public() @Get('slug/:slug') async findBySlug(@Param('slug') slug: string) { return { success: true, data: await this.servicesService.findBySlug(slug) }; }
  @Public() @Get(':id') async findOne(@Param('id') id: string) { return { success: true, data: await this.servicesService.findOne(id) }; }
  @Post() @ApiBearerAuth() async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateServiceDto) { this.requireAdmin(user); return { success: true, data: await this.servicesService.create(dto) }; }
  @Patch(':id/availability') @ApiBearerAuth() async updateAvailability(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateServiceAvailabilityDto) { this.requireAdmin(user); return { success: true, data: await this.servicesService.updateAvailability(id, dto) }; }
  @Patch(':id') @ApiBearerAuth() async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateServiceDto) { this.requireAdmin(user); return { success: true, data: await this.servicesService.update(id, dto) }; }
  @Delete(':id') @ApiBearerAuth() async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { this.requireAdmin(user); return { success: true, data: await this.servicesService.remove(id) }; }
  private requireAdmin(user: AuthenticatedUser) { if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); }
}
