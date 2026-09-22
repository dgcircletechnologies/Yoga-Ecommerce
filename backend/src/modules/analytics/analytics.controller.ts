import { Controller, ForbiddenException, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { AnalyticsService } from './analytics.service.js';
@Controller('admin/analytics') @ApiTags('admin-analytics') @ApiBearerAuth()
export class AnalyticsController { constructor(private readonly service: AnalyticsService) {} @Get() async get(@CurrentUser() user: { role: string }, @Query('range') range?: string) { if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); return { success: true, data: await this.service.getDashboard(range) }; } }
