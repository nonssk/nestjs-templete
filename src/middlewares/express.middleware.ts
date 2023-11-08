/* eslint-disable @typescript-eslint/no-namespace */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Response {
      respond(resultCode: number, msg: string): any;
      respond(resultCode: string, msg: string): any;
      respond(resultCode: number, msg: string, data: any): any;
      respond(resultCode: string, msg: string, data: any): any;
      respond(resultCode: number, msg: string, data: any, metadata: any): any;
      respond(resultCode: string, msg: string, data: any, metadata: any): any;
    }
  }

  namespace http {
    interface ServerResponse {
      respond(): any;
    }
  }
}

@Injectable()
export class ExpressMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      res.respond = (
        resultCode: number | string,
        msg: string,
        data?: any,
        metadata?: any,
      ): void => {
        // * Construct response message
        const responseMessage = {
          _metadata: metadata,
          code: resultCode,
          msg,
          data,
        };

        if (data === undefined || data === null) {
          delete responseMessage.data;
        }

        if (!metadata) {
          delete responseMessage._metadata;
        }

        res.send(responseMessage);
        return;
      };
    } catch (error) {
      console.log(error);
    }
    next();
  }
}
