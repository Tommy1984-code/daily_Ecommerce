import { Module } from '@nestjs/common';
import { LandMarkPriceController } from './land-mark-price.controller';
import { LandMarkPriceService } from './land-mark-price.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LandMarkPriceController],
  providers: [LandMarkPriceService],
  exports: [LandMarkPriceService],
})
export class LandMarkPriceModule {}
