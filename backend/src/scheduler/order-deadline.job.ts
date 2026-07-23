import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderDeadlineJob {
  private readonly logger = new Logger(OrderDeadlineJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleDeficiencyDeadlines() {
    this.logger.log('Checking deficiency response deadlines...');

    const now = new Date();
    const expired = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.DEFICIENCY,
        deficiencyResponseDeadline: { lte: now },
      },
    });

    for (const order of expired) {
      await this.prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.CANCELED,
            canceledAt: now,
            cancellationReason: 'Auto-canceled: no customer response within deadline',
          },
        });
        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            fromStatus: OrderStatus.DEFICIENCY,
            toStatus: OrderStatus.CANCELED,
            reason: 'Auto-canceled: no customer response within deadline',
          },
        });
      });
      this.logger.log(`Order ${order.orderNo} auto-canceled due to deficiency deadline`);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handlePaymentDeadlines() {
    this.logger.log('Checking payment deadlines...');

    const now = new Date();
    const expired = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING_PAYMENT,
        paymentDeadline: { lte: now },
      },
    });

    for (const order of expired) {
      await this.prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.CANCELED,
            canceledAt: now,
            cancellationReason: 'Auto-canceled: payment deadline passed',
          },
        });
        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            fromStatus: OrderStatus.PENDING_PAYMENT,
            toStatus: OrderStatus.CANCELED,
            reason: 'Auto-canceled: payment deadline passed',
          },
        });
      });
      this.logger.log(`Order ${order.orderNo} auto-canceled due to payment deadline`);
    }
  }
}
