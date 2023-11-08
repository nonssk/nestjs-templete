/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const requestStartTime = process.hrtime();
      this.logResponse(req, res, requestStartTime);
    } catch (error) {
      console.log(error);
    } finally {
      next();
    }
  }

  logResponse(req: Request, res: Response, startTime: [number, number]) {
    const rawResponse = res.write;
    const rawResponseEnd = res.end;

    let chunkBuffers = [];
    res.write = (...chunks) => {
      const resArgs = [];
      for (let i = 0; i < chunks.length; i++) {
        if (chunks[i]) resArgs[i] = Buffer.from(chunks[i]);
        if (!chunks[i]) {
          res.once('drain', res.write);
          --i;
        }
      }
      if (Buffer.concat(resArgs)?.length) {
        chunkBuffers = [...chunkBuffers, ...resArgs];
      }
      return rawResponse.apply(res, resArgs);
    };

    res.end = (...chunks) => {
      const resArgs = [];
      for (let i = 0; i < chunks.length; i++) {
        if (chunks[i]) resArgs[i] = Buffer.from(chunks[i]);
      }

      if (Buffer.concat(resArgs)?.length) {
        chunkBuffers = [...chunkBuffers, ...resArgs];
      }

      res.setHeader('content-type', 'application/json');

      const body = Buffer.concat(chunkBuffers).toString('utf8');

      const responseLog = {
        response: {
          statusCode: res.statusCode,
          body: body,
          headers: res.getHeaders(),
        },
      };

      rawResponseEnd.apply(res, resArgs);
      const NS_PER_SEC = 1e9;
      const NS_TO_MS = 1e6;
      const diff = process.hrtime(startTime);
      const duration = (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
      this.logger.log(
        `HTTP ${res.statusCode} ${req.method} ${req.originalUrl} ${duration} ms`,
      );
      return responseLog as unknown as Response;
    };
  }
}
