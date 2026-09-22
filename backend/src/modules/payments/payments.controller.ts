import { Body, Controller, ForbiddenException, Get, Headers, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto.js';
import { VerifyPaymentDto } from './dto/verify-payment.dto.js';
import { FailPaymentDto } from './dto/fail-payment.dto.js';
import { PaymentsService } from './payments.service.js';

type User = { id: string; role: string } | undefined;
@Controller('payments') @ApiTags('payments') @ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}
  @Public() @Post('create-order') @ApiOperation({ summary: 'Create a Razorpay order for an existing application order' }) createOrder(@Body() dto: CreatePaymentOrderDto, @CurrentUser() user: User) { return this.payments.createOrder(dto, user).then((data) => ({ success: true, data })); }
  @Public() @Post('verify') @ApiOperation({ summary: 'Verify a Razorpay payment signature' }) verify(@Body() dto: VerifyPaymentDto, @CurrentUser() user: User) { return this.payments.verify(dto, user).then((data) => ({ success: true, data })); }
  @Public() @Post('failure') @ApiOperation({ summary: 'Record a failed Razorpay payment attempt' }) failure(@Body() dto: FailPaymentDto, @CurrentUser() user: User) { return this.payments.fail(dto, user).then((data) => ({ success: true, data })); }
  @Public() @Post('webhook') @ApiOperation({ summary: 'Receive a signed Razorpay webhook' }) webhook(@Body() body: unknown, @Headers('x-razorpay-signature') signature: string, @Req() request: { rawBody?: Buffer }) { return this.payments.webhook(request.rawBody?.toString('utf8') ?? JSON.stringify(body), signature).then((data) => ({ success: true, data })); }
  @Get('order/:orderId') getForOrder(@Param('orderId') orderId: string, @CurrentUser() user: User, @Query('email') email?: string) { return this.payments.findForUser(orderId, user, email).then((data) => ({ success: true, data })); }
  @Get() async findAll(@CurrentUser() user: User, @Query('status') status?: string, @Query('search') search?: string) { if (user?.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); return { success: true, data: await this.payments.findAll(status, search) }; }
}
