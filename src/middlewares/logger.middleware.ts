import { Injectable, Logger } from '@nestjs/common';
import {
  ElasticSearchService,
  LogMetaType,
} from '../tools/elasticsearch/elasticsearch.service';

@Injectable()
export class LoggerMiddleware {
  constructor(private readonly esLogger: ElasticSearchService) {}

  info(message: string, meta?: Partial<LogMetaType> | undefined): void {
    const { operation } = meta || {};
    const logger = new Logger(operation || LoggerMiddleware.name);
    logger.log(message, meta);
    this.esLogger.info(message, meta);
  }

  error(message: string, meta?: Partial<LogMetaType> | undefined): void {
    const { operation } = meta || {};
    const logger = new Logger(operation || LoggerMiddleware.name);
    logger.error(message, meta);
    this.esLogger.error(message, meta);
  }

  debug(message: string, meta?: Partial<LogMetaType> | undefined): void {
    const { operation } = meta || {};
    const logger = new Logger(operation || LoggerMiddleware.name);
    logger.debug(message, meta);
    this.esLogger.debug(message, meta);
  }

  warn(message: string, meta?: Partial<LogMetaType> | undefined): void {
    const { operation } = meta || {};
    const logger = new Logger(operation || LoggerMiddleware.name);
    logger.warn(message, meta);
    this.esLogger.warn(message, meta);
  }
}
