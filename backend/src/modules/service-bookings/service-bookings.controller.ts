import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CreateServiceBookingDto } from './dto/create-service-booking.dto.js';
import { ConfirmTrainerBookingDto } from './dto/confirm-trainer-booking.dto.js';
import { UpdateServiceBookingStatusDto } from './dto/update-service-booking-status.dto.js';
import { ServiceBookingsService } from './service-bookings.service.js';
import { imageUploadOptions } from '../../common/image-upload.js';

const MAX_SCENE_IMAGES = 6;

@Controller('service-bookings') @ApiTags('service-bookings') @ApiBearerAuth()
export class ServiceBookingsController {
  constructor(private readonly bookings: ServiceBookingsService) {}
  // A booking is intentionally public: guests provide their details in the checkout form.
  @Public()
  @Post()
  create(@CurrentUser() user: { id: string } | undefined, @Body() dto: CreateServiceBookingDto) { return this.bookings.create(user?.id, dto).then((data) => ({ success: true, data })); }
  @Get('admin')
  adminList(@CurrentUser() user: { role: string }, @Query() query: { page?: string; limit?: string; search?: string; status?: string; paymentStatus?: string; serviceId?: string; trainerId?: string; date?: string; upcoming?: string; trainerConfirmation?: string; imageReviewStatus?: string; adminReviewStatus?: string; sort?: string }) { this.requireAdmin(user); return this.bookings.adminList(query).then((data) => ({ success: true, data })); }
  @Get('admin/stats')
  adminStats(@CurrentUser() user: { role: string }) { this.requireAdmin(user); return this.bookings.adminStats().then((data) => ({ success: true, data })); }
  @Get('admin/history')
  adminHistoryList(@CurrentUser() user: { role: string }, @Query() query: { page?: string; limit?: string }) { this.requireAdmin(user); return this.bookings.adminHistoryList(Number(query.page) || 1, Number(query.limit) || 20).then((data) => ({ success: true, data })); }
  @Get('admin/:id')
  adminGet(@CurrentUser() user: { role: string }, @Param('id') id: string) { this.requireAdmin(user); return this.bookings.adminGet(id).then((data) => ({ success: true, data })); }
  @Patch('admin/:id/status')
  adminStatus(@CurrentUser() user: { id: string; role: string }, @Param('id') id: string, @Body() dto: UpdateServiceBookingStatusDto) { this.requireAdmin(user); return this.bookings.updateStatus(id, dto.status, user.id).then((data) => ({ success: true, data })); }
  @Get('admin/:id/history')
  adminHistory(@CurrentUser() user: { id: string; role: string }, @Param('id') id: string) { this.requireAdmin(user); return this.bookings.adminHistory(id).then((data) => ({ success: true, data })); }
  @Patch('admin/:id/review')
  adminReview(@CurrentUser() user: { id: string; role: string }, @Param('id') id: string, @Body() dto: { decision: 'APPROVED' | 'REJECTED'; reason?: string }) { this.requireAdmin(user); return this.bookings.reviewBooking(id, user.id, dto.decision, dto.reason).then((data) => ({ success: true, data })); }
  @Patch('admin/:id/image-review')
  adminImageReview(@CurrentUser() user: { id: string; role: string }, @Param('id') id: string, @Body() dto: { decision: 'REVIEWED' | 'REJECTED'; reason?: string }) { this.requireAdmin(user); return this.bookings.reviewImages(id, user.id, dto.decision, dto.reason).then((data) => ({ success: true, data })); }
  @Roles('TRAINER')
  @Get('trainer/dashboard')
  trainerDashboard(@CurrentUser() user: { id: string }) { return this.bookings.trainerDashboard(user.id).then((data) => ({ success: true, data })); }
  @Roles('TRAINER')
  @Get('trainer/bookings/pending')
  trainerPending(@CurrentUser() user: { id: string }) { return this.bookings.trainerBookings(user.id, 'pending').then((data) => ({ success: true, data })); }
  @Roles('TRAINER')
  @Get('trainer/bookings/history')
  trainerHistory(@CurrentUser() user: { id: string }, @Query() query: { page?: string; limit?: string; status?: string; date?: string; search?: string }) { return this.bookings.trainerHistory(user.id, query).then((data) => ({ success: true, data })); }
  @Roles('TRAINER')
  @Get('trainer/bookings/:id')
  trainerGet(@CurrentUser() user: { id: string }, @Param('id') id: string) { return this.bookings.trainerBooking(user.id, id).then((data) => ({ success: true, data })); }
  @Roles('TRAINER')
  @Post('trainer/bookings/:bookingId/verify-otp')
  @UseInterceptors(FilesInterceptor('sceneImages', MAX_SCENE_IMAGES, imageUploadOptions))
  trainerConfirm(@CurrentUser() user: { id: string }, @Param('bookingId') bookingId: string, @Body() dto: ConfirmTrainerBookingDto, @UploadedFiles() files: Express.Multer.File[] = []) { return this.bookings.confirmTrainerBooking(user.id, bookingId, dto.otp, files).then((booking) => ({ success: true, message: 'Booking confirmed successfully', booking })); }
  @Roles('TRAINER')
  @Get('trainer/bookings')
  trainerList(@CurrentUser() user: { id: string }) { return this.bookings.trainerBookings(user.id).then((data) => ({ success: true, data })); }
  @Get() list(@CurrentUser() user: { id: string }) { return this.bookings.listForCustomer(user.id).then((data) => ({ success: true, data })); }
  @Get(':id') get(@CurrentUser() user: { id: string; role: string }, @Param('id') id: string) { return this.bookings.get(id, user).then((data) => ({ success: true, data })); }
  private requireAdmin(user: { role: string }) { if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); }
}
