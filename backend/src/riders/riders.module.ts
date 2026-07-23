import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RidersController } from './riders.controller';
import { RidersService } from './riders.service';

@Module({
  imports: [PrismaModule],
  controllers: [RidersController],
  providers: [RidersService],
  exports: [RidersService],
})
export class RidersModule {}
