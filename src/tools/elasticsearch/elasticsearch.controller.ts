import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ElasticSearchService } from './elasticsearch.service';

@Controller('es')
export class ElasticSearchController {
  constructor(private readonly elasticSearchService: ElasticSearchService) {}

  @Get()
  async sendInfo(@Res() res: Response) {
    const result = this.elasticSearchService.info(`Hi ES`);
    return res.status(HttpStatus.OK).respond('XXX-XX-XXXX', 'ok', result);
  }
}
