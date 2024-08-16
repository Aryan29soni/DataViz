import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':fileName')
  async getReport(@Param('fileName') fileName: string) {
    return this.reportsService.generateReport(fileName);
  }
}
