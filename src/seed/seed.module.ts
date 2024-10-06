import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { SeedController } from './seed.controller';

@Module({
  providers: [SeedService],
  controllers: [SeedController],
  imports: [AuthModule],
})
export class SeedModule {}
