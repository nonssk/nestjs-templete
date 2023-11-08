import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Res() res: Response) {
    const result = this.appService.getHello();
    return res.status(HttpStatus.OK).respond('XXX-XX-XXXX', 'ok', result);
  }
}
