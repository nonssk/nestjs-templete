import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Res() res: Response) {
    const result = this.appService.getHello();
    return res.status(HttpStatus.OK).respond('XXX-XX-XXXX', 'ok', result);
  }

  @Get(':id')
  async getHelloId(@Req() req: Request) {
    const { id } = req.params;
    throw new HttpException(`Invalid ${id}`, HttpStatus.BAD_REQUEST);
  }
}
