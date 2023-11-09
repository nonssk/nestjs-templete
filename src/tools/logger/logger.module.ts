import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ElasticSearchService } from '../elasticsearch/elasticsearch.service';
@Module({
  providers: [LoggerService, ElasticSearchService],
})
export class LoggerModule {}
