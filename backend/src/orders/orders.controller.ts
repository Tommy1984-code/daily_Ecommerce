import { Controller, Get, Post, Param, Query, Body, Req, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { OrderListResponseDto, OrderResponseDto } from './dto/order-response.dto';
import { FlagDeficiencyDto } from './dto/flag-deficiency.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { AdvanceStatusDto } from './dto/advance-status.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @RBAC('orders', 'read')
  @ApiOperation({ summary: 'List orders with filtering and pagination' })
  @ApiQuery({ name: 'status', required: false, description: 'Single status or comma-separated list' })
  @ApiQuery({ name: 'shopCode', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async findAll(
    @Query('status') status?: string,
    @Query('shopCode') shopCode?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Req() req?: any,
  ): Promise<OrderListResponseDto> {
    const userShop = req.user?.shopCode || 'all';
    return this.ordersService.findAll({ status, shopCode, search, page, limit, dateFrom, dateTo }, userShop);
  }

  @Get(':id')
  @RBAC('orders', 'read')
  @ApiOperation({ summary: 'Get order detail' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<OrderResponseDto> {
    return this.ordersService.findOne(id);
  }

  @Post(':id/confirm')
  @RBAC('orders', 'write')
  @HttpCode(200)
  @ApiOperation({ summary: 'Confirm order (New → Pending Payment)' })
  async confirmOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<OrderResponseDto> {
    return this.ordersService.confirmOrder(id, req.user.sub);
  }

  @Post(':id/flag-deficiency')
  @RBAC('orders', 'write')
  @HttpCode(200)
  @ApiOperation({ summary: 'Flag deficiency (New → Deficiency)' })
  async flagDeficiency(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: FlagDeficiencyDto,
    @Req() req: any,
  ): Promise<OrderResponseDto> {
    return this.ordersService.flagDeficiency(id, dto, req.user.sub);
  }

  @Post(':id/deficiency/resend-notification')
  @RBAC('orders', 'write')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resend deficiency notification to customer' })
  async resendDeficiency(@Param('id', ParseUUIDPipe) id: string): Promise<OrderResponseDto> {
    return this.ordersService.resendDeficiencyNotification(id);
  }

  @Post(':id/deficiency/respond')
  @RBAC('orders', 'write')
  @HttpCode(200)
  @ApiOperation({ summary: 'Respond to deficiency (accept or cancel)' })
  async respondDeficiency(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('action') action: 'accept' | 'cancel',
    @Req() req: any,
  ): Promise<OrderResponseDto> {
    return this.ordersService.respondDeficiency(id, action, req.user.sub);
  }

  @Post(':id/confirm-payment')
  @RBAC('orders', 'write')
  @HttpCode(200)
  @ApiOperation({ summary: 'Confirm payment (Pending Payment → Prepared)' })
  async confirmPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ConfirmPaymentDto,
    @Req() req: any,
  ): Promise<OrderResponseDto> {
    return this.ordersService.confirmPayment(id, dto, req.user.sub);
  }

  @Post(':id/advance-status')
  @RBAC('orders', 'write')
  @HttpCode(200)
  @ApiOperation({ summary: 'Advance status to next step (Prepared→Ready→Picked→Delivered)' })
  async advanceStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdvanceStatusDto,
    @Req() req: any,
  ): Promise<OrderResponseDto> {
    return this.ordersService.advanceStatus(id, dto, req.user.sub);
  }

  @Post(':id/cancel')
  @RBAC('orders', 'write')
  @HttpCode(200)
  @ApiOperation({ summary: 'Cancel order (requires reason)' })
  async cancelOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelOrderDto,
    @Req() req: any,
  ): Promise<OrderResponseDto> {
    return this.ordersService.cancelOrder(id, dto, req.user.sub);
  }

  @Get(':id/status-history')
  @RBAC('orders', 'read')
  @ApiOperation({ summary: 'Get order status change history' })
  async getStatusHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getStatusHistory(id);
  }
}
