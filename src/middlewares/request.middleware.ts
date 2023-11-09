/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../tools/logger/logger.service';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const requestStartTime = process.hrtime();
      this.getRequest(req);
      this.getResponse(req, res, requestStartTime);
      // res.on('finish', () => {
      //   const { statusCode } = res;
      //   const responseTime = this.getDiffTime(requestStartTime);
      //   this.es.info(
      //     `HTTP ${statusCode} ${method} ${originalUrl} ${responseTime}ms`,
      //   );
      // });
    } catch (error) {
      console.log(error);
    } finally {
      next();
    }
  }

  getDiffTime(startTime: [number, number]) {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(startTime);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
  }

  getRequest(req: Request) {
    const correlationId = req.headers['x-correlation-id'];

    let requestBody = '';
    try {
      if (!!req.body && req.body.constructor === Object) {
        requestBody = JSON.stringify(req.body);
      } else {
        requestBody = req.body;
      }
    } catch (err: unknown) {
      /* istanbul ignore next */
      requestBody = req.body;
    }

    this.logger.info(`HTTP ${req.method} ${req.originalUrl}`, {
      operation: 'HTTP Request',
      correlationId: correlationId ? (correlationId as string) : '',
      req: {
        url: req.url,
        headers: req.headers,
        method: req.method,
        httpVersion: req.httpVersion,
        originalUrl: req.originalUrl,
        query: req.query,
        body: requestBody,
      },
    });
  }

  getResponse(req: Request, res: Response, startTime: [number, number]) {
    const rawResponse = res.write;
    const rawResponseEnd = res.end;
    const chunkBuffers = [];
    res.write = (...chunks) => {
      const resArgs = [];
      for (let i = 0; i < chunks.length; i++) {
        resArgs[i] = chunks[i];
        if (!resArgs[i]) {
          res.once('drain', res.write);
          i--;
        }
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      return rawResponse.apply(res, resArgs);
    };

    res.end = (...chunk) => {
      const resArgs = [];
      for (let i = 0; i < chunk.length; i++) {
        resArgs[i] = chunk[i];
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      const body = Buffer.concat(chunkBuffers).toString('utf8');
      const responseLog = {
        response: {
          statusCode: res.statusCode,
          body: JSON.parse(body) || body || {},
          headers: res.getHeaders(),
        },
      };

      const correlationId = req.headers['x-correlation-id'];
      const duration = this.getDiffTime(startTime);
      this.logger.info(
        `HTTP ${res.statusCode} ${req.method} ${req.originalUrl} ${duration}ms`,
        {
          operation: 'HTTP Response',
          correlationId: correlationId ? (correlationId as string) : '',
          res: {
            statusCode: res.statusCode,
            body: body,
          },
        },
      );

      rawResponseEnd.apply(res, resArgs);
      return responseLog as unknown as Response;
    };
  }
}
