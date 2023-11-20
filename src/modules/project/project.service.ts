import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../../schemas/project.schema';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Project.name) private ProjectModel: Model<Project>,
  ) {}

  async findAll() {
    try {
      return this.ProjectModel.find({}, {}, { lean: true }).exec();
    } catch (error) {
      this.logger.error(`Unable to get projects`);
      throw error;
    }
  }
}
