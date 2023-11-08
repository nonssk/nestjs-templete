import { Injectable } from '@nestjs/common';

@Injectable()
export class AnimalService {
  async findAll() {
    return ['cat', 'dog'];
  }
}
