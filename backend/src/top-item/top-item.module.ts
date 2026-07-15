import { Module } from '@nestjs/common';
import { TopItemController } from './top-item.controller';
import { TopItemService } from './top-item.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TopItemController],
  providers: [TopItemService],
  exports: [TopItemService],
})
export class TopItemModule {}
