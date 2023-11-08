import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectService {
  async findAll() {
    return ['cat', 'dog'];
  }
}
