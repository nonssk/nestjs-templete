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
      const { method, originalUrl } = req;

      res.on('finish', () => {
        const { statusCode } = res;
        const responseTime = this.getDiffTime(requestStartTime);
        this.logger.log(
          `HTTP ${statusCode} ${method} ${originalUrl} ${responseTime}ms`,
        );
      });
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
}
