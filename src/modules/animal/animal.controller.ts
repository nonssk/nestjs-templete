import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { Response } from 'express';

@Controller('animals')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Get('/')
  async findAll(@Res() res: Response) {
    const result = await this.animalService.findAll();
    return res.status(HttpStatus.OK).respond('XXX-XX-XXXX', 'ok', result);
  }
}
