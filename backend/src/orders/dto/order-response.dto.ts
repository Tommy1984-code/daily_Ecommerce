import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, DeliveryMethod, PaymentMethod } from '@prisma/client';

class OrderItemDto {
  @ApiProperty() id: string;
  @ApiProperty() itemCode: string;
  @ApiProperty() itemDescription: string;
  @ApiProperty({ nullable: true }) uom?: string;
  @ApiProperty() quantityRequested: number;
  @ApiProperty({ nullable: true }) quantityAvailable?: number;
  @ApiProperty() unitPrice: number;
  @ApiProperty() totalPrice: number;
}

class StatusHistoryDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: OrderStatus }) fromStatus: OrderStatus;
  @ApiProperty({ enum: OrderStatus }) toStatus: OrderStatus;
  @ApiProperty({ nullable: true }) changedBy?: string;
  @ApiProperty({ nullable: true }) reason?: string;
  @ApiProperty() changedAt: string;
}

export class OrderResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() orderNo: string;
  @ApiProperty() shopCode: string;
  @ApiProperty() shopName: string;
  @ApiProperty() customerId: string;
  @ApiProperty() customerName: string;
  @ApiProperty() customerPhone: string;
  @ApiProperty({ nullable: true }) customerEmail?: string;
  @ApiProperty({ enum: OrderStatus }) status: OrderStatus;
  @ApiProperty() orderDate: string;
  @ApiProperty({ nullable: true }) deliveryDate?: string;
  @ApiProperty({ nullable: true }) deliveryTimeWindow?: string;
  @ApiProperty({ nullable: true, enum: DeliveryMethod }) deliveryMethod?: DeliveryMethod;
  @ApiProperty({ nullable: true }) deliveryLocation?: string;
  @ApiProperty({ nullable: true, enum: PaymentMethod }) paymentMethod?: PaymentMethod;
  @ApiProperty({ nullable: true }) bankName?: string;
  @ApiProperty({ nullable: true }) paymentReferenceNo?: string;
  @ApiProperty({ nullable: true }) paymentDescription?: string;
  @ApiProperty({ nullable: true }) shipToName?: string;
  @ApiProperty({ nullable: true }) shipToEmail?: string;
  @ApiProperty({ nullable: true }) shipToPhone?: string;
  @ApiProperty({ nullable: true }) shipToCity?: string;
  @ApiProperty({ nullable: true }) orderNote?: string;
  @ApiProperty() subtotal: number;
  @ApiProperty() total: number;
  @ApiProperty({ nullable: true }) deficiencyResponseDeadline?: string;
  @ApiProperty({ nullable: true }) paymentDeadline?: string;
  @ApiProperty({ nullable: true }) verifiedBy?: string;
  @ApiProperty({ nullable: true }) verifiedAt?: string;
  @ApiProperty({ nullable: true }) riderId?: string;
  @ApiProperty({ nullable: true }) riderName?: string;
  @ApiProperty({ nullable: true }) deliveredAt?: string;
  @ApiProperty({ nullable: true }) canceledAt?: string;
  @ApiProperty({ nullable: true }) canceledBy?: string;
  @ApiProperty({ nullable: true }) cancellationReason?: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
  @ApiProperty({ type: [OrderItemDto] }) items: OrderItemDto[];
  @ApiProperty({ type: [StatusHistoryDto] }) statusHistory: StatusHistoryDto[];
}

export class OrderListResponseDto {
  @ApiProperty({ type: [OrderResponseDto] }) data: OrderResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}
