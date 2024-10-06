import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly SeedService: SeedService) {}

  @Post()
  seed() {
    return this.SeedService.generateSeed();
  }
}
