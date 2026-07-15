import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { DiscountQueryDto } from './dto/discount-query.dto';
import { DiscountResponseDto } from './dto/discount-response.dto';
import { PaginatedResponse } from '../product/dto/pagination.dto';

@ApiTags('Product - Discounts')
@ApiBearerAuth()
@Controller('product/discounts')
export class DiscountController {
  constructor(private readonly discount: DiscountService) {}

  @Get()
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List discounts', description: 'Returns paginated list of item prices with active discounts.' })
  @ApiOkResponse({ description: 'Paginated list of discounts' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async findAll(@Query() query: DiscountQueryDto): Promise<PaginatedResponse<DiscountResponseDto>> {
    return this.discount.findAll(query);
  }

  @Get(':id')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'Get discount by ID', description: 'Returns a single discount detail.' })
  @ApiOkResponse({ description: 'Discount details' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Discount not found' })
  async findOne(@Param('id') id: string): Promise<DiscountResponseDto> {
    return this.discount.findOne(id);
  }
}
