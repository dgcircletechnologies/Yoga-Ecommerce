import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import type { Role } from '../../common/enums/role.enum.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductsService } from './products.service.js';
import { imageUploadOptions } from '../../common/image-upload.js';
interface AuthenticatedUser { role: Role }
@Controller('products') @ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Public() @Get() @ApiOperation({ summary: 'List products' }) async findAll(@Query('search') search?: string, @Query('categoryId') categoryId?: string, @Query('available') available?: string, @Query('tag') tag?: string) { return { success: true, data: await this.productsService.findAll({ search, categoryId, available, tag }) }; }
  @Public() @Get('slug/:slug') async findBySlug(@Param('slug') slug: string) { return { success: true, data: await this.productsService.findBySlug(slug) }; }
  @Public() @Get(':id') async findOne(@Param('id') id: string) { return { success: true, data: await this.productsService.findOne(id) }; }
  @Post() @ApiBearerAuth() @UseInterceptors(FileInterceptor('image', imageUploadOptions)) async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateProductDto, @UploadedFile() file?: Express.Multer.File) { this.requireAdmin(user); return { success: true, data: await this.productsService.create(dto, file) }; }
  @Patch(':id/availability') @ApiBearerAuth() async updateAvailability(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateProductAvailabilityDto) { this.requireAdmin(user); return { success: true, data: await this.productsService.updateAvailability(id, dto) }; }
  @Patch(':id') @ApiBearerAuth() @UseInterceptors(FileInterceptor('image', imageUploadOptions)) async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateProductDto, @UploadedFile() file?: Express.Multer.File) { this.requireAdmin(user); return { success: true, data: await this.productsService.update(id, dto, file) }; }
  @Delete(':id') @ApiBearerAuth() async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { this.requireAdmin(user); return { success: true, data: await this.productsService.remove(id) }; }
  private requireAdmin(user: AuthenticatedUser) { if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); }
}
