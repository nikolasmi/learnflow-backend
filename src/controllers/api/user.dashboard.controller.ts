import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserDashboardService } from 'src/services/user/user.dashboard.service';

@Controller('api/user-dashboard')
export class UserDashboardController {
  constructor(private readonly dashboardService: UserDashboardService) {}

  @Get(':id')
  async getDashboard(@Param('id', ParseIntPipe) userId: number) {
    return await this.dashboardService.getUserDashboard(userId);
  }
}
