import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('leads')
  async getLeads(@Query('query') query): Promise<LeadResponse[]> {
    return await this.appService.getLeadResponse(query);
  }
}
