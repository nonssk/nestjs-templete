import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import {
  ElasticsearchTransformer,
  ElasticsearchTransport,
} from 'winston-elasticsearch';

export interface LogData {
  message: any;
  level: string;
  meta: { [key: string]: any };
  timestamp?: string;
}

type PredefinedMetaType = {
  correlationId: string;
  operation: string;
  error: string;
  req: unknown;
  res: unknown;
};

type OtherMetaType = { [key: string]: unknown };

export type LogMetaType = PredefinedMetaType & OtherMetaType;

@Injectable()
export class ElasticSearchService {
  private logger: winston.Logger;
  private _defaultMeta: Partial<LogMetaType> = {
    correlationId: '',
    function: '',
    others: {},
  };

  constructor() {
    if (process.env.USE_ELASTIC === 'true') {
      const transports: winston.transport[] = [];

      transports.push(this.getElasticsearchTransport());

      this.logger = winston.createLogger({
        transports,
      });
    }
  }

  private getElasticsearchTransport() {
    const index = `logs-${process.env.ELASTIC_INDEX}`;

    const esTransport = new ElasticsearchTransport({
      level: 'info',
      clientOpts: {
        node: process.env.ELASTIC_HOST,
        auth: {
          username: process.env.ELASTIC_USER || '',
          password: process.env.ELASTIC_PASS || '',
        },
      },
      index,
      indexPrefix: process.env.ELASTIC_INDEX,
      dataStream: true,
      transformer: this.transformELKLogData,
      indexTemplate: {
        priority: 200,
        template: {
          settings: {
            index: {
              mapping: {
                total_fields: {
                  limit: '3000',
                },
              },
              refresh_interval: '5s',
              number_of_shards: '1',
              number_of_replicas: '0',
            },
          },
          mappings: {
            _source: {
              enabled: true,
            },
            properties: {
              severity: {
                index: true,
                type: 'keyword',
              },
              source: {
                index: true,
                type: 'keyword',
              },
              '@timestamp': {
                type: 'date',
              },
              '@version': {
                type: 'keyword',
              },
              fields: {
                dynamic: true,
                type: 'object',
              },
              message: {
                index: true,
                type: 'text',
              },
              'kubernetes.pod.name': {
                index: true,
                type: 'text',
              },
              pid: {
                index: true,
                type: 'int',
              },
              correlationId: {
                index: true,
                type: 'text',
              },
              operation: {
                index: true,
                type: 'text',
              },
              error: {
                index: false,
                type: 'text',
              },
            },
          },
        },
        index_patterns: [`${index}*`],
        data_stream: {},
        composed_of: [],
      },
    });

    esTransport.on('error', (error) => {
      console.error(`Logger error: ${error.message}`);
    });

    return esTransport;
  }

  private transformELKLogData(logData: LogData) {
    const transformed = ElasticsearchTransformer(logData) as any;
    // transformed['@version'] = this.serviceVersion;
    transformed['pid'] = process.pid;
    transformed['kubernetes.pod.name'] = process.env.K8S_POD_NAME || '';

    const { correlationId, operation, errors: error } = logData.meta;

    if (correlationId) transformed['correlationId'] = correlationId;
    if (operation) transformed['operation'] = operation;
    if (error) {
      let _error = error;
      if (typeof error !== 'string') _error = JSON.stringify(error);
      transformed['error'] = _error;
    }

    delete logData.meta.correlationId;
    delete logData.meta.function;

    return transformed;
  }

  info(message: string, meta?: Partial<LogMetaType> | undefined): void {
    if (process.env.USE_ELASTIC !== 'true') return;
    this.logger.info(message, { ...this._defaultMeta, ...meta });
  }

  error(message: string, meta?: Partial<LogMetaType> | undefined): void {
    if (process.env.USE_ELASTIC !== 'true') return;
    this.logger.error(message, { ...this._defaultMeta, ...meta });
  }

  debug(message: string, meta?: Partial<LogMetaType> | undefined): void {
    if (process.env.USE_ELASTIC !== 'true') return;
    this.logger.debug(message, { ...this._defaultMeta, ...meta });
  }

  warn(message: string, meta?: Partial<LogMetaType> | undefined): void {
    if (process.env.USE_ELASTIC !== 'true') return;
    this.logger.warn(message, { ...this._defaultMeta, ...meta });
  }

  async end(): Promise<void> {
    return new Promise((resolve) => {
      this.logger.end(() => {
        resolve();
      });
    });
  }
}
