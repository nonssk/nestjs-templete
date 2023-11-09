import { Module } from '@nestjs/common';
import { ElasticSearchService } from './elasticsearch.service';
import { ElasticSearchController } from './elasticsearch.controller';

@Module({
  controllers: [ElasticSearchController],
  providers: [ElasticSearchService],
})
export class ElasticSearchModule {}
