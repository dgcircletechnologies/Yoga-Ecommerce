import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import type { Role } from '../../common/enums/role.enum.js';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { imageUploadOptions } from '../../common/image-upload.js';
interface AuthenticatedUser { role: Role }

@Controller('categories') @ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Public() @Get() @ApiOperation({ summary: 'List service categories' })
  async findAll() { return { success: true, data: await this.categoriesService.findAll() }; }
  @Public() @Get(':id') @ApiOperation({ summary: 'Get a service category' })
  async findOne(@Param('id') id: string) { return { success: true, data: await this.categoriesService.findOne(id) }; }
  @Post() @ApiBearerAuth() @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCategoryDto, @UploadedFile() file?: Express.Multer.File) { this.requireAdmin(user); return { success: true, data: await this.categoriesService.create(dto, file) }; }
  @Patch(':id') @ApiBearerAuth() @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateCategoryDto, @UploadedFile() file?: Express.Multer.File) { this.requireAdmin(user); return { success: true, data: await this.categoriesService.update(id, dto, file) }; }
  @Delete(':id') @ApiBearerAuth()
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { this.requireAdmin(user); return { success: true, data: await this.categoriesService.remove(id) }; }
  private requireAdmin(user: AuthenticatedUser) { if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); }
}
