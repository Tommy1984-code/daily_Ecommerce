import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderDeadlineJob } from './order-deadline.job';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [OrderDeadlineJob],
})
export class SchedulerModule {}
