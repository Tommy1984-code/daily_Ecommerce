import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { LandMarkPriceService } from './land-mark-price.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { PaginationDto, PaginatedResponse } from '../product/dto/pagination.dto';
import {
  LandMarkResponseDto,
  ShopResponseDto,
  DeliveryDateResponseDto,
  TimeRangeResponseDto,
  LandMarkPriceResponseDto,
  CreateLandMarkPriceDto,
  UpdateLandMarkPriceDto,
} from './dto/land-mark-price-response.dto';

@ApiTags('Product - Land Mark Prices')
@ApiBearerAuth()
@Controller('product')
export class LandMarkPriceController {
  constructor(private readonly landMarkPrice: LandMarkPriceService) {}

  @Get('land-marks')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List land marks' })
  @ApiOkResponse({ description: 'List of land marks' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getLandMarks(): Promise<LandMarkResponseDto[]> {
    return this.landMarkPrice.findAllLandMarks();
  }

  @Get('shops')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List shops' })
  @ApiOkResponse({ description: 'List of shops' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getShops(): Promise<ShopResponseDto[]> {
    return this.landMarkPrice.findAllShops();
  }

  @Get('delivery-dates')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List delivery dates' })
  @ApiOkResponse({ description: 'List of delivery dates' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getDeliveryDates(): Promise<DeliveryDateResponseDto[]> {
    return this.landMarkPrice.findAllDeliveryDates();
  }

  @Get('time-ranges')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List time ranges' })
  @ApiOkResponse({ description: 'List of time ranges' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getTimeRanges(): Promise<TimeRangeResponseDto[]> {
    return this.landMarkPrice.findAllTimeRanges();
  }

  @Get('land-mark-prices')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List land mark prices', description: 'Returns paginated list of land mark prices with joins.' })
  @ApiOkResponse({ description: 'Paginated list of land mark prices' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getLandMarkPrices(@Query() query: PaginationDto): Promise<PaginatedResponse<LandMarkPriceResponseDto>> {
    return this.landMarkPrice.findAllLandMarkPrices(query);
  }

  @Post('land-mark-prices')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Create land mark price' })
  @ApiOkResponse({ description: 'Land mark price created' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async createLandMarkPrice(@Body() dto: CreateLandMarkPriceDto): Promise<LandMarkPriceResponseDto> {
    return this.landMarkPrice.createLandMarkPrice(dto);
  }

  @Patch('land-mark-prices/:id')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Update land mark price', description: 'Updates the price field.' })
  @ApiOkResponse({ description: 'Land mark price updated' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Land mark price not found' })
  async updateLandMarkPrice(@Param('id') id: string, @Body() dto: UpdateLandMarkPriceDto): Promise<LandMarkPriceResponseDto> {
    return this.landMarkPrice.updateLandMarkPrice(id, dto);
  }

  @Delete('land-mark-prices/:id')
  @RBAC('product', 'delete')
  @ApiOperation({ summary: 'Delete land mark price' })
  @ApiOkResponse({ description: 'Land mark price deleted' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Land mark price not found' })
  async removeLandMarkPrice(@Param('id') id: string): Promise<void> {
    return this.landMarkPrice.removeLandMarkPrice(id);
  }
}
