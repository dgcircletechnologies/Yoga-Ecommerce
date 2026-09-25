import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import type { Role } from '../../common/enums/role.enum.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { OrdersService } from './orders.service.js';
interface AuthenticatedUser { id: string; role: Role }
@Controller('orders') @ApiTags('orders') @ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Public() @Post() @ApiOperation({ summary: 'Create an order for an authenticated user or guest' }) async create(@CurrentUser() user: AuthenticatedUser | undefined, @Body() dto: CreateOrderDto) { return { success: true, data: await this.ordersService.create(user?.id, dto) }; }
  @Get('my-orders') @ApiOperation({ summary: 'List orders belonging to the authenticated user' }) async findMine(@CurrentUser() user: AuthenticatedUser) { return { success: true, data: await this.ordersService.findForUser(user.id) }; }
  @Get('my-orders/:id') @ApiOperation({ summary: 'Get an order belonging to the authenticated user' }) async findMineOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return { success: true, data: await this.ordersService.findOneForUser(id, user.id) }; }
  @Get() @ApiOperation({ summary: 'List orders' }) async findAll(@CurrentUser() user: AuthenticatedUser, @Query('status') status?: string, @Query('search') search?: string, @Query('page') page?: string, @Query('limit') limit?: string, @Query('sort') sort?: string) { if (user.role === 'ADMIN') return { success: true, data: await this.ordersService.adminList({ status, search, page, limit, sort }) }; const orders = await this.ordersService.findAll({}); return { success: true, data: orders.filter((order) => order.userId === user.id) }; }
  @Get(':id/history') async history(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); return { success: true, data: await this.ordersService.history(id) }; }
  @Get(':id') async findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return { success: true, data: await this.ordersService.findOne(id, user.id, user.role === 'ADMIN', user.role === 'ADMIN') }; }
  @Patch(':id/status') async updateStatus(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateOrderStatusDto) { if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); return { success: true, data: await this.ordersService.updateStatus(id, dto, user.id) }; }
  @Get('admin/stats') async adminStats(@CurrentUser() user: AuthenticatedUser) { if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); return { success: true, data: await this.ordersService.adminStats() }; }
}
