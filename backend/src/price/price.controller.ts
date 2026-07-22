import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import {
  ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PriceService } from './price.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { PriceQueryDto } from './dto/price-query.dto';
import { PriceResponseDto } from './dto/price-response.dto';
import { PaginatedResponse } from '../product/dto/pagination.dto';

@ApiTags('Product - Prices')
@ApiBearerAuth()
@Controller('product/prices')
export class PriceController {
  constructor(private readonly price: PriceService) {}

  @Get()
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List prices', description: 'Returns paginated list of item prices with item title.' })
  @ApiOkResponse({ description: 'Paginated list of prices' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async findAll(@Query() query: PriceQueryDto): Promise<PaginatedResponse<PriceResponseDto>> {
    return this.price.findAll(query);
  }

  @Get(':id')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'Get price by ID', description: 'Returns a single price detail with item info.' })
  @ApiOkResponse({ description: 'Price details' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Price not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PriceResponseDto> {
    return this.price.findOne(id);
  }
}
