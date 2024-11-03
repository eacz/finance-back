import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { validRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly SeedService: SeedService) {}

  @Post()
  @Auth(validRoles.admin)
  seed() {
    return this.SeedService.generateSeed();
  }
}
