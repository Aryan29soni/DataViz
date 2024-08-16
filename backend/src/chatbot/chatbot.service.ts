import { Injectable } from '@nestjs/common';
import { LanguageServiceClient } from '@google-cloud/language';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChatbotService {
  private languageClient: LanguageServiceClient;

  constructor(private databaseService: DatabaseService) {
    this.languageClient = new LanguageServiceClient();
  }

  async processMessage(userId: number, message: string): Promise<string> {
    const [syntaxResult] = await this.languageClient.analyzeSyntax({ document: { content: message, type: 'PLAIN_TEXT' } });
    const [entityResult] = await this.languageClient.analyzeEntities({ document: { content: message, type: 'PLAIN_TEXT' } });

    if (this.isDatabaseQuery(syntaxResult.tokens, entityResult.entities)) {
      try {
        const query = this.generateSQLQuery(message, syntaxResult.tokens, entityResult.entities);
        const result = await this.databaseService.executeQuery(userId, query);
        return this.formatQueryResult(result);
      } catch (error) {
        return `Error executing query: ${error.message}`;
      }
    }

    return this.generateGeneralResponse(message);
  }

  private isDatabaseQuery(tokens: any[], entities: any[]): boolean {
    const databaseKeywords = ['give', 'show', 'find', 'select', 'query', 'database'];
    return tokens.some(token => databaseKeywords.includes(token.text.content.toLowerCase())) ||
           entities.some(entity => entity.type === 'DATABASE' || entity.name.toLowerCase().includes('database'));
  }

  private generateSQLQuery(message: string, tokens: any[], entities: any[]): string {
    let conditions = [];


    if (message.toLowerCase().includes('age') && message.toLowerCase().includes('more than')) {
      const ageValue = tokens.find(token => !isNaN(token.text.content))?.text.content;
      if (ageValue) {
        conditions.push(`age > ${ageValue}`);
      }
    }


    entities.forEach(entity => {
      if (entity.type === 'PERSON' && message.toLowerCase().includes('name')) {
        conditions.push(`name LIKE '%${entity.name}%'`);
      }
    });


    tokens.forEach((token, index) => {
      if (token.text.content.toLowerCase() === 'salary' && tokens[index + 1]?.text.content === 'more' && tokens[index + 2]?.text.content === 'than') {
        const salaryValue = tokens[index + 3]?.text.content;
        if (salaryValue) {
          conditions.push(`salary > ${salaryValue.replace('K', '000')}`);
        }
      }
    });

    let query = `SELECT * FROM user_details`;
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    return query;
  }

  private formatQueryResult(result: any[]): string {
    if (result.length === 0) {
      return 'No results found.';
    }

    const headers = Object.keys(result[0]);
    let table = '| ' + headers.join(' | ') + ' |\n';
    table += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

    result.forEach(row => {
      table += '| ' + headers.map(header => row[header]).join(' | ') + ' |\n';
    });

    return '```\n' + table + '```';
  }

  private generateGeneralResponse(message: string): string {
    return " sorry I couldn't understand your query. Could you please rephrase it?";
  }
}