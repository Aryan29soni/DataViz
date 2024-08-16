import { Injectable, NotFoundException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

@Injectable()
export class ReportsService {
  async generateReport(fileName: string): Promise<any> {
    const filePath = join(__dirname, '..', 'uploads', fileName);
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const summary = jsonData.reduce((acc, row) => {
      const category = row['Category'];
      const value = row['Value'];
      if (!acc[category]) {
        acc[category] = { sum: 0, count: 0 };
      }
      acc[category].sum += value;
      acc[category].count += 1;
      return acc;
    }, {});

    return summary;
  }
}
