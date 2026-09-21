import { Controller, ForbiddenException, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { AnalyticsService } from './analytics.service.js';

type User = { id: string; role: string };
@Controller('admin/analytics') @ApiTags('admin-analytics') @ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get() @ApiOperation({ summary: 'Get aggregated admin dashboard analytics' })
  async dashboard(@CurrentUser() user: User, @Query('range') range?: string, @Query('from') from?: string, @Query('to') to?: string) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required');
    return { success: true, data: await this.analytics.dashboard({ range, from, to }) };
  }
}
