import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface NotificationChannel {
  send(recipient: string, message: string): Promise<void>;
}

@Injectable()
export class NotificationsService {
  private channels: Map<string, NotificationChannel> = new Map();

  constructor(private readonly prisma: PrismaService) {
    this.channels.set('in_app', {
      send: async (_recipient: string, _message: string) => {
        // In-app notifications are stored in the DB as records
      },
    });
  }

  registerChannel(name: string, channel: NotificationChannel) {
    this.channels.set(name, channel);
  }

  async notify(
    orderId: string,
    type: string,
    message: string,
    channels: string[] = ['in_app'],
  ): Promise<void> {
    for (const channelName of channels) {
      const channel = this.channels.get(channelName);
      if (channel) {
        try {
          await channel.send(orderId, message);
        } catch (err) {
          console.error(`Notification channel ${channelName} failed for order ${orderId}:`, err);
        }
      }
    }

    await this.prisma.notification.create({
      data: {
        orderId,
        type,
        channel: channels.join(','),
        message,
        sentAt: new Date(),
      },
    });
  }
}
