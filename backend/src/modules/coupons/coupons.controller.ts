import { Body, Controller, ForbiddenException, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { ApplyCouponDto, RemoveCouponDto } from './dto/coupon-items.dto.js';
import { CreateCouponDto, UpdateCouponDto } from './dto/manage-coupon.dto.js';
import { CouponsService } from './coupons.service.js';

@Controller('coupons') @ApiTags('coupons') @ApiBearerAuth()
export class CouponsController {
  constructor(private readonly coupons: CouponsService) {}
  @Public() @Post('apply') apply(@Body() dto: ApplyCouponDto) { return this.coupons.calculate(dto.items, dto.code).then((data) => ({ success: true, data: { subtotal: data.subtotal, eligibleSubtotal: data.eligibleSubtotal, couponCode: data.coupon?.code, discountType: data.coupon?.discountType, discountValue: data.coupon?.discountValue, discountAmount: data.discountAmount, finalAmount: data.total } })); }
  @Public() @Post('remove') remove(@Body() dto: RemoveCouponDto) { return this.coupons.calculate(dto.items).then((data) => ({ success: true, data: { subtotal: data.subtotal, eligibleSubtotal: data.eligibleSubtotal, discountAmount: 0, finalAmount: data.total } })); }
  @Post() create(@CurrentUser() user: { role: string }, @Body() dto: CreateCouponDto) { this.admin(user); return this.coupons.create(dto).then((data) => ({ success: true, data })); }
  @Get() list(@CurrentUser() user: { role: string }, @Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) { this.admin(user); return this.coupons.list(Number(page) || 1, Number(limit) || 20, search).then((data) => ({ success: true, data })); }
  @Get(':id/usages') usages(@CurrentUser() user: { role: string }, @Param('id') id: string, @Query('page') page?: string, @Query('limit') limit?: string) { this.admin(user); return this.coupons.usages(id, Number(page) || 1, Number(limit) || 20).then((data) => ({ success: true, data })); }
  @Get(':id') get(@CurrentUser() user: { role: string }, @Param('id') id: string) { this.admin(user); return this.coupons.get(id).then((data) => ({ success: true, data })); }
  @Put(':id') update(@CurrentUser() user: { role: string }, @Param('id') id: string, @Body() dto: UpdateCouponDto) { this.admin(user); return this.coupons.update(id, dto).then((data) => ({ success: true, data })); }
  @Post(':id/status') status(@CurrentUser() user: { role: string }, @Param('id') id: string, @Body('status') status: 'ACTIVE' | 'INACTIVE') { this.admin(user); if (!['ACTIVE', 'INACTIVE'].includes(status)) throw new ForbiddenException('Invalid coupon status'); return this.coupons.setStatus(id, status).then((data) => ({ success: true, data })); }
  private admin(user: { role: string }) { if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); }
}
