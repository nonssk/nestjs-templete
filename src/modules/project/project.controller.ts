import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Response } from 'express';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  async findAll(@Res() res: Response) {
    const result = await this.projectService.findAll();
    return res.status(HttpStatus.OK).respond('XXX-XX-XXXX', 'ok', result);
  }
}
