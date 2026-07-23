import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';
import { OrderStateMachine } from './order-state-machine';
import { OrderResponseDto, OrderListResponseDto } from './dto/order-response.dto';
import { FlagDeficiencyDto } from './dto/flag-deficiency.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { AdvanceStatusDto } from './dto/advance-status.dto';

const ORDER_INCLUDE = {
  items: true,
  statusHistory: { orderBy: { changedAt: 'desc' as const } },
  customer: { select: { id: true, name: true, phone: true, email: true } },
  shop: { select: { locationCode: true, titleEn: true, address: true, phone: true } },
  rider: { select: { id: true, name: true, phone: true } },
  verifiedByStaff: { select: { id: true, name: true } },
  canceledByStaff: { select: { id: true, name: true } },
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: {
      status?: string;
      shopCode?: string;
      search?: string;
      page?: number;
      limit?: number;
      dateFrom?: string;
      dateTo?: string;
    },
    userShopCode?: string,
  ): Promise<OrderListResponseDto> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (query.status) {
      const statuses = query.status.split(',').map((s) => s.trim()).filter(Boolean) as OrderStatus[];
      if (statuses.length === 1) {
        where.status = statuses[0];
      } else if (statuses.length > 1) {
        where.status = { in: statuses };
      }
    }

    const effectiveShop = userShopCode === 'all' ? query.shopCode : userShopCode;
    if (effectiveShop) {
      where.shopCode = effectiveShop;
    }

    if (query.search) {
      const s = query.search;
      where.OR = [
        { orderNo: { contains: s, mode: 'insensitive' } },
        { customer: { name: { contains: s, mode: 'insensitive' } } },
        { customer: { phone: { contains: s } } },
      ];
    }

    if (query.dateFrom || query.dateTo) {
      where.orderDate = {};
      if (query.dateFrom) where.orderDate.gte = new Date(query.dateFrom);
      if (query.dateTo) where.orderDate.lte = new Date(query.dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: ORDER_INCLUDE,
        orderBy: { orderDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: data.map((o) => this.mapOrder(o)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });
    if (!order) throw new NotFoundException('Order not found');
    return this.mapOrder(order);
  }

  async confirmOrder(id: string, staffId: string): Promise<OrderResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!order) throw new NotFoundException('Order not found');

      OrderStateMachine.assertCanTransition(order.status, OrderStatus.PENDING_PAYMENT);

      const totals = this.calculateTotals(order.items);
      const updated = await tx.order.update({
        where: { id },
        data: {
          status: OrderStatus.PENDING_PAYMENT,
          ...totals,
        },
        include: ORDER_INCLUDE,
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          fromStatus: OrderStatus.NEW,
          toStatus: OrderStatus.PENDING_PAYMENT,
          changedBy: staffId,
        },
      });

      return this.mapOrder(updated);
    });
  }

  async flagDeficiency(
    id: string,
    dto: FlagDeficiencyDto,
    staffId: string,
  ): Promise<OrderResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!order) throw new NotFoundException('Order not found');

      const isReEdit = order.status === OrderStatus.DEFICIENCY;
      if (!isReEdit) {
        OrderStateMachine.assertCanTransition(order.status, OrderStatus.DEFICIENCY);
      }

      for (const item of dto.items) {
        const dbItem = order.items.find((i) => i.id === item.itemId);
        if (!dbItem) throw new NotFoundException(`Item ${item.itemId} not found in order`);
      }

      const hasDeficiency = dto.items.some(
        (di) => Number(di.quantityAvailable) < Number(order.items.find((i) => i.id === di.itemId)?.quantityRequested ?? 0),
      );
      if (!isReEdit && !hasDeficiency) {
        throw new BadRequestException('At least one item must have an available qty lower than requested to flag deficiency.');
      }

      const itemUpdates = dto.items.map((item) => {
        const dbItem = order.items.find((i) => i.id === item.itemId)!;
        const unitPrice = Number(dbItem.unitPrice);
        const isDeficient = Number(item.quantityAvailable) < Number(dbItem.quantityRequested);
        return tx.orderItem.update({
          where: { id: item.itemId },
          data: isDeficient
            ? { quantityAvailable: item.quantityAvailable, totalPrice: Number(item.quantityAvailable) * unitPrice }
            : { quantityAvailable: null, totalPrice: Number(dbItem.quantityRequested) * unitPrice },
        });
      });
      await Promise.all(itemUpdates);

      const updatedItems = await tx.orderItem.findMany({ where: { orderId: id } });
      const totals = this.calculateTotals(updatedItems);

      const deadline = new Date();
      deadline.setHours(deadline.getHours() + 24);

      const updated = await tx.order.update({
        where: { id },
        data: {
          status: OrderStatus.DEFICIENCY,
          deficiencyResponseDeadline: deadline,
          ...totals,
        },
        include: ORDER_INCLUDE,
      });

      if (!isReEdit) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            fromStatus: OrderStatus.NEW,
            toStatus: OrderStatus.DEFICIENCY,
            changedBy: staffId,
          },
        });
      } else {
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            fromStatus: OrderStatus.DEFICIENCY,
            toStatus: OrderStatus.DEFICIENCY,
            changedBy: staffId,
            reason: 'Deficiency items re-edited',
          },
        });
      }

      return this.mapOrder(updated);
    });
  }

  async resendDeficiencyNotification(id: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.DEFICIENCY) {
      throw new BadRequestException('Order is not in Deficiency status');
    }
    return this.mapOrder(order);
  }

  async respondDeficiency(
    id: string,
    action: 'accept' | 'cancel',
    staffId: string,
  ): Promise<OrderResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!order) throw new NotFoundException('Order not found');
      OrderStateMachine.assertCanTransition(order.status, OrderStatus.PENDING_PAYMENT);

      if (action === 'accept') {
        const itemUpdates = order.items
          .filter((i) => i.quantityAvailable !== null && Number(i.quantityAvailable) < Number(i.quantityRequested))
          .map((item) => {
            const newQty = Number(item.quantityAvailable);
            return tx.orderItem.update({
              where: { id: item.id },
              data: {
                totalPrice: newQty * Number(item.unitPrice),
              },
            });
          });
        if (itemUpdates.length > 0) await Promise.all(itemUpdates);

        const updatedItems = await tx.orderItem.findMany({ where: { orderId: id } });
        const totals = this.calculateTotals(updatedItems);
        const updated = await tx.order.update({
          where: { id },
          data: {
            status: OrderStatus.PENDING_PAYMENT,
            subtotal: totals.subtotal,
            total: totals.total,
          },
          include: ORDER_INCLUDE,
        });
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            fromStatus: OrderStatus.DEFICIENCY,
            toStatus: OrderStatus.PENDING_PAYMENT,
            changedBy: staffId,
            reason: 'Customer accepted reduced quantities',
          },
        });
        return this.mapOrder(updated);
      } else {
        const updated = await tx.order.update({
          where: { id },
          data: {
            status: OrderStatus.CANCELED,
            canceledAt: new Date(),
            canceledBy: staffId,
            cancellationReason: 'Customer declined deficiency offer',
          },
          include: ORDER_INCLUDE,
        });
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            fromStatus: OrderStatus.DEFICIENCY,
            toStatus: OrderStatus.CANCELED,
            changedBy: staffId,
            reason: 'Customer declined deficiency offer',
          },
        });
        return this.mapOrder(updated);
      }
    });
  }

  async confirmPayment(
    id: string,
    dto: ConfirmPaymentDto,
    staffId: string,
  ): Promise<OrderResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
      if (!order) throw new NotFoundException('Order not found');
      OrderStateMachine.assertCanTransition(order.status, OrderStatus.PREPARED);

      const updated = await tx.order.update({
        where: { id },
        data: {
          status: OrderStatus.PREPARED,
          verifiedBy: staffId,
          verifiedAt: new Date(),
          ...(dto.paymentReferenceNo && { paymentReferenceNo: dto.paymentReferenceNo }),
          ...(dto.paymentDescription && { paymentDescription: dto.paymentDescription }),
        },
        include: ORDER_INCLUDE,
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          fromStatus: order.status,
          toStatus: OrderStatus.PREPARED,
          changedBy: staffId,
        },
      });

      return this.mapOrder(updated);
    });
  }

  async advanceStatus(
    id: string,
    dto: AdvanceStatusDto,
    staffId: string,
  ): Promise<OrderResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
      if (!order) throw new NotFoundException('Order not found');

      let toStatus: OrderStatus;
      if (order.deliveryMethod === 'PICKUP' && order.status === OrderStatus.READY) {
        toStatus = OrderStatus.DELIVERED;
      } else {
        const nextStatuses = OrderStateMachine.availableTransitions(order.status).filter(
          (s) => s !== OrderStatus.CANCELED,
        );
        if (nextStatuses.length === 0) {
          throw new BadRequestException(`No forward transition available from ${order.status}`);
        }
        toStatus = nextStatuses[0];
      }

      const updateData: any = { status: toStatus };
      if (toStatus === OrderStatus.DELIVERED) {
        updateData.deliveredAt = new Date();
      }

      const updated = await tx.order.update({
        where: { id },
        data: updateData,
        include: ORDER_INCLUDE,
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          fromStatus: order.status,
          toStatus,
          changedBy: staffId,
        },
      });

      return this.mapOrder(updated);
    });
  }

  async cancelOrder(id: string, dto: CancelOrderDto, staffId: string): Promise<OrderResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
      if (!order) throw new NotFoundException('Order not found');
      OrderStateMachine.assertCanTransition(order.status, OrderStatus.CANCELED);

      const isPostPayment = ([
        OrderStatus.PREPARED,
        OrderStatus.READY,
        OrderStatus.PICKED,
      ] as OrderStatus[]).includes(order.status);

      if (isPostPayment && !dto.reason) {
        throw new BadRequestException('Cancellation reason is required after payment verification');
      }

      const updated = await tx.order.update({
        where: { id },
        data: {
          status: OrderStatus.CANCELED,
          canceledAt: new Date(),
          canceledBy: staffId,
          cancellationReason: dto.reason,
        },
        include: ORDER_INCLUDE,
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          fromStatus: order.status,
          toStatus: OrderStatus.CANCELED,
          changedBy: staffId,
          reason: dto.reason,
        },
      });

      return this.mapOrder(updated);
    });
  }

  async getStatusHistory(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.orderStatusHistory.findMany({
      where: { orderId: id },
      orderBy: { changedAt: 'desc' },
      include: { changedByStaff: { select: { id: true, name: true } } },
    });
  }

  private calculateTotals(items: { unitPrice: number | Prisma.Decimal; totalPrice: number | Prisma.Decimal; quantityRequested: number | Prisma.Decimal; quantityAvailable?: number | Prisma.Decimal | null }[]) {
    const subtotal = items.reduce((sum, item) => {
      const qty = item.quantityAvailable != null ? Number(item.quantityAvailable) : Number(item.quantityRequested);
      return sum + Number(item.unitPrice) * qty;
    }, 0);
    return { subtotal, total: subtotal };
  }

  private mapOrder(o: any): OrderResponseDto {
    return {
      id: o.id,
      orderNo: o.orderNo,
      shopCode: o.shopCode,
      shopName: o.shop?.titleEn || '',
      customerId: o.customerId,
      customerName: o.customer?.name || '',
      customerPhone: o.customer?.phone || '',
      customerEmail: o.customer?.email,
      status: o.status,
      orderDate: o.orderDate?.toISOString?.() || o.orderDate,
      deliveryDate: o.deliveryDate,
      deliveryTimeWindow: o.deliveryTimeWindow,
      deliveryMethod: o.deliveryMethod,
      deliveryLocation: o.deliveryLocation,
      paymentMethod: o.paymentMethod,
      bankName: o.bankName,
      paymentReferenceNo: o.paymentReferenceNo,
      paymentDescription: o.paymentDescription,
      shipToName: o.shipToName,
      shipToEmail: o.shipToEmail,
      shipToPhone: o.shipToPhone,
      shipToCity: o.shipToCity,
      orderNote: o.orderNote,
      subtotal: Number(o.subtotal),
      total: Number(o.total),
      deficiencyResponseDeadline: o.deficiencyResponseDeadline?.toISOString?.() || o.deficiencyResponseDeadline,
      paymentDeadline: o.paymentDeadline?.toISOString?.() || o.paymentDeadline,
      verifiedBy: o.verifiedBy,
      verifiedAt: o.verifiedAt?.toISOString?.() || o.verifiedAt,
      riderId: o.riderId,
      riderName: o.rider?.name,
      deliveredAt: o.deliveredAt?.toISOString?.() || o.deliveredAt,
      canceledAt: o.canceledAt?.toISOString?.() || o.canceledAt,
      canceledBy: o.canceledBy,
      cancellationReason: o.cancellationReason,
      createdAt: o.createdAt?.toISOString?.() || o.createdAt,
      updatedAt: o.updatedAt?.toISOString?.() || o.updatedAt,
      items: (o.items || []).map((i: any) => ({
        id: i.id,
        itemCode: i.itemCode,
        itemDescription: i.itemDescription,
        uom: i.uom,
        quantityRequested: Number(i.quantityRequested),
        quantityAvailable: i.quantityAvailable != null ? Number(i.quantityAvailable) : undefined,
        unitPrice: Number(i.unitPrice),
        totalPrice: Number(i.totalPrice),
      })),
      statusHistory: (o.statusHistory || []).map((h: any) => ({
        id: h.id,
        fromStatus: h.fromStatus,
        toStatus: h.toStatus,
        changedBy: h.changedBy,
        reason: h.reason,
        changedAt: h.changedAt?.toISOString?.() || h.changedAt,
      })),
    };
  }
}
