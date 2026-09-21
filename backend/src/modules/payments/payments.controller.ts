import { Body, Controller, ForbiddenException, Get, Headers, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto.js';
import { VerifyPaymentDto } from './dto/verify-payment.dto.js';
import { PaymentsService } from './payments.service.js';
import type { Request } from 'express';

type User = { id: string; role: string } | undefined;
@Controller('payments') @ApiTags('payments') @ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}
  @Public() @Post('create-order') @ApiOperation({ summary: 'Create or retry a Razorpay order for an application order' }) async create(@CurrentUser() user: User, @Body() dto: CreatePaymentOrderDto) { return { success: true, data: await this.payments.createOrder(dto, user) }; }
  @Public() @Post('verify') @ApiOperation({ summary: 'Verify a Razorpay payment signature' }) async verify(@CurrentUser() user: User, @Body() dto: VerifyPaymentDto) { return { success: true, data: await this.payments.verify(dto, user) }; }
  @Public() @Post('webhook') async webhook(@Headers('x-razorpay-signature') signature: string | undefined, @Req() request: Request & { rawBody?: Buffer }, @Body() body: any) { return { success: true, data: await this.payments.webhook(signature, request.rawBody?.toString('utf8') ?? JSON.stringify(body), body) }; }
  @Get() async findAll(@CurrentUser() user: User, @Query('status') status?: string) { if (user?.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); return { success: true, data: await this.payments.findAll(status) }; }
  @Get(':id') async findOne(@CurrentUser() user: User, @Param('id') id: string) { return { success: true, data: await this.payments.findOne(id, user) }; }
}
